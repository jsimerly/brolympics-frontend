/**
 * The team NAME's career page: hero, tiles, the h2h mini-stats, every
 * season's seat with its roster, and the trophy shelf.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import TeamStats from './TeamStats'

const { mockCareer } = vi.hoisted(() => ({ mockCareer: vi.fn() }))

vi.mock('../../../api/client', () => ({
  fetchTeamCareer: mockCareer,
  fetchPlayerCareer: vi.fn(),
  fetchEventTypeHistory: vi.fn(),
}))

const CAREER = {
  name: 'El Salvador',
  img: null,
  avg_finish: 1.5,
  record: { wins: 12, losses: 4, ties: 0 },
  total_points: 91.5,
  event_wins: 8,
  podiums: 15,
  disciplines: [
    {
      event_type: 'Cornhole',
      format: 'h2h',
      events_played: 2,
      record: { wins: 12, losses: 4, ties: 0 },
      event_wins: 2,
      podiums: 2,
      seconds: 0,
      thirds: 0,
      points: 12,
    },
  ],
  rivalries: [
    { team: 'Kazakhstan', wins: 5, losses: 2, ties: 0, games: 7 },
    { team: 'Greece', wins: 3, losses: 3, ties: 1, games: 7 },
  ],
  best_event: { event_type: 'Cornhole', avg_finish: 1.2 },
  worst_event: { event_type: 'Golf', avg_finish: 6.5 },
  records: [
    { event_type: 'Trivia', score: 90, brolympics: 'Summer 2024' },
  ],
  appearances: [
    {
      brolympics: 'Summer 2024',
      team_uuid: 't-24',
      players: ['Bryce', 'Javi'],
      complete: true,
      rank: 2,
      points: 46,
    },
    {
      brolympics: 'Summer 2025',
      team_uuid: 't-25',
      players: ['Javi', 'Marco'],
      complete: true,
      rank: 1,
      points: 45.5,
    },
  ],
}

const setup = () =>
  render(
    <MemoryRouter initialEntries={['/league/L1/team/El%20Salvador/stats']}>
      <Routes>
        <Route path="/league/:uuid/team/:teamName/stats" element={<TeamStats />} />
      </Routes>
    </MemoryRouter>
  )

describe('TeamStats', () => {
  beforeEach(() => {
    mockCareer.mockReset().mockResolvedValue(CAREER)
  })

  it('renders the career: tiles, h2h strip, seasons, trophy shelf', async () => {
    setup()
    await waitFor(() =>
      expect(screen.getByText('El Salvador')).toBeInTheDocument()
    )
    expect(mockCareer).toHaveBeenCalledWith('L1', 'El Salvador')
    expect(screen.getByText('91.5')).toBeInTheDocument() // points tile
    expect(screen.getByText('12-4')).toBeInTheDocument() // h2h record
    expect(screen.getByText('75%')).toBeInTheDocument() // 12 of 16
    // seasons carry each year's rotating roster; 2025 gold wears the medal
    expect(screen.getByText('Bryce, Javi')).toBeInTheDocument()
    expect(screen.getByText('Javi, Marco')).toBeInTheDocument()
    expect(screen.getByAltText('1st')).toBeInTheDocument()
    // Cornhole shows twice: the Best Event block AND the trophy shelf
    expect(screen.getAllByText('Cornhole')).toHaveLength(2)
    // the name-vs-name ledger, colored by who's ahead
    expect(screen.getByText('vs Kazakhstan')).toBeInTheDocument()
    expect(screen.getByText('5-2')).toBeInTheDocument()
    expect(screen.getByText('3-3-1')).toBeInTheDocument()
    // best/worst event by average finish
    expect(screen.getByText('Best Event · avg 1.2')).toBeInTheDocument()
    expect(screen.getByText('Golf')).toBeInTheDocument()
    expect(screen.getByText('Toughest Event · avg 6.5')).toBeInTheDocument()
    // the banner's all-time record wears the fire chip
    expect(screen.getByText('Trivia · 90')).toBeInTheDocument()
  })
})
