/**
 * Shared number/score helpers -- each pins a shipped bug:
 * trimFloat (K1 Speed showed 50,257 of float noise), isScoreInput (integer-only
 * regex made lap times untypeable), ordinal (podium chips).
 */
import { describe, expect, it } from 'vitest'
import { isScoreInput, ordinal, trimFloat } from './format'

describe('trimFloat', () => {
  it('cleans float-sum noise to what a human would write', () => {
    expect(trimFloat(50.257999999999996)).toBe(50.258)
    expect(trimFloat(0.1 + 0.2)).toBe(0.3)
  })

  it('leaves integers and non-numbers alone', () => {
    expect(trimFloat(21)).toBe(21)
    expect(trimFloat('W')).toBe('W')
    expect(trimFloat(null)).toBe(null)
    expect(trimFloat(undefined)).toBe(undefined)
  })
})

describe('isScoreInput', () => {
  it('accepts free-typed decimals, including intermediate states', () => {
    for (const ok of ['', '1', '12', '12.', '12.5', '.5', '0.05']) {
      expect(isScoreInput(ok), ok).toBe(true)
    }
  })

  it('rejects non-numeric junk', () => {
    for (const bad of ['abc', '1.2.3', '-1', '1e5', '1,5', ' 1']) {
      expect(isScoreInput(bad), bad).toBe(false)
    }
  })
})

describe('ordinal', () => {
  it('handles the English edge cases', () => {
    expect(ordinal(1)).toBe('1st')
    expect(ordinal(2)).toBe('2nd')
    expect(ordinal(3)).toBe('3rd')
    expect(ordinal(4)).toBe('4th')
    expect(ordinal(11)).toBe('11th')
    expect(ordinal(12)).toBe('12th')
    expect(ordinal(13)).toBe('13th')
    expect(ordinal(21)).toBe('21st')
    expect(ordinal(102)).toBe('102nd')
    expect(ordinal(111)).toBe('111th')
  })
})
