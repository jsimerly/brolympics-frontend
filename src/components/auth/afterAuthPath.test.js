/**
 * afterAuthPath is the invite deep-link fix: every login/signup surface
 * (email, Google, phone, create-account) lands the user on location.state.from
 * so invite links survive the auth wall. All four paths dropping `from` was a
 * shipped production bug -- these tests pin the resolver they now share.
 */
import { describe, expect, it } from 'vitest'
import { afterAuthPath, isInviteBound } from './afterAuthPath'

describe('afterAuthPath', () => {
  it('falls back to home when there is no stashed origin', () => {
    expect(afterAuthPath(undefined)).toBe('/')
    expect(afterAuthPath(null)).toBe('/')
    expect(afterAuthPath({})).toBe('/')
    expect(afterAuthPath({ state: null })).toBe('/')
    expect(afterAuthPath({ state: {} })).toBe('/')
  })

  it('passes a string `from` through verbatim', () => {
    expect(afterAuthPath({ state: { from: '/invite/team/abc' } }))
      .toBe('/invite/team/abc')
  })

  it('joins pathname and search from a location-object `from`', () => {
    const location = {
      state: { from: { pathname: '/invite/league/xyz', search: '?ref=text' } },
    }
    expect(afterAuthPath(location)).toBe('/invite/league/xyz?ref=text')
  })

  it('defaults a missing pathname to home but keeps the search', () => {
    expect(afterAuthPath({ state: { from: { search: '?x=1' } } })).toBe('/?x=1')
    expect(afterAuthPath({ state: { from: {} } })).toBe('/')
  })
})

describe('isInviteBound', () => {
  it('is true only for invite destinations', () => {
    expect(isInviteBound({ state: { from: '/invite/team/abc' } })).toBe(true)
    expect(isInviteBound({ state: { from: { pathname: '/invite/brolympics/x' } } }))
      .toBe(true)
    expect(isInviteBound({ state: { from: '/b/abc/home' } })).toBe(false)
    expect(isInviteBound({})).toBe(false)
  })
})
