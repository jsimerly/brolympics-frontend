/**
 * The Brolympics wizard step: inside an existing league the structure is
 * NOT a choice -- one league, one structure (ruled 2026-07-22). The picker
 * only exists when founding a new league.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CreateBrolympics from './CreateBrolympics'

describe('CreateBrolympics structure step', () => {
  beforeEach(() => localStorage.clear())

  it('locks to the league standard instead of offering the type picker', () => {
    render(
      <CreateBrolympics
        step={1}
        totalSteps={4}
        nextStep={() => {}}
        setBrolympics={() => {}}
        storageKey="test:locked"
        lockedTeamSize={2}
      />
    )
    expect(screen.getByText('Traditional — teams of 2')).toBeInTheDocument()
    expect(screen.getByText(/League standard/)).toBeInTheDocument()
    expect(screen.queryByText('Big Teams')).not.toBeInTheDocument()
  })

  it('offers the full picker when founding a new league', () => {
    render(
      <CreateBrolympics
        step={2}
        totalSteps={5}
        nextStep={() => {}}
        setBrolympics={() => {}}
        storageKey="test:unlocked"
      />
    )
    expect(screen.getByText('Traditional')).toBeInTheDocument()
    expect(screen.getByText('Individual')).toBeInTheDocument()
    expect(screen.getByText('Big Teams')).toBeInTheDocument()
    expect(screen.queryByText(/League standard/)).not.toBeInTheDocument()
  })
})
