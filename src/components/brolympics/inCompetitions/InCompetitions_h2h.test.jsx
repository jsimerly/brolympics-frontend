/**
 * The h2h scorecard -- the surface where the integer-only regex once made
 * K1 lap times untypeable and the submit button once shipped invisible.
 * Pins: decimal typing, the both-scores gate, and the exact record payload.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import InCompetitions_h2h from './InCompetitions_h2h'

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
  uuid: 'game-1',
  event_name: 'Spikeball',
  entries: [
    { team: 't1', team_name: 'Dynasty', team_img: null, seed: 1 },
    { team: 't2', team_name: 'Qatar', team_img: null, seed: 4 },
  ],
}

const setup = () => render(<InCompetitions_h2h contest={contest} />)

describe('InCompetitions_h2h', () => {
  beforeEach(() => {
    mockRecord.mockClear()
    mockNotify.mockClear()
    reload.mockClear()
  })

  it('accepts decimal typing and rejects junk in place', () => {
    setup()
    const [box1] = screen.getAllByPlaceholderText('0')
    fireEvent.change(box1, { target: { value: '50.25' } })
    expect(box1).toHaveValue('50.25')
    fireEvent.change(box1, { target: { value: '50.25x' } })
    expect(box1).toHaveValue('50.25') // junk never lands
  })

  it('demands a score for both teams before calling the API', async () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: /submit score/i }))
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        'Enter a score for both teams', expect.anything()
      )
    )
    expect(mockRecord).not.toHaveBeenCalled()
  })

  it('records both scores as numbers and reloads', async () => {
    mockRecord.mockResolvedValueOnce({})
    setup()
    const [box1, box2] = screen.getAllByPlaceholderText('0')
    fireEvent.change(box1, { target: { value: '21' } })
    fireEvent.change(box2, { target: { value: '15.5' } })
    fireEvent.click(screen.getByRole('button', { name: /submit score/i }))
    await waitFor(() =>
      expect(mockRecord).toHaveBeenCalledWith('game-1', {
        scores: { t1: 21, t2: 15.5 },
      })
    )
    await waitFor(() => expect(reload).toHaveBeenCalled())
  })

  it('surfaces the API rejection instead of reloading', async () => {
    mockRecord.mockRejectedValueOnce({
      response: { status: 400, data: ['This contest is already recorded.'] },
    })
    setup()
    const [box1, box2] = screen.getAllByPlaceholderText('0')
    fireEvent.change(box1, { target: { value: '21' } })
    fireEvent.change(box2, { target: { value: '15' } })
    fireEvent.click(screen.getByRole('button', { name: /submit score/i }))
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        'This contest is already recorded.', expect.anything()
      )
    )
    expect(reload).not.toHaveBeenCalled()
  })
})
