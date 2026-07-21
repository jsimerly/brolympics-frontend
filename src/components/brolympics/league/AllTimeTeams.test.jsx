/**
 * The all-time TEAMS register that replaced Team Lineages: one row per team
 * identity, renames folded in as "formerly ...", year-by-year history behind
 * a tap with "as <old name>" on renamed seasons.
 */
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AllTimeTeams } from './HistorySections'

const TEAMS = [
  {
    name: 'Boland',
    aka: ['Ireland'],
    img: null,
    players: ['Alex', 'Davis'],
    years: 2,
    championships: 1,
    event_wins: 3,
    podiums: 5,
    points: 91.5,
    appearances: [
      {
        brolympics: 'Summer 2024',
        team_name: 'Ireland',
        team_uuid: 't-24',
        players: ['Alex', 'Davis'],
        rank: 1,
        points: 46,
      },
      {
        brolympics: 'Summer 2025',
        team_name: 'Boland',
        team_uuid: 't-25',
        players: ['Alex', 'Davis'],
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
  it('shows one identity with its old names folded in', () => {
    setup()
    expect(screen.getByText('Boland')).toBeInTheDocument()
    expect(screen.getByText(/formerly Ireland/)).toBeInTheDocument()
    expect(screen.getByText('91.5 pts')).toBeInTheDocument()
    expect(screen.getByText('2 years')).toBeInTheDocument()
    // history stays closed until tapped
    expect(screen.queryByText(/Summer 2024/)).toBeNull()
  })

  it('opens the year-by-year history and labels renamed seasons', () => {
    setup()
    fireEvent.click(screen.getByText('Boland'))
    expect(screen.getByText('Summer 2024')).toBeInTheDocument()
    // the 2024 season ran under the old name
    expect(screen.getByText(/as Ireland/)).toBeInTheDocument()
    // the current-name season doesn't repeat itself
    expect(screen.queryByText(/as Boland/)).toBeNull()
    expect(screen.getByText(/3 event wins · 5 podiums all-time/)).toBeInTheDocument()
    // rank 1 wears the medal, rank 4 the plain ordinal
    expect(screen.getByAltText('1st')).toBeInTheDocument()
    expect(screen.getByText('4th')).toBeInTheDocument()
  })
})
