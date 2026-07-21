/**
 * The wizard's structure math -- one shared implementation for CreateEvent
 * and ManageEvent (they used to carry divergent copies). The round-trip suite
 * is the load-bearing part: an edit screen that reopens a saved event must
 * read back exactly the choices that built it.
 */
import { describe, expect, it } from 'vitest'
import { buildStages, formFromStages } from './stageBuilder'

const h2h = (over = {}) => ({
  format: 'h2h',
  groupPlay: 'semi',
  nMatches: '4',
  hasPlayoffs: true,
  take: '4',
  runoffs: 'third',
  placeThrough: '',
  heatSize: '',
  outingGames: '1',
  ...over,
})

describe('buildStages', () => {
  it('default h2h: semi round robin into a seeded top-4 with a 3rd place game', () => {
    expect(buildStages(h2h())).toEqual([
      { structure: 'round_robin', config: { games_per_team: 4 } },
      { structure: 'knockout', config: { byes: 'seeded', take: 4, third_place: true } },
    ])
  })

  it('full RR and swiss group play', () => {
    expect(buildStages(h2h({ groupPlay: 'full' }))[0])
      .toEqual({ structure: 'round_robin', config: { full: true } })
    expect(buildStages(h2h({ groupPlay: 'swiss', nMatches: '3' }))[0])
      .toEqual({ structure: 'swiss', config: { rounds: 3 } })
  })

  it('no group play still forces a bracket -- an event needs games', () => {
    const stages = buildStages(h2h({ groupPlay: 'none', hasPlayoffs: false }))
    expect(stages).toHaveLength(1)
    expect(stages[0].structure).toBe('knockout')
  })

  it('custom run-offs: take 8 played through 4th skips the 5th and 7th games', () => {
    const stages = buildStages(h2h({ take: '8', runoffs: 'custom', placeThrough: '4' }))
    expect(stages[1].config).toEqual({
      byes: 'seeded', take: 8, classification: true, unplayed_places: [5, 7],
    })
  })

  it('custom on a bracket under 6 has nothing to skip', () => {
    const stages = buildStages(h2h({ take: '4', runoffs: 'custom' }))
    expect(stages[1].config).toEqual({ byes: 'seeded', take: 4, classification: true })
  })

  it("run-offs off and 'every place' both build what they say", () => {
    expect(buildStages(h2h({ runoffs: 'off' }))[1].config)
      .toEqual({ byes: 'seeded', take: 4 })
    expect(buildStages(h2h({ runoffs: 'every' }))[1].config)
      .toEqual({ byes: 'seeded', take: 4, classification: true })
  })

  it('whole-field bracket when take is blank', () => {
    const stages = buildStages(h2h({ take: '' }))
    expect(stages[1].config.take).toBeUndefined()
  })

  it('ffa builds heats (sized only when >= 2); ind/team build open play', () => {
    expect(buildStages({ format: 'ffa', heatSize: '4' }))
      .toEqual([{ structure: 'heats', config: { heat_size: 4 } }])
    expect(buildStages({ format: 'ffa', heatSize: '' }))
      .toEqual([{ structure: 'heats', config: {} }])
    expect(buildStages({ format: 'ind', outingGames: '2' }))
      .toEqual([{ structure: 'open_play', config: { games_per_team: 2 } }])
    expect(buildStages({ format: 'team', outingGames: '' }))
      .toEqual([{ structure: 'open_play', config: {} }])
  })
})

describe('formFromStages', () => {
  it('reads a stored RR+KO event back into form choices', () => {
    expect(formFromStages([
      { structure: 'round_robin', config: { games_per_team: 2 } },
      { structure: 'knockout', config: { take: 8, classification: true, unplayed_places: [5, 7] } },
    ])).toMatchObject({
      groupPlay: 'semi', nMatches: 2, hasPlayoffs: true, take: 8,
      runoffs: 'custom', placeThrough: 4,
    })
  })

  it('distinguishes every-place from custom and third from off', () => {
    const ko = (config) => formFromStages([{ structure: 'knockout', config }])
    expect(ko({ classification: true }).runoffs).toBe('every')
    expect(ko({ third_place: true }).runoffs).toBe('third')
    expect(ko({}).runoffs).toBe('off')
  })
})

describe('round trip', () => {
  const forms = [
    h2h(),
    h2h({ groupPlay: 'full', runoffs: 'off' }),
    h2h({ groupPlay: 'swiss', nMatches: '3', take: '8', runoffs: 'custom', placeThrough: '4' }),
    h2h({ groupPlay: 'none', take: '8', runoffs: 'every' }),
    h2h({ take: '6', runoffs: 'custom', placeThrough: '' }), // default through = take - 2
  ]

  it('formFromStages(buildStages(form)) preserves every structure choice', () => {
    for (const form of forms) {
      const back = formFromStages(buildStages(form))
      const rebuilt = buildStages({ format: 'h2h', ...back })
      expect(rebuilt, JSON.stringify(form)).toEqual(buildStages(form))
    }
  })

  it('a reopened saved event saves back byte-identical stages', () => {
    const stored = [
      { structure: 'swiss', config: { rounds: 3 } },
      { structure: 'knockout', config: { byes: 'seeded', take: 8, classification: true, unplayed_places: [5, 7] } },
    ]
    const rebuilt = buildStages({ format: 'h2h', ...formFromStages(stored) })
    expect(rebuilt).toEqual(stored)
  })
})
