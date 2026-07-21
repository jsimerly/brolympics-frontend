/**
 * apiErrorMessage turns any axios failure into words a human can act on --
 * the old inline detail[0] pattern showed "<" for a 500's HTML page (that
 * shipped: the prod brolympics-create error banner said nothing).
 */
import { describe, expect, it } from 'vitest'
import { apiErrorMessage } from './apiError'

const err = (data) => ({ response: { data } })
const FALLBACK = 'Something broke. Try again.'

describe('apiErrorMessage', () => {
  it('uses the fallback when there is no response at all', () => {
    expect(apiErrorMessage(new Error('Network Error'), FALLBACK)).toBe(FALLBACK)
    expect(apiErrorMessage(undefined, FALLBACK)).toBe(FALLBACK)
  })

  it('shows the first message of a DRF error array', () => {
    expect(apiErrorMessage(err(['This contest is already recorded.']), FALLBACK))
      .toBe('This contest is already recorded.')
    expect(apiErrorMessage(err([]), FALLBACK)).toBe(FALLBACK)
  })

  it('shows a detail message', () => {
    expect(apiErrorMessage(err({ detail: 'Only a league admin can do that.' }), FALLBACK))
      .toBe('Only a league admin can do that.')
  })

  it('names the field for DRF field errors', () => {
    expect(apiErrorMessage(err({ name: ['This field is required.'] }), FALLBACK))
      .toBe('name: This field is required.')
  })

  it('passes a plain-string body through but never renders an HTML page', () => {
    expect(apiErrorMessage(err('Registration is closed.'), FALLBACK))
      .toBe('Registration is closed.')
    // the shipped bug: detail[0] of an HTML 500 page rendered as "<"
    expect(apiErrorMessage(err('<!DOCTYPE html><html>Server Error</html>'), FALLBACK))
      .toBe(FALLBACK)
  })
})
