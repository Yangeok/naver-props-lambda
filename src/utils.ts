import { ReactElement } from "react"

export interface DataItem {
  title: string
  latlng: {
    lat: number
    lng: number
  }
  content: ReactElement
  summary: string
  date: string
}

export interface MarkerData {
  position: {
    lat: number
    lng: number
  }
  title: string
  content: ReactElement
  dateRange: DateRange
}

export enum DateRange {
  YESTERDAY = 'YESTERDAY',
  LAST_WEEK = 'LAST_WEEK',
  TWO_WEEKS_AGO = 'TWO_WEEKS_AGO',
  OUT_OF_RANGE = 'OUT_OF_RANGE'
}

export const checkDateRange = (date: Date): DateRange => {
  const day = 24 * 60 * 60 * 1000
  const today = new Date().setHours(0, 0, 0, 0)
  const tomorrow = new Date(today + day)
  const yesterday = new Date(today - day)
  const oneWeekAgo = new Date(today - 7 * day)
  const twoWeekAgo = new Date(today - 14 * day)

  if (date >= yesterday && date <= tomorrow) {
    return DateRange.YESTERDAY
  } else if (date >= oneWeekAgo && date < yesterday) {
    return DateRange.LAST_WEEK
  } else if (date >= twoWeekAgo && date < oneWeekAgo) {
    return DateRange.TWO_WEEKS_AGO
  } else {
    return DateRange.OUT_OF_RANGE
  }
}

export const groupBy = <T, K extends keyof any>(array: T[], getKey: (item: T) => K) => {
  return array.reduce((acc, item) => {
    const key = getKey(item)
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {} as Record<K, T[]>)
}