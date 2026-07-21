/**
 * The all-time TEAMS register: the name IS the lineage (rosters rotate under
 * it), rendered in the leaderboard's table language. Pins the career row
 * values and the year-by-year expand with each season's roster.
 */
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AllTimeTeams } from './HistorySections'

const TEAMS = [
  {
    name: 'El Salvador',
    img: null,
    players: ['Javi', 'Marco'],
    years: 2,
    championships: 1,
    event_wins: 3,
    podiums: 5,
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
  it('shows the career row: points, championships, event wins', () => {
    setup()
    expect(screen.getByText('El Salvador')).toBeInTheDocument()
    expect(screen.getByText('91.5')).toBeInTheDocument()
    expect(screen.getAllByText('1')).toHaveLength(2) // rank # + championships
    expect(screen.getByText('3')).toBeInTheDocument() // event wins column
    // history stays closed until tapped
    expect(screen.queryByText('Summer 2024')).toBeNull()
  })

  it('opens the year-by-year history with each season\'s roster', () => {
    setup()
    fireEvent.click(screen.getByText('El Salvador'))
    expect(screen.getByText('Summer 2024')).toBeInTheDocument()
    // the name persists while partners rotate under it
    expect(screen.getByText('Bryce, Javi')).toBeInTheDocument()
    expect(screen.getByText('Javi, Marco')).toBeInTheDocument()
    // rank 1 wears the medal, rank 4 the plain ordinal
    expect(screen.getByAltText('1st')).toBeInTheDocument()
    expect(screen.getByText('4th')).toBeInTheDocument()
  })
})
