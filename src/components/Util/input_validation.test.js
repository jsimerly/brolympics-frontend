/**
 * Account-form validation: date/email/password/phone rules and the phone
 * normalizer that feeds Firebase (+1 E.164). errorSetter callbacks are plain
 * functions, so no mocking anywhere.
 */
import { describe, expect, it, vi } from 'vitest'
import AccountValidator, {
  convertDateFormat_MMDDYYY_to_YYYYMMDD,
  isOver18,
  isValidDate_MMDDYYYY,
  isValidEmail,
} from './input_validation'

describe('isValidDate_MMDDYYYY', () => {
  it('accepts real calendar dates in MM-DD-YYYY', () => {
    expect(isValidDate_MMDDYYYY('07-21-2026')).toBe(true)
    expect(isValidDate_MMDDYYYY('02-29-2024')).toBe(true) // leap day
  })

  it('rejects impossible dates and wrong formats', () => {
    expect(isValidDate_MMDDYYYY('02-30-2024')).toBe(false) // no Feb 30
    expect(isValidDate_MMDDYYYY('02-29-2023')).toBe(false) // not a leap year
    expect(isValidDate_MMDDYYYY('13-01-2024')).toBe(false) // month 13
    expect(isValidDate_MMDDYYYY('2024-02-01')).toBe(false) // ISO order
    expect(isValidDate_MMDDYYYY('2-1-2024')).toBe(false)   // unpadded
    expect(isValidDate_MMDDYYYY('')).toBe(false)
  })
})

describe('isOver18', () => {
  it('draws the line at exactly 18 years', () => {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const stamp = (yearsAgo, dayShift) => {
      const d = new Date(now.getFullYear() - yearsAgo,
                         now.getMonth(), now.getDate() + dayShift)
      return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()}`
    }
    expect(isOver18(stamp(18, -1))).toBe(true)   // 18th birthday yesterday
    expect(isOver18(stamp(18, +1))).toBe(false)  // turns 18 tomorrow
    expect(isOver18(stamp(30, 0))).toBe(true)
  })
})

describe('isValidEmail', () => {
  it('accepts normal addresses and rejects junk', () => {
    expect(isValidEmail('simerly81@gmail.com')).toBe(true)
    expect(isValidEmail('a.b+tag@sub.domain.co')).toBe(true)
    expect(isValidEmail('nope')).toBe(false)
    expect(isValidEmail('nope@nodot')).toBe(false)
    expect(isValidEmail('@missing.local')).toBe(false)
  })
})

describe('convertDateFormat_MMDDYYY_to_YYYYMMDD', () => {
  it('round-trips the digits without timezone drift', () => {
    expect(convertDateFormat_MMDDYYY_to_YYYYMMDD('07-04-2026')).toBe('2026-07-04')
    expect(convertDateFormat_MMDDYYY_to_YYYYMMDD('12-31-1999')).toBe('1999-12-31')
  })
})

describe('AccountValidator', () => {
  it('cleanPhoneNumber produces the +1 E.164 form Firebase wants', () => {
    const v = new AccountValidator()
    expect(v.cleanPhoneNumber('555-555-5555')).toBe('+15555555555')
  })

  it('validatePassword demands 8+ chars with an uppercase and a special', () => {
    const v = new AccountValidator()
    const setter = vi.fn()
    v.validatePassword('Str0ng!pass', setter)
    expect(v.errors).toEqual([])
    expect(setter).toHaveBeenLastCalledWith(false)

    v.validatePassword('weakpass', setter)
    expect(v.errors.at(-1)).toMatch(/uppercase/)
    expect(setter).toHaveBeenLastCalledWith(true)
  })

  it('validatePhoneNumber wants 555-555-5555 and flags anything else', () => {
    const v = new AccountValidator()
    const setter = vi.fn()
    v.validatePhoneNumber('317-289-8352', setter)
    expect(v.errors).toEqual([])
    v.validatePhoneNumber('3172898352', setter)
    expect(v.errors.at(-1)).toMatch(/555-555-5555/)
  })

  it('verifyPasswordsMatch catches mismatches and resetErrors clears', () => {
    const v = new AccountValidator()
    v.verifyPasswordsMatch('one', 'two')
    expect(v.errors).toHaveLength(1)
    v.resetErrors()
    expect(v.errors).toEqual([])
  })
})
