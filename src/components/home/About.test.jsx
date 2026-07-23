/**
 * The front door: the About page pitches what Brolympics IS today (leagues,
 * live game day, four formats, lasting history) with an auth-aware CTA --
 * the 2024 page still claimed teams are always 2 and described a scoring
 * table that never shipped.
 */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from './About'

const { mockUseAuth } = vi.hoisted(() => ({ mockUseAuth: vi.fn() }))
vi.mock('../../context/AuthContext', () => ({ useAuth: mockUseAuth }))

const renderAbout = (firebaseUser = null) => {
  mockUseAuth.mockReturnValue({ firebaseUser })
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  )
}

describe('About', () => {
  it('pitches the current product: steps, formats, and lasting history', () => {
    renderAbout()
    expect(screen.getByText('Run your own Olympics.')).toBeInTheDocument()
    expect(screen.getByText('Build your league')).toBeInTheDocument()
    expect(screen.getByText('Send one link')).toBeInTheDocument()
    expect(screen.getByText('Keep score as you play')).toBeInTheDocument()
    for (const format of ['Head-to-Head', 'Individual', 'Team', 'Free-for-All']) {
      expect(screen.getByText(format)).toBeInTheDocument()
    }
    expect(screen.getByText('Records & rivalries')).toBeInTheDocument()
  })

  it('signed-out visitors get the create-league CTA and a sign-in door', () => {
    renderAbout(null)
    expect(
      screen.getAllByRole('button', { name: 'Create your own league' })
    ).toHaveLength(2) // hero + footer
    expect(screen.getByText(/Sign in/)).toBeInTheDocument()
  })

  it('signed-in visitors go straight to the league wizard', () => {
    renderAbout({ uid: 'me' })
    expect(
      screen.getAllByRole('button', { name: 'Create your own league' })
    ).toHaveLength(2)
    expect(screen.queryByText(/Already have an account/)).not.toBeInTheDocument()
  })
})
