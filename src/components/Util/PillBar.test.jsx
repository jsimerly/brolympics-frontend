/**
 * The pill switcher's type-to-jump: no search under the threshold, a search
 * pill past it, live filtering, and picking a match clears the search.
 */
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import PillBar from './PillBar'

const items = (n) =>
  Array.from({ length: n }, (_, i) => ({ uuid: `t${i}`, name: `Team ${i}` }))

describe('PillBar', () => {
  it('hides the search pill for short lists', () => {
    render(<PillBar items={items(5)} selectedId="t0" onSelect={() => {}} />)
    expect(screen.queryByTitle('Jump to...')).toBeNull()
  })

  it('filters pills live and jumps on pick', () => {
    const onSelect = vi.fn()
    render(<PillBar items={items(12)} selectedId="t0" onSelect={onSelect} />)
    fireEvent.click(screen.getByTitle('Jump to...'))
    fireEvent.change(screen.getByPlaceholderText('Jump to...'), {
      target: { value: 'Team 1' },
    })
    // "Team 1" matches Team 1, 10, 11 -- the rest are gone
    expect(screen.queryByText('Team 2')).toBeNull()
    expect(screen.getByText('Team 11')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Team 11'))
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ uuid: 't11' })
    )
    // picking clears the search: the whole bar is back
    expect(screen.getByText('Team 2')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Jump to...')).toBeNull()
  })

  it('says so when nothing matches', () => {
    render(<PillBar items={items(12)} selectedId="t0" onSelect={() => {}} />)
    fireEvent.click(screen.getByTitle('Jump to...'))
    fireEvent.change(screen.getByPlaceholderText('Jump to...'), {
      target: { value: 'zzz' },
    })
    expect(screen.getByText('No matches.')).toBeInTheDocument()
  })
})
