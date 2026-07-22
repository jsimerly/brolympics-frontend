/**
 * The discipline's career page (the same treatment players get). Pins the
 * header tiles (seasons, reigning champ, most titles), the champions
 * timeline in reverse order, and both record books.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EventStats from './EventStats'

const { mockHistory } = vi.hoisted(() => ({ mockHistory: vi.fn() }))

vi.mock('../../../api/client', () => ({
  fetchEventTypeHistory: mockHistory,
  fetchPlayerCareer: vi.fn(),
  fetchTeamCareer: vi.fn(),
}))

const HISTORY = {
  event_type: 'Cornhole',
  format: 'h2h',
  years: [
    {
      brolympics: 'Summer 2024',
      year: 2024,
      complete: true,
      podium: [
        { rank: 1, team: 'Ireland', points: 6, stats: {} },
        { rank: 2, team: 'El Salvador', points: 3, stats: {} },
      ],
    },
    {
      brolympics: 'Summer 2025',
      year: 2025,
      complete: true,
      podium: [
        { rank: 1, team: 'El Salvador', points: 6, stats: {} },
        { rank: 2, team: 'Boland', points: 3, stats: {} },
      ],
    },
  ],
  best_performances: [
    { who: 'Kazakhstan', score: 21, brolympics: 'Summer 2024' },
  ],
  best_seasons: [
    { who: 'Kazakhstan', wins: 6, losses: 0, ties: 0, games: 6,
      win_pct: 1, brolympics: 'Summer 2024' },
  ],
  leaders: [
    { who: 'Javi', points: 9, games: 4, wins: 2, losses: 2, ties: 0,
      win_pct: 0.5 },
  ],
}

const setup = () =>
  render(
    <MemoryRouter initialEntries={['/league/L1/event/ET1/stats']}>
      <Routes>
        <Route
          path="/league/:uuid/event/:eventTypeUuid/stats"
          element={<EventStats />}
        />
      </Routes>
    </MemoryRouter>
  )

describe('EventStats', () => {
  beforeEach(() => {
    mockHistory.mockReset().mockResolvedValue(HISTORY)
  })

  it('crowns the reigning champion and counts seasons', async () => {
    setup()
    await waitFor(() => expect(screen.getByText('Cornhole')).toBeInTheDocument())
    expect(screen.getByText('Head to Head · held 2 times')).toBeInTheDocument()
    // reigning = last complete year's gold; both champs have 1 title each so
    // most-titles falls to the first encountered (Ireland)
    expect(screen.getByText('Reigning Champion')).toBeInTheDocument()
    expect(screen.getAllByText('El Salvador').length).toBeGreaterThan(0)
  })

  it('shows the timeline newest-first with the record books', async () => {
    setup()
    await waitFor(() =>
      expect(screen.getByText('Champions Timeline')).toBeInTheDocument()
    )
    const seasonHeads = screen.getAllByText(/Summer 20/)
    expect(seasonHeads[0]).toHaveTextContent('Summer 2025') // newest first
    expect(screen.getByText('6-0 (100%) · Summer 2024')).toBeInTheDocument()
    expect(screen.getByText('21 · Summer 2024')).toBeInTheDocument()
    expect(screen.getByText('9 pts · 2-2 (50%)')).toBeInTheDocument()
  })
})
