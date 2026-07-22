/** Countdown/date-range helpers behind the League and pre-bro home cards. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { daysUntil, formatDateRange, formatMonthYear } from './dates'

describe('formatMonthYear', () => {
  it('turns any ISO datetime into "Month Year" and never leaks raw ISO', () => {
    // the Leagues card once showed "Founded: 2026-07-12T11:0..." verbatim
    expect(formatMonthYear('2026-07-12T11:03:22.411243-04:00')).toBe('July 2026')
    expect(formatMonthYear('2023-06-01')).toBe('June 2023')
    expect(formatMonthYear(null)).toBe(null)
    expect(formatMonthYear('not-a-date')).toBe(null)
  })
})

describe('daysUntil', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 21, 12, 0, 0)) // Jul 21 2026, noon local
  })
  afterEach(() => vi.useRealTimers())

  it('counts whole days up (ceil) to the start date', () => {
    expect(daysUntil('2026-07-22')).toBe(1)
    expect(daysUntil('2026-07-31')).toBe(10)
  })

  it('is 0-or-negative once the date arrives, null when absent or junk', () => {
    expect(daysUntil('2026-07-21')).toBeLessThanOrEqual(0)
    expect(daysUntil(null)).toBe(null)
    expect(daysUntil(undefined)).toBe(null)
    expect(daysUntil('not-a-date')).toBe(null)
  })
})

describe('formatDateRange', () => {
  it('renders both ends when known, one end otherwise, null when neither', () => {
    expect(formatDateRange('2026-07-18', '2026-07-20')).toBe('Jul 18 – Jul 20')
    expect(formatDateRange('2026-07-18', null)).toBe('Jul 18')
    expect(formatDateRange(null, '2026-07-20')).toBe('Jul 20')
    expect(formatDateRange(null, null)).toBe(null)
    expect(formatDateRange('junk', 'junk')).toBe(null)
  })
})
