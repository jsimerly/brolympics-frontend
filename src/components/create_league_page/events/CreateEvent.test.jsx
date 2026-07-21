/**
 * The custom-event wizard end to end in the DOM -- zero mocks. The stage
 * math itself is pinned in stageBuilder.test.js; this proves the CONTROLS
 * wire into it: what the admin clicks is what handleEventAdded receives.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CreateEvent from './CreateEvent'

const added = vi.fn()

const setup = () => render(<CreateEvent handleEventAdded={added} />)

const nameIt = (name) =>
  fireEvent.change(screen.getByLabelText(/event name/i), {
    target: { value: name },
  })

describe('CreateEvent', () => {
  beforeEach(() => added.mockClear())

  it('adds the default h2h: semi round robin into a seeded top-4 with 3rd place', () => {
    setup()
    nameIt('Cornhole')
    fireEvent.click(screen.getByRole('button', { name: 'Add Cornhole' }))
    expect(added).toHaveBeenCalledWith(
      'Cornhole',
      'h2h',
      [
        { structure: 'round_robin', config: { games_per_team: 4 } },
        {
          structure: 'knockout',
          config: { byes: 'seeded', take: 4, third_place: true },
        },
      ],
      { is_high_score_wins: true }
    )
  })

  it('custom run-offs on a top 8 played through 4th skip the 5th and 7th games', () => {
    setup()
    nameIt('Beer Die')
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '8' } })
    fireEvent.click(screen.getByRole('button', { name: /custom/i }))
    // the depth select appears once custom + 6-or-more are chosen
    fireEvent.change(screen.getAllByRole('combobox')[1], {
      target: { value: '4' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add Beer Die' }))
    const stages = added.mock.calls[0][2]
    expect(stages[1].config).toEqual({
      byes: 'seeded',
      take: 8,
      classification: true,
      unplayed_places: [5, 7],
    })
  })

  it('an ind event carries its games-per-team and low-score-wins choices', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: /individual/i }))
    fireEvent.click(screen.getByRole('button', { name: /low score wins/i }))
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2' } })
    nameIt('Bowling')
    fireEvent.click(screen.getByRole('button', { name: 'Add Bowling' }))
    expect(added).toHaveBeenCalledWith(
      'Bowling',
      'ind',
      [{ structure: 'open_play', config: { games_per_team: 2 } }],
      { is_high_score_wins: false }
    )
  })

  it('refuses to add a nameless event', () => {
    setup()
    const button = screen.getByRole('button', { name: 'Add event' })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(added).not.toHaveBeenCalled()
  })
})
