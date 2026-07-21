/**
 * The all-time TEAMS register: the name IS the lineage (rosters rotate under
 * it), rendered in the leaderboard's table language. Pins the career row, the
 * year-by-year expand with each season's roster, the lazy career fetch
 * (record + trophy chips), and the "+N more" chip-noise valve.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AllTimeTeams } from './HistorySections'

const { mockTeamCareer } = vi.hoisted(() => ({ mockTeamCareer: vi.fn() }))

vi.mock('../../../api/client', () => ({
  fetchTeamCareer: mockTeamCareer,
  fetchPlayerCareer: vi.fn(),
  fetchEventTypeHistory: vi.fn(),
}))

const discipline = (name, over = {}) => ({
  event_type: name,
  format: 'h2h',
  events_played: 2,
  record: { wins: 2, losses: 1, ties: 0 },
  event_wins: 1,
  podiums: 1,
  seconds: 0,
  thirds: 0,
  points: 10,
  ...over,
})

const CAREER = {
  name: 'El Salvador',
  record: { wins: 34, losses: 12, ties: 1 },
  total_points: 91.5,
  event_wins: 8,
  podiums: 15,
  disciplines: [
    // 7 gold-chip disciplines: one more than the preview cap of 6
    ...['Cornhole', 'Spikeball', 'Beer Die', 'Kanjam', 'Golf', 'Darts',
        'Bowling'].map((n) => discipline(n)),
  ],
}

const TEAMS = [
  {
    name: 'El Salvador',
    img: null,
    players: ['Javi', 'Marco'],
    years: 2,
    championships: 1,
    event_wins: 8,
    podiums: 15,
    points: 91.5,
    appearances: [
      {
        brolympics: 'Summer 2024',
        team_uuid: 't-24',
        players: ['Bryce', 'Javi'],
        rank: 1,
        points: 46,
      },
      {
        brolympics: 'Summer 2025',
        team_uuid: 't-25',
        players: ['Javi', 'Marco'],
        rank: 4,
        points: 45.5,
      },
    ],
  },
]

const setup = () =>
  render(
    <MemoryRouter>
      <AllTimeTeams teams={TEAMS} total={1} />
    </MemoryRouter>
  )

describe('AllTimeTeams', () => {
  beforeEach(() => {
    mockTeamCareer.mockReset().mockResolvedValue(CAREER)
  })

  it('shows the career row: points, championships, event wins', () => {
    setup()
    expect(screen.getByText('El Salvador')).toBeInTheDocument()
    expect(screen.getByText('91.5')).toBeInTheDocument()
    expect(screen.getAllByText('1')).toHaveLength(2) // rank # + championships
    expect(screen.getByText('8')).toBeInTheDocument() // event wins column
    // no fetch and no history until tapped
    expect(mockTeamCareer).not.toHaveBeenCalled()
    expect(screen.queryByText('Summer 2024')).toBeNull()
  })

  it('opens into record, rotating rosters, and the trophy shelf', async () => {
    setup()
    fireEvent.click(screen.getByText('El Salvador'))
    // year lines: the name persists while partners rotate under it
    expect(screen.getByText('Bryce, Javi')).toBeInTheDocument()
    expect(screen.getByText('Javi, Marco')).toBeInTheDocument()
    expect(screen.getByAltText('1st')).toBeInTheDocument()
    expect(screen.getByText('4th')).toBeInTheDocument()
    // the lazy career fetch fills in the record line + chips
    await waitFor(() =>
      expect(screen.getByText('34-12-1')).toBeInTheDocument()
    )
    expect(screen.getByText('Cornhole')).toBeInTheDocument()
  })

  it('folds chip noise behind +N more and unfolds on tap', async () => {
    setup()
    fireEvent.click(screen.getByText('El Salvador'))
    await waitFor(() => expect(screen.getByText('+1 more')).toBeInTheDocument())
    expect(screen.queryByText('Bowling')).toBeNull() // 7th chip folded
    fireEvent.click(screen.getByText('+1 more'))
    expect(screen.getByText('Bowling')).toBeInTheDocument()
    expect(screen.getByText('Show less')).toBeInTheDocument()
  })
})
