/**
 * The invite deep-link regression, at component level: signing in must land
 * on location.state.from (the invite that sent you to the auth wall), not
 * home. All four auth surfaces once dropped it; this pins the email one --
 * the same pattern (mock AuthContext + useNavigate) covers the others.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import LoginWithEmail from './LoginWithEmail'

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

const signIn = async () => {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'bro@brolympic.test' },
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'Str0ng!pass' },
  })
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
}

describe('LoginWithEmail', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockLogin.mockClear()
  })

  it('lands on the stashed invite path after signing in', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/auth/login', state: { from: '/invite/team/abc' } },
        ]}
      >
        <LoginWithEmail setError={vi.fn()} />
      </MemoryRouter>
    )
    await signIn()
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/invite/team/abc')
    )
    expect(mockLogin).toHaveBeenCalledWith('email', {
      email: 'bro@brolympic.test',
      password: 'Str0ng!pass',
    })
  })

  it('lands home when nothing sent us here', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <LoginWithEmail setError={vi.fn()} />
      </MemoryRouter>
    )
    await signIn()
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })

  it('surfaces a failed login instead of navigating', async () => {
    mockLogin.mockRejectedValueOnce(new Error('bad password'))
    const setError = vi.fn()
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/auth/login', state: { from: '/invite/team/abc' } },
        ]}
      >
        <LoginWithEmail setError={setError} />
      </MemoryRouter>
    )
    await signIn()
    await waitFor(() => expect(setError).toHaveBeenCalledWith('bad password'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
