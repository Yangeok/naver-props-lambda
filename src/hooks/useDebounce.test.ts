import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))

    expect(result.current).toBe('initial')
  })

  test('should debounce value change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  test('should reset debounce timer when value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(250)
    })

    expect(result.current).toBe('initial')

    rerender({ value: 'latest', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('latest')
  })

  test('should clean up the timeout on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    unmount()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('initial')
  })
})
