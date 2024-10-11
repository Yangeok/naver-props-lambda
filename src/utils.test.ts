import { describe, test, expect } from 'vitest'
import {
  checkDateRange,
  DateRange,
  parseDate,
  getLatestDateRange,
  getLatestDate,
  groupBy,
  filterGroupedItems,
  filterOutGroupedItems,
  getMarkerImageSrc,
} from './utils'
import { subDays } from 'date-fns'

describe('Utils Module', () => {
  describe('checkDateRange', () => {
    test('returns YESTERDAY for today or yesterday', () => {
      const today = new Date()
      const yesterday = subDays(new Date(), 1)

      expect(checkDateRange(today)).toBe(DateRange.YESTERDAY)
      expect(checkDateRange(yesterday)).toBe(DateRange.YESTERDAY)
    })

    test('returns LAST_WEEK for dates within the last week', () => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      expect(checkDateRange(date)).toBe(DateRange.LAST_WEEK)
    })

    test('returns TWO_WEEKS_AGO for dates between 8 and 14 days ago', () => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      expect(checkDateRange(date)).toBe(DateRange.TWO_WEEKS_AGO)
    })

    test('returns OUT_OF_RANGE for dates older than two weeks', () => {
      const date = new Date()
      date.setDate(date.getDate() - 20)
      expect(checkDateRange(date)).toBe(DateRange.OUT_OF_RANGE)
    })
  })

  describe('parseDate', () => {
    test('parses date string in "YY.MM.DD" format correctly', () => {
      const dateStr = '21.12.31'
      const parsedDate = parseDate(dateStr)
      expect(parsedDate).toEqual(new Date('2021-12-31'))
    })

    test('returns Unix epoch for empty string', () => {
      const parsedDate = parseDate('')
      expect(parsedDate.getTime()).toBe(0)
    })

    test('returns Unix epoch for null input', () => {
      const parsedDate = parseDate(null as any)
      expect(parsedDate.getTime()).toBe(0)
    })
  })

  describe('getLatestDateRange', () => {
    test('returns the most recent DateRange from an array', () => {
      const dateRanges = [
        DateRange.OUT_OF_RANGE,
        DateRange.TWO_WEEKS_AGO,
        DateRange.LAST_WEEK,
        DateRange.YESTERDAY,
      ]
      expect(getLatestDateRange(dateRanges)).toBe(DateRange.YESTERDAY)
    })

    test('handles arrays with only OUT_OF_RANGE', () => {
      const dateRanges = [DateRange.OUT_OF_RANGE, DateRange.OUT_OF_RANGE]
      expect(getLatestDateRange(dateRanges)).toBe(DateRange.OUT_OF_RANGE)
    })
  })

  describe('getLatestDate', () => {
    test('returns the latest date from an array of dates', () => {
      const dates = [
        new Date('2021-01-01'),
        new Date('2022-01-01'),
        new Date('2020-01-01'),
      ]
      expect(getLatestDate(dates)).toEqual(new Date('2022-01-01'))
    })

    test('handles an array with identical dates', () => {
      const date = new Date('2021-01-01')
      const dates = [date, date, date]
      expect(getLatestDate(dates)).toEqual(date)
    })
  })

  describe('groupBy', () => {
    test('groups items by specified key', () => {
      const items = [
        { id: 1, category: 'fruit' },
        { id: 2, category: 'vegetable' },
        { id: 3, category: 'fruit' },
      ]
      const grouped = groupBy(items, (item) => item.category)
      expect(grouped).toEqual({
        fruit: [
          { id: 1, category: 'fruit' },
          { id: 3, category: 'fruit' },
        ],
        vegetable: [{ id: 2, category: 'vegetable' }],
      })
    })

    test('handles empty array', () => {
      const grouped = groupBy([], (item) => item)
      expect(grouped).toEqual({})
    })
  })

  describe('filterGroupedItems', () => {
    test('returns groups with more than one item', () => {
      const groupedItems = {
        group1: [1, 2],
        group2: [3],
        group3: [4, 5, 6],
      }
      const result = filterGroupedItems(groupedItems)
      expect(result).toEqual([[1, 2], [4, 5, 6]])
    })

    test('returns empty array when no groups have more than one item', () => {
      const groupedItems = {
        group1: [1],
        group2: [2],
      }
      const result = filterGroupedItems(groupedItems)
      expect(result).toEqual([])
    })
  })

  describe('filterOutGroupedItems', () => {
    test('returns items from groups with only one item', () => {
      const groupedItems = {
        group1: [1],
        group2: [2, 3],
        group3: [4],
      }
      const result = filterOutGroupedItems(groupedItems)
      expect(result).toEqual([1, 4])
    })

    test('returns empty array when all groups have more than one item', () => {
      const groupedItems = {
        group1: [1, 2],
        group2: [3, 4],
      }
      const result = filterOutGroupedItems(groupedItems)
      expect(result).toEqual([])
    })
  })

  describe('getMarkerImageSrc', () => {
    test('returns correct image path for each DateRange', () => {
      expect(getMarkerImageSrc(DateRange.YESTERDAY)).toBe('/markers/blue.png')
      expect(getMarkerImageSrc(DateRange.LAST_WEEK)).toBe('/markers/green.png')
      expect(getMarkerImageSrc(DateRange.TWO_WEEKS_AGO)).toBe('/markers/red.png')
      expect(getMarkerImageSrc(DateRange.OUT_OF_RANGE)).toBe('/markers/black.png')
    })

    test('returns default image path for invalid DateRange', () => {
      expect(getMarkerImageSrc('INVALID' as DateRange)).toBe('/markers/black.png')
    })
  })
})
