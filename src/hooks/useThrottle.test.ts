import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useThrottle } from './useThrottle'
import { vi } from 'vitest'

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should return initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('initial', 1000))

    expect(result.current).toBe('initial')
  })

  test('should throttle value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, limit }) => useThrottle(value, limit),
      {
        initialProps: { value: 'initial', limit: 1000 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', limit: 1000 })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe('updated')
  })

  test('should not update value before throttle limit is reached', () => {
    const { result, rerender } = renderHook(
      ({ value, limit }) => useThrottle(value, limit),
      {
        initialProps: { value: 'initial', limit: 1000 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', limit: 1000 })
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe('updated')
  })

  test('should clear timeout on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, limit }) => useThrottle(value, limit),
      {
        initialProps: { value: 'initial', limit: 1000 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', limit: 1000 })

    unmount()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBe('initial')
  })
})
