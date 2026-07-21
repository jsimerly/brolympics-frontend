/**
 * Outing score entry: dormant players get no input (they once demanded
 * scores and blocked submission), every ACTIVE player must score before the
 * API call, and ind vs team events send the right payload shape.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import InCompetition_outing from './InCompetition_outing'

const { mockRecord, mockAbandon, mockFetchTeam, mockNotify } = vi.hoisted(() => ({
  mockRecord: vi.fn(),
  mockAbandon: vi.fn(),
  mockFetchTeam: vi.fn(),
  mockNotify: vi.fn(),
}))

vi.mock('../../../api/client', () => ({
  recordContest: mockRecord,
  abandonContest: mockAbandon,
  fetchTeam: mockFetchTeam,
}))

// the provider only stores state (the banner renders in the app shell), so
// spy on the hook and assert the copy directly
vi.mock('../../Util/Notification', () => ({
  useNotification: () => ({ showNotification: mockNotify }),
}))

const reload = vi.fn()
beforeAll(() => {
  delete window.location
  window.location = { reload }
})

const indContest = {
  uuid: 'outing-1',
  format: 'ind',
  event_name: 'Bowling',
  entries: [{ team: 't1', team_name: 'Dynasty', team_img: null, player: null }],
}

const renderInd = () => {
  mockFetchTeam.mockResolvedValue({
    name: 'Dynasty',
    img: null,
    players: [
      { uuid: 'p1', name: 'Active Al', is_active: true },
      { uuid: 'p2', name: 'Benched Bob', is_active: false },
      { uuid: 'p3', name: 'Legacy Lou' }, // pre-dormant rows have no flag
    ],
  })
  return render(<InCompetition_outing contest={indContest} />)
}

describe('InCompetition_outing', () => {
  beforeEach(() => {
    mockRecord.mockClear()
    mockFetchTeam.mockReset()
    reload.mockClear()
  })

  it('gives every active player an input and skips the dormant one', async () => {
    renderInd()
    expect(await screen.findByText('Active Al')).toBeInTheDocument()
    expect(screen.getByText('Legacy Lou')).toBeInTheDocument()
    expect(screen.queryByText('Benched Bob')).not.toBeInTheDocument()
    expect(screen.getAllByPlaceholderText('0')).toHaveLength(2)
  })

  it('demands a score for every active player before calling the API', async () => {
    renderInd()
    const [box1] = await screen.findAllByPlaceholderText('0')
    fireEvent.change(box1, { target: { value: '180' } })
    fireEvent.click(screen.getByRole('button', { name: /submit score/i }))
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        'Enter a score for every player.', expect.anything()
      )
    )
    expect(mockRecord).not.toHaveBeenCalled()
  })

  it('sends player_scores keyed by uuid for ind events', async () => {
    mockRecord.mockResolvedValueOnce({})
    renderInd()
    const [box1, box2] = await screen.findAllByPlaceholderText('0')
    fireEvent.change(box1, { target: { value: '180' } })
    fireEvent.change(box2, { target: { value: '95.5' } })
    fireEvent.click(screen.getByRole('button', { name: /submit score/i }))
    await waitFor(() =>
      expect(mockRecord).toHaveBeenCalledWith('outing-1', {
        player_scores: { p1: 180, p3: 95.5 },
      })
    )
    await waitFor(() => expect(reload).toHaveBeenCalled())
  })

  it('team events send one team_score and never fetch a roster', async () => {
    mockRecord.mockResolvedValueOnce({})
    render(
      <InCompetition_outing
        contest={{
          uuid: 'outing-2',
          format: 'team',
          event_name: 'Trivia',
          entries: [
            { team: 't1', team_name: 'Dynasty', team_img: null, player: null },
          ],
        }}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('0'), {
      target: { value: '150.5' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit score/i }))
    await waitFor(() =>
      expect(mockRecord).toHaveBeenCalledWith('outing-2', { team_score: 150.5 })
    )
    expect(mockFetchTeam).not.toHaveBeenCalled()
  })
})
