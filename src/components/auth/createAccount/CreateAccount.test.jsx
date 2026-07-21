/**
 * Account creation must land on the stashed invite path too -- new users
 * arriving through an invite link were the common case at league launch.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import CreateAccount from './CreateAccount'

const { mockNavigate, mockSignUp } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSignUp: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ signUp: mockSignUp, login: vi.fn() }),
}))

const fillAndSubmit = ({ password = 'FakeTestPassw0rd!', confirm = 'FakeTestPassw0rd!' } = {}) => {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'new@brolympic.test' },
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: password },
  })
  fireEvent.change(screen.getByLabelText('Confirm Password'), {
    target: { value: confirm },
  })
  fireEvent.click(screen.getByRole('button', { name: /create account/i }))
}

describe('CreateAccount', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockSignUp.mockClear()
  })

  it('signs up and lands on the stashed invite path', async () => {
    mockSignUp.mockResolvedValueOnce(undefined)
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/auth/signup', state: { from: '/invite/league/xyz' } },
        ]}
      >
        <CreateAccount />
      </MemoryRouter>
    )
    fillAndSubmit()
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/invite/league/xyz')
    )
    expect(mockSignUp).toHaveBeenCalledWith('new@brolympic.test', 'FakeTestPassw0rd!')
  })

  it('catches a password mismatch before ever calling signUp', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/signup']}>
        <CreateAccount />
      </MemoryRouter>
    )
    fillAndSubmit({ confirm: 'different' })
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
    expect(mockSignUp).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
