/**
 * The wizard's all-or-nothing create -- the seam that orphaned Summer 2026 in
 * prod (bro created, first event 500'd, ghost haunted the hamburger). Pins:
 * rollback on event failure, the original error surviving a failed rollback,
 * and warnings collected on success.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBroWithEvents } from './wizard'

const { mockCreateBro, mockDeleteBro, mockCreateEvent } = vi.hoisted(() => ({
  mockCreateBro: vi.fn(),
  mockDeleteBro: vi.fn(),
  mockCreateEvent: vi.fn(),
}))

vi.mock('./brolympics', () => ({
  createBrolympics: mockCreateBro,
  deleteBrolympics: mockDeleteBro,
}))
vi.mock('./events', () => ({
  createEvent: mockCreateEvent,
  defaultStagesFor: () => [{ structure: 'round_robin', config: {} }],
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
