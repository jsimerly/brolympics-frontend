/**
 * convertDateFromDjango feeds datetime-local inputs (ManageBro dates were
 * blank for months because of a parsing bug in the old implementation).
 */
import { describe, expect, it } from 'vitest'
import { convertDateFromDjango } from './dateUtils'

describe('convertDateFromDjango', () => {
  it('formats a local ISO string for a datetime-local input', () => {
    // no timezone suffix -> parsed as local time -> stable on any machine
    expect(convertDateFromDjango('2026-07-04T18:30:00')).toBe('2026-07-04T18:30')
    expect(convertDateFromDjango('2026-01-05T09:05:00')).toBe('2026-01-05T09:05')
  })

  it('zero-pads every component', () => {
    expect(convertDateFromDjango('2026-03-01T01:04:00')).toBe('2026-03-01T01:04')
  })
})
