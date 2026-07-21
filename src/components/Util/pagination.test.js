/** The Show More ladder: 10 visible -> 50 -> 100 -> doubling. */
import { describe, expect, it } from 'vitest'
import { INITIAL_VISIBLE, nextVisible } from './pagination'

describe('nextVisible', () => {
  it('climbs 10 -> 50 -> 100 -> 200 -> 400', () => {
    expect(nextVisible(INITIAL_VISIBLE)).toBe(50)
    expect(nextVisible(50)).toBe(100)
    expect(nextVisible(100)).toBe(200)
    expect(nextVisible(200)).toBe(400)
  })
})
