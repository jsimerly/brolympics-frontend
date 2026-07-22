/**
 * The wizard's all-or-nothing create -- the seam that orphaned Summer 2026 in
 * prod (bro created, first event 500'd, ghost haunted the hamburger). Pins:
 * rollback on event failure, the original error surviving a failed rollback,
 * and warnings collected on success.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBroWithEvents, createLeagueWithBro } from './wizard'

const {
  mockCreateBro,
  mockDeleteBro,
  mockCreateEvent,
  mockCreateLeague,
  mockDeleteLeague,
} = vi.hoisted(() => ({
  mockCreateBro: vi.fn(),
  mockDeleteBro: vi.fn(),
  mockCreateEvent: vi.fn(),
  mockCreateLeague: vi.fn(),
  mockDeleteLeague: vi.fn(),
}))

vi.mock('./brolympics', () => ({
  createBrolympics: mockCreateBro,
  deleteBrolympics: mockDeleteBro,
}))
vi.mock('./events', () => ({
  createEvent: mockCreateEvent,
  defaultStagesFor: () => [{ structure: 'round_robin', config: {} }],
}))
vi.mock('./leagues', () => ({
  createLeague: mockCreateLeague,
  deleteLeague: mockDeleteLeague,
}))

const EVENTS = [
  { name: 'Cornhole', format: 'h2h' },
  { name: 'Bowling', format: 'ind' },
]

describe('createBroWithEvents', () => {
  beforeEach(() => {
    mockCreateBro.mockReset().mockResolvedValue({ uuid: 'bro-1' })
    mockDeleteBro.mockReset().mockResolvedValue({})
    mockCreateEvent.mockReset().mockResolvedValue({ warnings: [] })
  })

  it('creates the bro then every event and collects warnings', async () => {
    mockCreateEvent
      .mockResolvedValueOnce({ warnings: ['odd field splits 3/2.'] })
      .mockResolvedValueOnce({ warnings: [] })
    const result = await createBroWithEvents({ name: 'Summer 2026' }, EVENTS)
    expect(result.bro.uuid).toBe('bro-1')
    expect(result.warnings).toEqual(['Cornhole: odd field splits 3/2.'])
    expect(mockCreateEvent).toHaveBeenCalledTimes(2)
    expect(mockDeleteBro).not.toHaveBeenCalled()
  })

  it('deletes the orphan bro when an event fails, then rethrows', async () => {
    const boom = { response: { status: 500 } }
    mockCreateEvent.mockRejectedValueOnce(boom)
    await expect(
      createBroWithEvents({ name: 'Summer 2026' }, EVENTS)
    ).rejects.toBe(boom)
    expect(mockDeleteBro).toHaveBeenCalledWith('bro-1')
  })

  it('surfaces the original error even when the rollback itself fails', async () => {
    const boom = { response: { status: 500 } }
    mockCreateEvent.mockRejectedValueOnce(boom)
    mockDeleteBro.mockRejectedValueOnce(new Error('rollback down too'))
    await expect(
      createBroWithEvents({ name: 'Summer 2026' }, EVENTS)
    ).rejects.toBe(boom)
  })

  it('never deletes anything when the bro itself failed to create', async () => {
    mockCreateBro.mockRejectedValueOnce({ response: { status: 400 } })
    await expect(createBroWithEvents({}, EVENTS)).rejects.toBeTruthy()
    expect(mockDeleteBro).not.toHaveBeenCalled()
    expect(mockCreateEvent).not.toHaveBeenCalled()
  })
})

describe('createLeagueWithBro (the from-scratch StartLeague wizard)', () => {
  beforeEach(() => {
    mockCreateLeague.mockReset().mockResolvedValue({ uuid: 'league-1' })
    mockDeleteLeague.mockReset().mockResolvedValue({})
    mockCreateBro.mockReset().mockResolvedValue({ uuid: 'bro-1' })
    mockDeleteBro.mockReset().mockResolvedValue({})
    mockCreateEvent.mockReset().mockResolvedValue({ warnings: [] })
  })

  it('creates league then bro (tagged with the league uuid) then events', async () => {
    const result = await createLeagueWithBro(
      { name: 'BSU Boys' },
      { name: 'Summer 2026' },
      EVENTS
    )
    expect(result.league.uuid).toBe('league-1')
    expect(result.bro.uuid).toBe('bro-1')
    expect(mockCreateBro).toHaveBeenCalledWith({
      name: 'Summer 2026',
      league: 'league-1',
    })
    expect(mockDeleteLeague).not.toHaveBeenCalled()
  })

  it('deletes the fresh league when the bro fails, then rethrows', async () => {
    const boom = { response: { status: 500 } }
    mockCreateBro.mockRejectedValueOnce(boom)
    await expect(
      createLeagueWithBro({ name: 'BSU Boys' }, {}, EVENTS)
    ).rejects.toBe(boom)
    expect(mockDeleteLeague).toHaveBeenCalledWith('league-1')
  })

  it('unwinds BOTH the bro and the league when an event fails', async () => {
    const boom = { response: { status: 500 } }
    mockCreateEvent.mockRejectedValueOnce(boom)
    await expect(
      createLeagueWithBro({ name: 'BSU Boys' }, {}, EVENTS)
    ).rejects.toBe(boom)
    expect(mockDeleteBro).toHaveBeenCalledWith('bro-1')
    expect(mockDeleteLeague).toHaveBeenCalledWith('league-1')
  })

  it('surfaces the original error even when the league rollback fails', async () => {
    const boom = { response: { status: 500 } }
    mockCreateEvent.mockRejectedValueOnce(boom)
    mockDeleteLeague.mockRejectedValueOnce(new Error('rollback down too'))
    await expect(
      createLeagueWithBro({ name: 'BSU Boys' }, {}, EVENTS)
    ).rejects.toBe(boom)
  })

  it('never deletes anything when the league itself failed to create', async () => {
    mockCreateLeague.mockRejectedValueOnce({ response: { status: 400 } })
    await expect(createLeagueWithBro({}, {}, EVENTS)).rejects.toBeTruthy()
    expect(mockDeleteLeague).not.toHaveBeenCalled()
    expect(mockCreateBro).not.toHaveBeenCalled()
  })
})
