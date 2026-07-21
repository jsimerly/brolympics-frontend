/**
 * The app's most historically fragile choreography, end to end: an
 * unauthenticated visit to an invite link stashes it and bounces to login;
 * an authenticated arrival with a stashed invite resumes it. Real router,
 * real routes -- only the auth context is mocked.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { NotificationProvider } from './components/Util/Notification'
import App from './App'

const { authState } = vi.hoisted(() => ({ authState: { current: {} } }))

vi.mock('./context/AuthContext.jsx', () => ({
  useAuth: () => authState.current,
}))

const renderAt = (path) =>
  render(
    <NotificationProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </NotificationProvider>
  )

describe('App invite choreography', () => {
  afterEach(() => sessionStorage.clear())

  it('bounces an unauthenticated invite visit to login and stashes the path', async () => {
    authState.current = { firebaseUser: null, user: null, loading: false }
    renderAt('/invite/team/abc')
    // landed on the auth wall...
    expect(
      await screen.findByText(/sign in with google/i)
    ).toBeInTheDocument()
    // ...with the invite remembered for after sign-in
    expect(sessionStorage.getItem('pendingInvite')).toBe('/invite/team/abc')
  })

  it('resumes the stashed invite once a user is signed in', async () => {
    sessionStorage.setItem('pendingInvite', '/invite/team/abc')
    authState.current = {
      firebaseUser: { uid: 'u1' },
      user: { account_complete: true },
      loading: false,
    }
    renderAt('/')
    // the resume consumes the stash (navigate fired to the invite route)
    await waitFor(() =>
      expect(sessionStorage.getItem('pendingInvite')).toBeNull()
    )
    expect(screen.queryByText(/sign in with google/i)).not.toBeInTheDocument()
  })

  it('shows the loading gate, never a flash of the wrong page, while auth resolves', () => {
    authState.current = { firebaseUser: null, user: null, loading: true }
    renderAt('/invite/team/abc')
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    // undecided auth must not stash or bounce yet
    expect(sessionStorage.getItem('pendingInvite')).toBeNull()
  })
})
