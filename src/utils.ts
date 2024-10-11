import { differenceInDays, startOfDay } from 'date-fns'
import { ReactNode } from 'react'

export interface Center { 
  lat: number
  lng: number
}

export interface DataItem {
  title: string
  latlng: Center
  amount: number
  approvalYear: string
  link1: string
  link2: string
  area: string
  size: string
  householdCount: number
  minFloor: number | string
  maxFloor: number
  direction: string
  rooms: string
  bathrooms: string
  subwayLine: string
  subway: string
  length: string
  additionalInfo: string
  date: string
}

export interface MarkerData {
  position: {
    lat: number
    lng: number
  }
  title: string
  content: ReactNode
  dateRange: DateRange
}

export enum DateRange {
  YESTERDAY = 'YESTERDAY',
  LAST_WEEK = 'LAST_WEEK',
  TWO_WEEKS_AGO = 'TWO_WEEKS_AGO',
  OUT_OF_RANGE = 'OUT_OF_RANGE'
}

export const checkDateRange = (date: Date): DateRange => {
  const today = startOfDay(new Date())
  const diffDays = differenceInDays(today, startOfDay(date))

  if (diffDays <= 1) {
    return DateRange.YESTERDAY
  } else if (diffDays <= 7 && diffDays > 2) {
    return DateRange.LAST_WEEK
  } else if (diffDays <= 14 && diffDays > 7) {
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

export const parseDate = (str: string) => {
  if (!str) {
    return new Date(0)
  }
  const [year, month, day] = str.split('.')
  return new Date(`20${year}-${month}-${day}`)
}

export const getLatestDateRange = (dateRanges: DateRange[]): DateRange => {
  return dateRanges.reduce((prev, curr) => {
    if (curr === DateRange.YESTERDAY) return curr
    if (curr === DateRange.LAST_WEEK && prev !== DateRange.YESTERDAY) return curr
    if (curr === DateRange.TWO_WEEKS_AGO && prev === DateRange.OUT_OF_RANGE) return curr
    return prev
  }, DateRange.OUT_OF_RANGE)
}

export const getLatestDate = (dates: Date[]): Date => {
  return dates.reduce((latest, current) => (current > latest ? current : latest))
}

export const filterGroupedItems = <T>(groupedItems: Record<string, T[]>): T[][] => {
  return Object.values(groupedItems).filter(group => group.length > 1)
}

export const filterOutGroupedItems = <T>(groupedItems: Record<string, T[]>): T[] => {
  return Object.values(groupedItems)
    .filter(group => group.length === 1)
    .flat()
}

export const getMarkerImageSrc = (dateRange: DateRange) => {
  switch (dateRange) {
    case DateRange.YESTERDAY:
      return '/markers/blue.png'
    case DateRange.LAST_WEEK:
      return '/markers/green.png'
    case DateRange.TWO_WEEKS_AGO:
      return '/markers/red.png'
    default:
      return '/markers/black.png'
  }
}
