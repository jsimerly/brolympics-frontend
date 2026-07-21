/**
 * Google sign-in must land on the stashed invite path (location.state.from)
 * -- one of the four auth surfaces that once dropped it.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import LoginWithGoogle from './LoginWithGoogle'

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

describe('LoginWithGoogle', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockLogin.mockClear()
  })

  it('lands on the stashed invite path after the Google popup resolves', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/auth/login', state: { from: '/invite/brolympics/xyz' } },
        ]}
      >
        <LoginWithGoogle setError={vi.fn()} />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/invite/brolympics/xyz')
    )
    expect(mockLogin).toHaveBeenCalledWith('google')
  })

  it('surfaces a failed popup instead of navigating', async () => {
    mockLogin.mockRejectedValueOnce(new Error('popup closed'))
    const setError = vi.fn()
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <LoginWithGoogle setError={setError} />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))
    await waitFor(() => expect(setError).toHaveBeenCalledWith('popup closed'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
