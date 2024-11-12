import { describe, expect, test } from 'vitest'
import {
  filterGroupedItems,
  filterOutGroupedItems,
  getLatestDate,
  getRgbCode,
  groupBy,
  parseDate,
  utf8ToBase64,
} from './utils'
import { startOfDay, subDays } from 'date-fns'

describe('Utils Module', () => {
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
      expect(result).toEqual([
        [1, 2],
        [4, 5, 6],
      ])
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

  describe('getRgbCode', () => {
    test('should return #1E90FF for today', () => {
      const today = startOfDay(new Date())
      expect(getRgbCode(today)).toBe('#1E90FF')
    })

    test('should return #00BFFF for yesterday', () => {
      const yesterday = startOfDay(subDays(new Date(), 1))
      expect(getRgbCode(yesterday)).toBe('#00BFFF')
    })

    test('should return #00FF7F for 2 days ago', () => {
      const twoDaysAgo = startOfDay(subDays(new Date(), 2))
      expect(getRgbCode(twoDaysAgo)).toBe('#00FF7F')
    })

    test('should return #32CD32 for 5 days ago', () => {
      const fiveDaysAgo = startOfDay(subDays(new Date(), 5))
      expect(getRgbCode(fiveDaysAgo)).toBe('#32CD32')
    })

    test('should return #ADFF2F for 10 days ago', () => {
      const tenDaysAgo = startOfDay(subDays(new Date(), 10))
      expect(getRgbCode(tenDaysAgo)).toBe('#ADFF2F')
    })

    test('should return #FFD700 for more than 14 days ago', () => {
      const fifteenDaysAgo = startOfDay(subDays(new Date(), 15))
      expect(getRgbCode(fifteenDaysAgo)).toBe('#FFD700')
    })
  })

  describe('utf8ToBase64', () => {
    test('should convert a UTF-8 string to a base64 encoded string', () => {
      const input = 'Hello, World!'
      const expectedOutput = 'SGVsbG8sIFdvcmxkIQ=='
      expect(utf8ToBase64(input)).toBe(expectedOutput)
    })

    test('should handle empty strings', () => {
      const input = ''
      const expectedOutput = ''
      expect(utf8ToBase64(input)).toBe(expectedOutput)
    })

    test('should handle special characters', () => {
      const input = '안녕하세요'
      const expectedOutput = '7JWI64WV7ZWY7IS47JqU'
      expect(utf8ToBase64(input)).toBe(expectedOutput)
    })
  })
})
