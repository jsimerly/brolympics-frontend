/**
 * Sign-in methods panel: linked providers show their identifier, missing ones
 * offer Link, and the previous-account flow proves ownership then merges --
 * one human, one account, every login method.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthMethods from './AuthMethods'

const {
  mockNotify,
  mockLinkGoogle,
  mockLinkEmail,
  mockPriorEmailToken,
  mockMerge,
  mockReload,
} = vi.hoisted(() => ({
  mockNotify: vi.fn(),
  mockLinkGoogle: vi.fn(),
  mockLinkEmail: vi.fn(),
  mockPriorEmailToken: vi.fn(),
  mockMerge: vi.fn(),
  mockReload: vi.fn(),
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    auth: {
      currentUser: {
        reload: mockReload,
        providerData: [
          { providerId: 'phone', phoneNumber: '+15555550100' },
        ],
      },
    },
  }),
}))
vi.mock('../Util/Notification', () => ({
  useNotification: () => ({ showNotification: mockNotify }),
}))
vi.mock('../../api/auth', () => ({ mergePriorAccount: mockMerge }))
vi.mock('../../firebase/linkMethods', () => ({
  linkGoogle: mockLinkGoogle,
  linkEmailPassword: mockLinkEmail,
  startPhoneLink: vi.fn(),
  priorAccountTokenWithEmail: mockPriorEmailToken,
  priorAccountTokenWithGoogle: vi.fn(),
  startPriorAccountPhoneProof: vi.fn(),
}))

describe('AuthMethods', () => {
  beforeEach(() => {
    mockNotify.mockClear()
    mockLinkGoogle.mockReset().mockResolvedValue({})
    mockLinkEmail.mockReset().mockResolvedValue({})
    mockPriorEmailToken.mockReset().mockResolvedValue('old-token')
    mockMerge.mockReset().mockResolvedValue({
      merged: true, players: 2, leagues_owned: 1, member_of: 1,
      admin_of: 0, brolympics_joined: 1, legacy_team_slots: 0, conflicts: [],
    })
    mockReload.mockReset().mockResolvedValue()
  })

  it('shows the linked phone number and offers Link for the rest', () => {
    render(<AuthMethods />)
    expect(screen.getByText('+15555550100')).toBeInTheDocument()
    // phone is linked; email + google each offer a Link button
    expect(screen.getAllByRole('button', { name: 'Link' })).toHaveLength(2)
  })

  it('linking Google goes straight to the popup and celebrates in green', async () => {
    const user = userEvent.setup()
    render(<AuthMethods />)
    // buttons render in METHODS order: email first, google second
    await user.click(screen.getAllByRole('button', { name: 'Link' })[1])
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        'Google is now linked to this account.', 'success'
      )
    )
    expect(mockLinkGoogle).toHaveBeenCalled()
    expect(mockReload).toHaveBeenCalled()
  })

  it('linking email & password sends the entered credentials', async () => {
    const user = userEvent.setup()
    render(<AuthMethods />)
    await user.click(screen.getAllByRole('button', { name: 'Link' })[0])
    await user.type(screen.getByPlaceholderText('Email'), 'me@bro.test')
    await user.type(screen.getByPlaceholderText('New password'), 'hunter22!')
    await user.click(
      screen.getByRole('button', { name: 'Link email & password' })
    )
    await waitFor(() =>
      expect(mockLinkEmail).toHaveBeenCalledWith(
        expect.anything(), 'me@bro.test', 'hunter22!'
      )
    )
  })

  it('merging a previous email account proves ownership then merges', async () => {
    const user = userEvent.setup()
    render(<AuthMethods />)
    await user.click(screen.getByRole('button', { name: 'Email' }))
    await user.type(
      screen.getByPlaceholderText("Old account's email"), 'old@bro.test'
    )
    await user.type(screen.getByPlaceholderText('Its password'), 'old-pass')
    await user.click(screen.getByRole('button', { name: 'Verify & merge' }))
    await waitFor(() => expect(mockMerge).toHaveBeenCalledWith('old-token'))
    expect(mockPriorEmailToken).toHaveBeenCalledWith('old@bro.test', 'old-pass')
    expect(mockNotify).toHaveBeenCalledWith(
      expect.stringContaining('Accounts merged'), 'success'
    )
  })

  it('a same-league identity conflict is surfaced, not swallowed', async () => {
    mockMerge.mockResolvedValue({
      merged: true, players: 0, leagues_owned: 0, member_of: 0,
      admin_of: 0, brolympics_joined: 0, legacy_team_slots: 0,
      conflicts: ['BSU Boys'],
    })
    const user = userEvent.setup()
    render(<AuthMethods />)
    await user.click(screen.getByRole('button', { name: 'Email' }))
    await user.type(
      screen.getByPlaceholderText("Old account's email"), 'old@bro.test'
    )
    await user.type(screen.getByPlaceholderText('Its password'), 'old-pass')
    await user.click(screen.getByRole('button', { name: 'Verify & merge' }))
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        expect.stringContaining('BSU Boys'), 'success'
      )
    )
  })
})
