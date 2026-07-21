/**
 * The event page's display truths: outing totals go through trimFloat (the
 * 50,257-of-noise K1 bug), points render whole-or-one-decimal with an em dash
 * for none, h2h standings rows show the record, and the blind banner shows
 * only while the blind holds.
 */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EventActive from './EventActive'

// EventInfo pulls in react-quill; rules-free fixtures never render it, but
// keep jsdom away from Quill entirely.
vi.mock('react-quill', () => ({ default: () => null }))

const indEvent = (over = {}) => ({
  type: 'ind',
  is_complete: true,
  blind_active: false,
  stages: [],
  standings: [
    {
      team: { uuid: 't1', name: 'Dynasty' },
      stats: { total: 50.257999999999996 },
      rank: 1,
      points: 8,
    },
    {
      team: { uuid: 't2', name: 'Qatar' },
      stats: { total: 40 },
      rank: 2,
      points: 5.5,
    },
    {
      team: { uuid: 't3', name: 'Greece' },
      stats: {},
      rank: 3,
      points: null,
    },
  ],
  contests: [
    {
      uuid: 'c1',
      is_complete: true,
      entries: [
        { team: 't1', team_name: 'Dynasty', player: null, score: null },
        { team: 't1', team_name: 'Dynasty', player: 'p1', player_name: 'Sim', score: 25.05 },
        { team: 't1', team_name: 'Dynasty', player: 'p2', player_name: 'Jake', score: 25.208 },
      ],
    },
  ],
  brackets: [],
  ...over,
})

describe('EventActive', () => {
  it('trims float noise on standings and outing totals', () => {
    render(<EventActive eventInfo={indEvent()} is_admin={false} />)
    // the K1 fix: 50.257999999999996 reads 50.258 -- in the standings row
    // detail AND the summed outing line
    expect(screen.getAllByText('50.258').length).toBe(2)
    expect(screen.queryByText(/50\.2579/)).not.toBeInTheDocument()
  })

  it('shows points whole, one-decimal, or an em dash for none', () => {
    render(<EventActive eventInfo={indEvent()} is_admin={false} />)
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('5.5')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows the h2h record under the team name', () => {
    render(
      <EventActive
        is_admin={false}
        eventInfo={{
          type: 'h2h',
          is_complete: false,
          blind_active: false,
          stages: [],
          brackets: [],
          contests: [],
          standings: [
            {
              team: { uuid: 't1', name: 'Kazakhstan' },
              stats: { wins: 6, losses: 0 },
              rank: 1,
              points: null,
            },
          ],
        }}
      />
    )
    expect(screen.getByText('6-0')).toBeInTheDocument()
  })

  it('flies the blind banner only while the blind holds', () => {
    const { rerender } = render(
      <EventActive eventInfo={indEvent({ blind_active: true })} is_admin={false} />
    )
    expect(screen.getByText(/scores reveal on their own/i)).toBeInTheDocument()
    rerender(<EventActive eventInfo={indEvent()} is_admin={false} />)
    expect(screen.queryByText(/scores reveal on their own/i)).not.toBeInTheDocument()
  })
})
