/**
 * Event-page display logic: the game log's section labels, the truth-telling
 * stage sentences, the falsy-zero-proof score-format labels, Quill ghost
 * detection, and bracket grouping (the Nullth-place fix).
 */
import { describe, expect, it } from 'vitest'
import {
  SCORE_FORMAT_LABEL, groupBracketNodes, groupLog, hasRules, medalTable,
  outingDisplayScore, placeLabel, stageSentence,
} from './eventDisplay'

const game = (structure, round) => ({ stage_structure: structure, round })

describe('groupLog', () => {
  it('labels playoff rounds with the max round as Finals', () => {
    const groups = groupLog([
      game('knockout', 2), game('knockout', 2),
      game('knockout', 1), game('round_robin', null),
    ])
    expect(groups.map((g) => g.label)).toEqual([
      'Playoffs · Finals', 'Playoffs · Round 1', 'Games',
    ])
    expect(groups[0].games).toHaveLength(2)
  })

  it('labels numbered non-knockout rounds and bare games', () => {
    const groups = groupLog([game('swiss', 2), game('swiss', 1), game('open_play', null)])
    expect(groups.map((g) => g.label)).toEqual(['Round 2', 'Round 1', 'Games'])
  })

  it('returns nothing for an empty log', () => {
    expect(groupLog([])).toEqual([])
  })
})

describe('stageSentence', () => {
  it('tells the truth about each structure', () => {
    expect(stageSentence({ structure: 'round_robin', config: { full: true } }))
      .toBe('Full round robin — everyone plays everyone')
    expect(stageSentence({ structure: 'round_robin', config: { games_per_team: 4 } }))
      .toBe('Round robin — 4 games per team')
    expect(stageSentence({ structure: 'swiss', config: { rounds: 3 } }))
      .toBe('Swiss — 3 rounds paired by record')
    expect(stageSentence({ structure: 'knockout', config: { take: 4, third_place: true } }))
      .toBe('Playoffs — top 4, 3rd place game')
    expect(stageSentence({ structure: 'knockout', config: { classification: true } }))
      .toBe('Playoffs — everyone, every place played out')
    expect(stageSentence({ structure: 'heats', config: { heat_size: 4 } }))
      .toBe('Heats of 4, preset at start')
    expect(stageSentence({ structure: 'heats', config: {} }))
      .toBe('Heats made at the party')
    expect(stageSentence({ structure: 'open_play', config: { games_per_team: 2 } }))
      .toBe('2 games per team')
    expect(stageSentence({ structure: 'open_play', config: {} }))
      .toBe('One game per team')
  })
})

describe('SCORE_FORMAT_LABEL', () => {
  it('maps stored decimal_places 0 to Whole numbers -- the falsy-zero trap', () => {
    expect(SCORE_FORMAT_LABEL[String(0)]).toBe('Whole numbers (1)')
    expect(SCORE_FORMAT_LABEL['B']).toBe('Win/Loss only')
    expect(SCORE_FORMAT_LABEL[String(2)]).toBe('Hundredths (1.00)')
  })
})

describe('hasRules', () => {
  it('sees through the Quill empty-editor ghost', () => {
    expect(hasRules('<p><br></p>')).toBeFalsy()
    expect(hasRules('')).toBeFalsy()
    expect(hasRules(null)).toBeFalsy()
    expect(hasRules('<p>Bring your own darts.</p>')).toBe(true)
  })
})

describe('placeLabel', () => {
  it('names known places and never says Nullth', () => {
    expect(placeLabel(null)).toBe('Placement Game') // the Nullth-place fix
    expect(placeLabel(undefined)).toBe('Placement Game')
    expect(placeLabel(1)).toBe('Championship')
    expect(placeLabel(3)).toBe('Third Place')
    expect(placeLabel(5)).toBe('Fifth Place')
    expect(placeLabel(9)).toBe('9th Place')
  })
})

describe('groupBracketNodes', () => {
  it('splits championship tree from placement games, best place first', () => {
    // 4-team bracket: 2 semis feed the finals; 3rd-place game stands alone
    const semi0 = { round: 1, slot: 0, winner_to: [2, 0] }
    const semi1 = { round: 1, slot: 1, winner_to: [2, 0] }
    const finals = { round: 2, slot: 0, winner_to: null, decides_place: 1 }
    const third = { round: 2, slot: 1, winner_to: null, decides_place: 3 }
    const groups = groupBracketNodes([third, semi1, finals, semi0])

    expect(groups).toHaveLength(2)
    expect(groups[0].terminal).toBe(finals)
    expect(groups[0].members).toHaveLength(3) // both semis + finals
    expect(groups[1].terminal).toBe(third)
    expect(groups[1].members).toEqual([third])
  })

  it('survives a dangling winner_to pointer', () => {
    const orphan = { round: 1, slot: 0, winner_to: [9, 9] }
    const groups = groupBracketNodes([orphan])
    expect(groups[0].terminal).toBe(orphan)
  })
})


describe('medalTable', () => {
  it('rolls podiums into gold-first hardware counts, ties sharing medals', () => {
    const podiums = [
      {
        first: [{ team: 'Chad', img: '/chad.png' }],
        second: [{ team: 'Qatar' }],
        third: [{ team: 'Greece' }],
      },
      {
        // two-way tie for first is two golds
        first: [{ team: 'Qatar' }, { team: 'Chad' }],
        second: [],
        third: [{ team: 'Greece' }],
      },
    ]
    const rows = medalTable(podiums)
    expect(rows.map((r) => [r.team, r.gold, r.silver, r.bronze])).toEqual([
      ['Chad', 2, 0, 0],
      ['Qatar', 1, 1, 0],
      ['Greece', 0, 0, 2],
    ])
    expect(rows[0].img).toBe('/chad.png')
  })
})

describe('outingDisplayScore', () => {
  it('shows the average when the event displays averages, else the total', () => {
    const stats = { total: 48.1, avg: 24.05 }
    expect(outingDisplayScore(stats, true)).toBe(24.05)
    expect(outingDisplayScore(stats, false)).toBe(48.1)
  })

  it('falls back to total for legacy no-avg stats and placement points for heats', () => {
    expect(outingDisplayScore({ total: 48.1 }, true)).toBe(48.1)
    expect(outingDisplayScore({ placement_points: 12 }, false)).toBe(12)
    expect(outingDisplayScore(null, true)).toBe('')
  })
})
