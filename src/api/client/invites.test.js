/**
 * Invite links must be built from VITE_FRONTEND_URL -- a hardcoded
 * brolympic.com once shipped and broke every invite from the dev site.
 * vite.config.ts pins the env to https://brolympic.test in test mode, so a
 * reintroduced literal domain fails these assertions.
 */
import { describe, expect, it } from 'vitest'
import {
  inviteLinkBrolympics, inviteLinkLeague, inviteLinkTeam,
} from './invites'

describe('invite link builders', () => {
  it('build each kind from the configured frontend origin', () => {
    expect(inviteLinkLeague('L1')).toBe('https://brolympic.test/invite/league/L1')
    expect(inviteLinkBrolympics('B1')).toBe('https://brolympic.test/invite/brolympics/B1')
    expect(inviteLinkTeam('T1')).toBe('https://brolympic.test/invite/team/T1')
  })

  it('never carry a hardcoded production domain', () => {
    for (const link of [inviteLinkLeague('x'), inviteLinkBrolympics('x'), inviteLinkTeam('x')]) {
      expect(link).not.toContain('brolympic.com')
    }
  })
})
