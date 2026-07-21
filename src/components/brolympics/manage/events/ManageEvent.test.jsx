/**
 * The settings monster's two load-bearing behaviors: stored decimal_places 0
 * must display as Whole numbers (the falsy-zero `?? "0"` fix -- `|| ""` once
 * showed Win/Loss instead), and reopening a saved event then hitting Save
 * must send back byte-identical stages (the formFromStages/buildStages
 * round trip against a real stored knockout with custom run-offs).
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ManageEvent from './ManageEvent'

const { mockUpdate, mockNotify } = vi.hoisted(() => ({
  mockUpdate: vi.fn(),
  mockNotify: vi.fn(),
}))

vi.mock('react-quill', () => ({ default: () => null }))

vi.mock('../../../../api/client', () => ({
  updateEvent: mockUpdate,
  deleteEvent: vi.fn(),
  cancelEvent: vi.fn(),
  reinstateEvent: vi.fn(),
}))

vi.mock('../../../Util/Notification', () => ({
  useNotification: () => ({ showNotification: mockNotify }),
}))

const reload = vi.fn()
beforeAll(() => {
  delete window.location
  window.location = { reload }
})

const storedStages = [
  { structure: 'swiss', config: { rounds: 3 } },
  {
    structure: 'knockout',
    config: {
      byes: 'seeded',
      take: 8,
      classification: true,
      unplayed_places: [5, 7],
    },
  },
]

const event = {
  uuid: 'ev-1',
  name: 'Beer Die',
  format: 'h2h',
  type: 'h2h',
  is_active: false,
  is_complete: false,
  is_cancelled: false,
  config: { decimal_places: 0 },
  stages: storedStages,
  location: '',
  rules: '',
  projected_start_date: null,
  projected_end_date: null,
}

const setup = () => {
  const utils = render(
    <MemoryRouter>
      <ManageEvent event={event} teams={[]} />
    </MemoryRouter>
  )
  // the per-event accordion starts closed
  fireEvent.click(screen.getByRole('button', { name: 'Beer Die' }))
  return utils
}

describe('ManageEvent', () => {
  beforeEach(() => {
    mockUpdate.mockClear()
    mockNotify.mockClear()
  })

  it('shows stored decimal_places 0 as Whole numbers, not Win/Loss', () => {
    const { container } = setup()
    fireEvent.click(screen.getByText('Scoring'))
    const select = container.querySelector('select[name="decimal_places"]')
    expect(select).toHaveValue('0') // the falsy-zero fix: ?? "0", never || ""
  })

  it('reopening and saving sends back byte-identical stages and config', async () => {
    mockUpdate.mockResolvedValueOnce({})
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Save Beer Die' }))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalled())
    const [uuid, patch] = mockUpdate.mock.calls[0]
    expect(uuid).toBe('ev-1')
    expect(patch.stages).toEqual(storedStages) // the round trip holds
    expect(patch.config.decimal_places).toBe(0)
    expect(patch.config.tiebreakers).toEqual(['h2h', 'sov', 'sos', 'diff'])
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        'Beer Die has been updated.', expect.anything()
      )
    )
  })
})
