/**
 * Overall standings: rows sort by rank with whole-or-one-decimal points, and
 * an unstarted brolympics shows placeholder rows from the teams prop instead
 * of an empty page. Distinct uuids per test dodge useCachedFetch's
 * module-level cache.
 */
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import Standings from './Standings'

const { mockStandings, mockPodiums } = vi.hoisted(() => ({
  mockStandings: vi.fn(),
  mockPodiums: vi.fn(),
}))

vi.mock('../../../api/client', () => ({
  fetchBrolympicsStandings: mockStandings,
  fetchBrolympicsPodiums: mockPodiums,
}))

const renderAt = (uuid, props = {}) =>
  render(
    <MemoryRouter initialEntries={[`/b/${uuid}/standings`]}>
      <Routes>
        <Route path="/b/:uuid/standings" element={<Standings {...props} />} />
      </Routes>
    </MemoryRouter>
  )

describe('Standings', () => {
  it('sorts by rank and trims points to whole or one decimal', async () => {
    mockStandings.mockResolvedValueOnce([
      { rank: 2, points: 54.5, team: { uuid: 't2', name: 'Ur', players: [] } },
      { rank: 1, points: 73, team: { uuid: 't1', name: 'Luxembourg', players: [] } },
    ])
    mockPodiums.mockResolvedValueOnce([])
    renderAt('bro-ranked')

    expect(await screen.findByText('Luxembourg')).toBeInTheDocument()
    expect(screen.getByText('Ur')).toBeInTheDocument()
    expect(screen.getByText('73')).toBeInTheDocument()
    expect(screen.getByText('54.5')).toBeInTheDocument()

    const lux = screen.getByText('Luxembourg')
    const ur = screen.getByText('Ur')
    // rank 1 renders above rank 2 regardless of payload order
    expect(
      lux.compareDocumentPosition(ur) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('an unstarted brolympics shows placeholder rows from the teams prop', async () => {
    mockStandings.mockResolvedValueOnce([])
    mockPodiums.mockResolvedValueOnce([])
    renderAt('bro-fresh', {
      teams: [
        { uuid: 't1', name: 'Kazakhstan', players: [] },
        { uuid: 't2', name: 'Greece', players: [] },
      ],
    })
    expect(await screen.findByText('Kazakhstan')).toBeInTheDocument()
    expect(screen.getByText('Greece')).toBeInTheDocument()
    expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(2)
  })
})
