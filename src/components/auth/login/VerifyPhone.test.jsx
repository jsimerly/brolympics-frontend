/**
 * Phone verification is the auth surface that historically NEVER navigated
 * after login (the invite regression's worst case). It must confirm the code
 * and land on location.state.from.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import VerifyPhone from './VerifyPhone'

const { mockNavigate, mockLogin } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockLogin: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

const renderAt = (state) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/auth/verify', state }]}>
      <VerifyPhone />
    </MemoryRouter>
  )

describe('VerifyPhone', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockLogin.mockClear()
  })

  it('confirms the six digits and lands on the stashed invite path', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    renderAt({
      verificationId: 'ver-123',
      phoneNumber: '+15555555555',
      from: '/invite/team/abc',
    })
    const boxes = screen.getAllByRole('textbox')
    '123456'.split('').forEach((digit, i) =>
      fireEvent.change(boxes[i], { target: { value: digit } })
    )
    fireEvent.click(screen.getByRole('button', { name: /confirm code/i }))
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/invite/team/abc')
    )
    expect(mockLogin).toHaveBeenCalledWith('phone', {
      verificationId: 'ver-123',
      verificationCode: '123456',
    })
  })

  it('bounces back to login when there is no verification in flight', async () => {
    renderAt(undefined)
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/auth/login'))
  })

  it('shows the error and stays put on a bad code', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid code'))
    renderAt({ verificationId: 'ver-123', phoneNumber: '+15555555555' })
    const boxes = screen.getAllByRole('textbox')
    '000000'.split('').forEach((digit, i) =>
      fireEvent.change(boxes[i], { target: { value: digit } })
    )
    fireEvent.click(screen.getByRole('button', { name: /confirm code/i }))
    expect(await screen.findByText('Invalid code')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalledWith('/')
  })
})
