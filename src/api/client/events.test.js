/**
 * defaultStagesFor is the wizard's starting structure per format. This test
 * also doubles as the canary for the global firebase mock: events.js imports
 * the shared axios instance, which imports firebaseConfig -- if the mock in
 * src/test/setup.js ever stops matching, this file fails at import.
 */
import { describe, expect, it } from 'vitest'
import { defaultStagesFor } from './events'

describe('defaultStagesFor', () => {
  it('h2h starts as RR-4 into a seeded top-4 bracket with a 3rd place game', () => {
    expect(defaultStagesFor('h2h')).toEqual([
      { structure: 'round_robin', config: { games_per_team: 4 } },
      { structure: 'knockout', config: { take: 4, third_place: true, byes: 'seeded' } },
    ])
  })

  it('ind and team are one open-play outing; ffa deals heats', () => {
    expect(defaultStagesFor('ind')).toEqual([{ structure: 'open_play', config: {} }])
    expect(defaultStagesFor('team')).toEqual([{ structure: 'open_play', config: {} }])
    expect(defaultStagesFor('ffa')).toEqual([{ structure: 'heats', config: {} }])
  })

  it('unknown formats fall back to open play instead of crashing the wizard', () => {
    expect(defaultStagesFor('quidditch')).toEqual([{ structure: 'open_play', config: {} }])
    expect(defaultStagesFor(undefined)).toEqual([{ structure: 'open_play', config: {} }])
  })
})
