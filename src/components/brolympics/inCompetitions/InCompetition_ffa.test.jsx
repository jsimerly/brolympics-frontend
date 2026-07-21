/**
 * The heat scorecard -- tap racers in finish order (taps, not drags: the
 * commissioner ruled dragging fights the scroll). Pins: tap numbering, the
 * auto-filled last racer, un-tapping, and the exact placements payload.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import InCompetition_ffa from './InCompetition_ffa'

const { mockRecord, mockAbandon, mockNotify } = vi.hoisted(() => ({
  mockRecord: vi.fn(),
  mockAbandon: vi.fn(),
  mockNotify: vi.fn(),
}))

vi.mock('../../../api/client', () => ({
  recordContest: mockRecord,
  abandonContest: mockAbandon,
}))

// the provider only stores state (the banner renders in the app shell), so
// spy on the hook and assert the copy directly
vi.mock('../../Util/Notification', () => ({
  useNotification: () => ({ showNotification: mockNotify }),
}))

const reload = vi.fn()
beforeAll(() => {
  // jsdom throws "Not implemented: navigation" on the app-wide reload quirk
  delete window.location
  window.location = { reload }
})

const contest = {
  uuid: 'heat-1',
  event_name: 'Mario Kart',
  entries: [
    { player: 'p1', player_name: 'Jacob', team_name: 'Kazakhstan' },
    { player: 'p2', player_name: 'Danny', team_name: 'Greece' },
    { player: 'p3', player_name: 'Tyler', team_name: 'Qatar' },
    { player: 'p4', player_name: 'Sam', team_name: 'Chad' },
  ],
}

const setup = () => render(<InCompetition_ffa contest={contest} />)
const racerButton = (name) =>
  screen.getByRole('button', { name: new RegExp(name) })

describe('InCompetition_ffa', () => {
  beforeEach(() => {
    mockRecord.mockClear()
    mockNotify.mockClear()
    reload.mockClear()
  })

  it('numbers racers in tap order and auto-fills the last one', () => {
    setup()
    fireEvent.click(racerButton('Tyler')) // 1st
    fireEvent.click(racerButton('Jacob')) // 2nd
    expect(racerButton('Tyler')).toHaveTextContent('1')
    expect(racerButton('Jacob')).toHaveTextContent('2')
    fireEvent.click(racerButton('Sam')) // 3rd -- Danny is decided
    expect(racerButton('Sam')).toHaveTextContent('3')
    expect(racerButton('Danny')).toHaveTextContent('4') // auto-filled
  })

  it('un-taps a placed racer and shifts everyone after up', () => {
    setup()
    fireEvent.click(racerButton('Tyler'))
    fireEvent.click(racerButton('Jacob'))
    fireEvent.click(racerButton('Tyler')) // undo 1st
    expect(racerButton('Jacob')).toHaveTextContent('1')
  })

  it('refuses to submit an unfinished order', async () => {
    setup()
    fireEvent.click(racerButton('Tyler'))
    fireEvent.click(screen.getByRole('button', { name: /submit placements/i }))
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        'Tap every racer in the order they finished.', expect.anything()
      )
    )
    expect(mockRecord).not.toHaveBeenCalled()
  })

  it('records the exact tap order as placements and reloads', async () => {
    mockRecord.mockResolvedValueOnce({})
    setup()
    fireEvent.click(racerButton('Tyler'))
    fireEvent.click(racerButton('Jacob'))
    fireEvent.click(racerButton('Sam')) // Danny auto-fills 4th
    fireEvent.click(screen.getByRole('button', { name: /submit placements/i }))
    await waitFor(() =>
      expect(mockRecord).toHaveBeenCalledWith('heat-1', {
        placements: { p3: 1, p1: 2, p4: 3, p2: 4 },
      })
    )
    await waitFor(() => expect(reload).toHaveBeenCalled())
  })

  it('surfaces the API rejection instead of reloading', async () => {
    mockRecord.mockRejectedValueOnce({
      response: { status: 400, data: ['This contest is already recorded.'] },
    })
    setup()
    fireEvent.click(racerButton('Tyler'))
    fireEvent.click(racerButton('Jacob'))
    fireEvent.click(racerButton('Sam'))
    fireEvent.click(screen.getByRole('button', { name: /submit placements/i }))
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        'This contest is already recorded.', expect.anything()
      )
    )
    expect(reload).not.toHaveBeenCalled()
  })
})
