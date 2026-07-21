/**
 * The check-in card and the station limit: a fresh render with full stations
 * shows a busy note instead of Start Game, and a stale browser that clicks
 * anyway gets the server's message in the banner instead of silence.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import AvailableCompetition from './AvailableCompetition'

const { mockStart, mockNotify } = vi.hoisted(() => ({
  mockStart: vi.fn(),
  mockNotify: vi.fn(),
}))

vi.mock('../../../api/client', () => ({
  startContest: mockStart,
}))

// the provider only stores state (the banner renders in the app shell), so
// spy on the hook and assert the copy directly
vi.mock('../../Util/Notification', () => ({
  useNotification: () => ({ showNotification: mockNotify }),
}))

const contest = {
  uuid: 'game-1',
  event_name: 'Cornhole',
  format: 'h2h',
  entries: [
    { team: 't1', team_name: 'Dynasty', team_img: null, seed: null },
    { team: 't2', team_name: 'Qatar', team_img: null, seed: null },
  ],
}

const setup = (props = {}) =>
  render(
    <MemoryRouter>
      <AvailableCompetition {...contest} {...props} />
    </MemoryRouter>
  )

describe('AvailableCompetition station limit', () => {
  beforeEach(() => {
    mockStart.mockClear()
    mockNotify.mockClear()
  })

  it('hides Start Game entirely when the stations are full', () => {
    setup({ stations_full: true })
    expect(screen.queryByRole('button', { name: /start game/i })).toBeNull()
    expect(screen.getByText(/all stations busy/i)).toBeInTheDocument()
  })

  it('shows Start Game when a station is open', () => {
    setup({ stations_full: false })
    expect(
      screen.getByRole('button', { name: /start game/i })
    ).toBeInTheDocument()
  })

  it('surfaces the server message when a stale browser checks in anyway', async () => {
    mockStart.mockRejectedValueOnce({
      response: {
        status: 400,
        data: [
          'Every station for this event is in use -- check in when one frees up.',
        ],
      },
    })
    setup({ stations_full: false }) // rendered before the board filled
    fireEvent.click(screen.getByRole('button', { name: /start game/i }))
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        'Every station for this event is in use -- check in when one frees up.',
        expect.anything()
      )
    )
  })
})
