import { differenceInDays, startOfDay } from 'date-fns'
import { ReactNode } from 'react'

// FIXME:
export enum MapTypeIdEnum {
  HYBRID = 'HYBRID', // 스카이뷰 + 레이블
  ROADVIEW = 'ROADVIEW', // 로드뷰
  TRAFFIC = 'TRAFFIC', // 교통정보
  TERRAIN = 'TERRAIN', // 지형도
  BICYCLE = 'BICYCLE', // 자전거
  USE_DISTRICT = 'USE_DISTRICT', // 지적편집도
}

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
  address: string
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
  latestDate: Date
}

export const groupBy = <T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
) => {
  return array.reduce(
    (acc, item) => {
      const key = getKey(item)
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    },
    {} as Record<K, T[]>
  )
}

export const parseDate = (str: string) => {
  if (!str) {
    return new Date(0)
  }
  const [year, month, day] = str.split('.')
  return new Date(`20${year}-${month}-${day}`)
}

export const getLatestDate = (dates: Date[]): Date => {
  return dates.reduce((latest, current) =>
    current > latest ? current : latest
  )
}

export const filterGroupedItems = <T>(
  groupedItems: Record<string, T[]>
): T[][] => {
  return Object.values(groupedItems).filter((group) => group.length > 1)
}

export const filterOutGroupedItems = <T>(
  groupedItems: Record<string, T[]>
): T[] => {
  return Object.values(groupedItems)
    .filter((group) => group.length === 1)
    .flat()
}

export const getRgbCode = (latestDate: Date): string => {
  const today = startOfDay(new Date())
  const diffDays = differenceInDays(today, startOfDay(latestDate))

  if (diffDays === 0) {
    return '#1E90FF'
  } else if (diffDays === 1) {
    return '#00BFFF'
  } else if (diffDays <= 3) {
    return '#00FF7F'
  } else if (diffDays <= 7) {
    return '#32CD32'
  } else if (diffDays <= 14) {
    return '#ADFF2F'
  } else {
    return '#FFD700'
  }
}

export const getMarkerImageSrc = (latestDate: Date) => {
  const svg = `
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="100%" stop-color="${getRgbCode(latestDate)}" stop-opacity="1" />
          <stop offset="0%" stop-color="#000000FF" stop-opacity="1" />
        </linearGradient>
      </defs>
      <path d="M12 0C7 0 3 4 3 9C3 16 12 24 12 24C12 24 21 16 21 9C21 4 17 0 12 0Z" fill="url(#grad)" />
      <circle cx="12" cy="9" r="3" fill="#FFFFFF" />
    </svg>
  `
  return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`
}

export const utf8ToBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str)
  const binary = String.fromCharCode(...bytes)

  return btoa(binary)
}
