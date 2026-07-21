/**
 * The stale-while-revalidate hook. Pins the error surface added after the
 * ghost-bro incident: a failed fetch with no cached copy must REPORT the
 * error (so pages can bounce), not skeleton forever.
 */
import { describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useCachedFetch from './useCachedFetch'

describe('useCachedFetch', () => {
  it('resolves data and reports no error', async () => {
    const { result } = renderHook(() =>
      useCachedFetch('ok-key', () => Promise.resolve({ name: 'Summer 2025' }))
    )
    await waitFor(() => expect(result.current.data).toEqual({ name: 'Summer 2025' }))
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('surfaces the fetch error when there is no cached copy', async () => {
    const boom = { response: { status: 404 } }
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() =>
      useCachedFetch('dead-key', () => Promise.reject(boom))
    )
    await waitFor(() => expect(result.current.error).toBe(boom))
    expect(result.current.data).toBeUndefined()
    expect(result.current.loading).toBe(false)
  })
})
