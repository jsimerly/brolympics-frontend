/**
 * Semantic notification tones -- the "success shows a red border" class of
 * bug: callers say success/warning/error, the component owns the styling,
 * and a newer message always outlives an older message's hide-timer.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Notification, {
  NotificationProvider,
  useNotification,
} from './Notification'

const Harness = () => {
  const { notification, showNotification } = useNotification()
  return (
    <div>
      {notification.show && (
        <Notification
          message={notification.message}
          tone={notification.tone}
          onClose={() => showNotification('')}
        />
      )}
      <button onClick={() => showNotification('It worked!', 'success')}>
        fire success
      </button>
      <button onClick={() => showNotification('Heads up', 'warning')}>
        fire warning
      </button>
      <button onClick={() => showNotification('It broke')}>fire bare</button>
    </div>
  )
}

const banner = () => screen.getByText(/It worked!|Heads up|It broke/).closest('div').parentElement

describe('Notification tones', () => {
  it('success wears the green border, never the error red', () => {
    render(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>
    )
    act(() => screen.getByText('fire success').click())
    expect(banner().className).toContain('border-tertiary')
    expect(banner().className).not.toContain('border-errorRed')
  })

  it('warning is amber and a toneless call defaults to error red', () => {
    render(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>
    )
    act(() => screen.getByText('fire warning').click())
    expect(banner().className).toContain('border-yellow-500')
    act(() => screen.getByText('fire bare').click())
    expect(banner().className).toContain('border-errorRed')
  })
})

describe('Notification timer', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("a newer message is never hidden by an older message's timer", () => {
    render(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>
    )
    act(() => screen.getByText('fire bare').click())
    act(() => vi.advanceTimersByTime(3000))
    // 3s into the first message's life, a second message fires
    act(() => screen.getByText('fire success').click())
    // 2s later the FIRST timer would have expired (5s > 4s); the new
    // message must still be up
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByText('It worked!')).toBeInTheDocument()
    // and it hides on its own schedule
    act(() => vi.advanceTimersByTime(2100))
    expect(screen.queryByText('It worked!')).not.toBeInTheDocument()
  })
})
