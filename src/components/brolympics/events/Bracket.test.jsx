/**
 * Bracket rendering: the championship tree titles as "Bracket", standalone
 * placement games get their names (never "Nullth place" -- legacy null
 * decides_place says "Placement Game"), pools order by decided place, and
 * single-entry walkover games render as a Bye.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Bracket from './Bracket'

const node = (round, slot, over = {}) => ({
  round,
  slot,
  winner_to: null,
  loser_to: null,
  decides_place: null,
  contest: { uuid: `${round}-${slot}`, entries: [] },
  ...over,
})

const entry = (name, over = {}) => ({
  team: name.toLowerCase(),
  team_name: name,
  score: null,
  outcome: null,
  seed: null,
  ...over,
})

describe('Bracket', () => {
  it('titles the championship tree and names the third-place game', () => {
    render(
      <Bracket
        nodes={[
          node(2, 1, {
            decides_place: 3,
            contest: { uuid: 'third', entries: [entry('Chad'), entry('Delta')] },
          }),
          node(1, 0, {
            winner_to: [2, 0],
            contest: { uuid: 's1', entries: [entry('Alpha'), entry('Bravo')] },
          }),
          node(1, 1, {
            winner_to: [2, 0],
            contest: { uuid: 's2', entries: [entry('Chad'), entry('Delta')] },
          }),
          node(2, 0, {
            decides_place: 1,
            contest: { uuid: 'final', entries: [entry('Alpha'), entry('Chad')] },
          }),
        ]}
      />
    )
    const headings = screen.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual(['Bracket', 'Third Place'])  // best place first
    expect(screen.getAllByText('Alpha').length).toBeGreaterThan(0)
  })

  it('labels a legacy node without decides_place as Placement Game, never Nullth', () => {
    render(
      <Bracket
        nodes={[
          node(1, 0, {
            contest: { uuid: 'legacy', entries: [entry('Echo'), entry('Fox')] },
          }),
        ]}
      />
    )
    expect(screen.getByText('Placement Game')).toBeInTheDocument()
    expect(screen.queryByText(/nullth/i)).not.toBeInTheDocument()
  })

  it('renders a completed single-entry game as a walkover Bye', () => {
    render(
      <Bracket
        nodes={[
          node(1, 0, {
            winner_to: [2, 0],
            contest: {
              uuid: 'bye',
              is_complete: true,
              entries: [entry('Alpha', { outcome: 'w', seed: 1 })],
            },
          }),
          node(1, 1, {
            winner_to: [2, 0],
            contest: { uuid: 's2', entries: [entry('Chad'), entry('Delta')] },
          }),
          node(2, 0, {
            decides_place: 1,
            contest: { uuid: 'final', entries: [entry('Alpha')] },
          }),
        ]}
      />
    )
    expect(screen.getByText('Bye')).toBeInTheDocument()
  })

  it('renders nothing at all without nodes', () => {
    const { container } = render(<Bracket nodes={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
