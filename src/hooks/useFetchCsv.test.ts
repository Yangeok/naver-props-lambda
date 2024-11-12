import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFetchCsv } from './useFetchCsv'

const mockCsvData = `column1,column2,column3\nvalue1,value2,value3\nvalue4,value5,value6`

describe('useFetchCsv', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      text: vi.fn().mockResolvedValue(mockCsvData),
    } as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('fetches CSV and parses the data correctly', async () => {
    const { result } = renderHook(() => useFetchCsv('/test.csv'))

    await waitFor(() => {
      expect(result.current.header).toEqual(['column1', 'column2', 'column3'])
      expect(result.current.rows).toEqual([
        ['value1', 'value2', 'value3'],
        ['value4', 'value5', 'value6'],
      ])
      expect(result.current.error).toBeNull()
    })
  })

  test('handles fetch error', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to fetch'))

    const { result } = renderHook(() => useFetchCsv('/error.csv'))

    await waitFor(() => {
      expect(result.current.error).toEqual(new Error('Failed to fetch'))
      expect(result.current.header).toBeUndefined()
      expect(result.current.rows).toEqual([])
    })
  })
})
