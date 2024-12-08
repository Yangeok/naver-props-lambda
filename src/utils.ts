import { differenceInDays, startOfDay } from 'date-fns'
import { ReactNode } from 'react'

/**
 * 지도 유형을 나타내는 열거형입니다.
 * 다양한 지도 표시 옵션을 선택할 수 있습니다.
 */
export enum MapTypeIdEnum {
  /** 스카이뷰와 레이블을 함께 보여주는 하이브리드 지도 */
  HYBRID = 'HYBRID',

  /** 로드뷰를 보여주는 지도 */
  ROADVIEW = 'ROADVIEW',

  /** 실시간 교통 정보를 보여주는 지도 */
  TRAFFIC = 'TRAFFIC',

  /** 지형을 강조하여 보여주는 지도 */
  TERRAIN = 'TERRAIN',

  /** 자전거 도로 정보를 포함하는 지도 */
  BICYCLE = 'BICYCLE',

  /** 지적 편집도를 보여주는 지도 */
  USE_DISTRICT = 'USE_DISTRICT',
}

/**
 * 지도의 중심 좌표를 나타내는 인터페이스입니다.
 */
export interface Center {
  /** 위도 (latitude) 값 */
  lat: number

  /** 경도 (longitude) 값 */
  lng: number
}

/**
 * 부동산 상세 정보를 담고 있는 데이터 항목을 나타냅니다.
 * 아파트나 건물 등 부동산 정보를 표시하거나 처리하는 애플리케이션에서 사용됩니다.
 */
export interface DataItem {
  /** 매물 ID */
  id: string

  /** 매물 이름 */
  title: string

  /** 부동산의 위도와 경도를 나타내는 좌표 */
  latlng: Center

  /** 부동산과 관련된 금액 (예: 가격 또는 비용) */
  amount: number

  /** 부동산 승인 연도 */
  approvalYear: string

  /** 부동산과 관련된 주요 링크 */
  link1: string

  /** 부동산과 관련된 추가 링크 */
  link2: string

  /** 부동산 주소 */
  address: string

  /** 부동산이 위치한 지역 또는 구역 */
  area: string

  /** 부동산의 크기 (예: 제곱미터) */
  size: string

  /** 부동산 내 가구 수 */
  householdCount: number

  /** 부동산의 최소 층수 */
  minFloor: number | string

  /** 부동산의 최대 층수 */
  maxFloor: number

  /** 부동산의 방향 */
  direction: string

  /** 부동산의 방 개수 */
  rooms: string

  /** 부동산의 욕실 개수 */
  bathrooms: string

  /** 인근 지하철 노선 */
  subwayLine: string

  /** 인근 지하철역 */
  subway: string

  /** 지하철역에서 부동산까지의 거리 */
  length: string

  /** 추가 정보 */
  additionalInfo: string

  /** 정보 업데이트 날짜 */
  date: string

  /** 시세 업데이트 날짜 */
  priceDate?: string

  /** 매매가 최대 */
  dealPriceMax?: number

  /** 매매가 최소 */
  dealPriceMin?: number

  /** 전세가 최대 */
  depositPriceMax?: number

  /** 전세가 최소 */
  depositPriceMin?: number
}

/**
 * 마커 데이터를 나타내는 인터페이스입니다.
 * 지도에서 마커의 위치, 제목, 내용, 최신 날짜를 포함합니다.
 */
export interface MarkerData {
  /** 마커의 위치 좌표 (위도 및 경도) */
  position: {
    lat: number
    lng: number
  }
  /** 마커의 제목 */
  title: string
  /** 마커에 표시할 콘텐츠 */
  content: ReactNode
  /** 데이터의 최신 날짜 */
  latestDate: Date
}

/**
 * 배열을 특정 키에 따라 그룹화하는 함수입니다.
 * @param array - 그룹화할 배열
 * @param getKey - 항목에서 그룹화할 키를 반환하는 함수
 * @returns 그룹화된 객체
 */
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

/**
 * 날짜 문자열을 Date 객체로 변환합니다.
 * @param str - 변환할 날짜 문자열 (형식: "YY.MM.DD")
 * @returns 변환된 Date 객체 (형식이 없으면 1970년 1월 1일로 설정)
 */
export const parseDate = (str: string): Date => {
  if (!str) {
    return new Date(0)
  }
  const [year, month, day] = str.split('.')
  return new Date(`20${year}-${month}-${day}`)
}

/**
 * 주어진 날짜 배열 중 가장 최근 날짜를 반환합니다.
 * @param dates - 날짜 배열
 * @returns 가장 최신 날짜
 */
export const getLatestDate = (dates: Date[]): Date => {
  return dates.reduce((latest, current) =>
    current > latest ? current : latest
  )
}

/**
 * 그룹화된 항목 중 그룹 내 항목이 2개 이상인 그룹만 필터링합니다.
 * @param groupedItems - 그룹화된 항목 객체
 * @returns 2개 이상의 항목을 가진 그룹 배열
 */
export const filterGroupedItems = <T>(
  groupedItems: Record<string, T[]>
): T[][] => {
  return Object.values(groupedItems).filter((group) => group.length > 1)
}

/**
 * 그룹화된 항목 중 그룹 내 항목이 하나뿐인 항목을 필터링하여 반환합니다.
 * @param groupedItems - 그룹화된 항목 객체
 * @returns 하나의 항목만 가진 그룹을 평탄화한 배열
 */
export const filterOutGroupedItems = <T>(
  groupedItems: Record<string, T[]>
): T[] => {
  return Object.values(groupedItems)
    .filter((group) => group.length === 1)
    .flat()
}

/**
 * 최신 날짜에 따라 RGB 색상을 반환합니다.
 * @param latestDate - 최신 날짜
 * @returns 날짜에 따라 결정된 RGB 색상 코드
 */
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

/**
 * 주어진 날짜에 따라 SVG 마커 이미지를 생성하여 반환합니다.
 * @param latestDate - 최신 날짜
 * @returns 생성된 SVG 마커 이미지의 Base64 인코딩된 데이터 URI
 */
export const getMarkerImageSrc = (latestDate: Date): string => {
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

/**
 * UTF-8 문자열을 Base64로 인코딩합니다.
 * @param str - 인코딩할 문자열
 * @returns Base64 인코딩된 문자열
 */
export const utf8ToBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str)
  const binary = String.fromCharCode(...bytes)

  return btoa(binary)
}

/**
 * 주어진 호가(amount)를 기준으로 최저가, 최대가 대비 매물의 분석 결과를 반환합니다.
 *
 * @param {number} amount - 현재 매물의 호가.
 * @param {number} depositPriceMin - 전체 매물의 최저가.
 * @param {number} depositPriceMax - 전체 매물의 최대가.
 * @returns {{ percentText: string; priceComparison: string; clampedInRange: string }} 분석 결과를 담은 객체를 반환합니다.
 * - `percentText`: 최저가 대비 % 값.
 * - `isExpensive`: 매물이 최저가보다 비싸다면 `true`, 아니면 `false`.
 * - `clampedInRange`: 범위를 0% ~ 100%로 제한한 값.
 *
 * @throws {Error} 만약 `depositPriceMin`과 `depositPriceMax`가 동일하다면,
 * 계산 오류를 방지하기 위해 예외를 발생시킵니다.
 *
 * @example
 * const amount = 30000;
 * const depositPriceMin = 20000;
 * const depositPriceMax = 50000;
 *
 * const result = analyzeDeposit(amount, depositPriceMin, depositPriceMax);
 * console.log(result.isExpensive); // true
 * console.log(result.percentText); // "50.00%"
 * console.log(result.clampedInRange); // 40.00
 */
export const analyzeDeposit = (
  amount: number,
  depositPriceMin: number,
  depositPriceMax: number
): { percentText: string; isExpensive: boolean; clampedInRange: string } => {
  if (depositPriceMin === depositPriceMax) {
    throw new Error('최저가와 최대가는 같을 수 없습니다.')
  }

  // 최저가 대비 % 계산
  const percentAboveMin = ((amount - depositPriceMin) / depositPriceMin) * 100

  // 전체 구간 내 % 계산
  const percentInRange =
    ((amount - depositPriceMin) / (depositPriceMax - depositPriceMin)) * 100

  // 고가 여부 판별
  const isExpensive = amount >= depositPriceMin

  // 범위를 0% ~ 100%로 제한
  const clampedInRange = Math.max(0, Math.min(100, percentInRange)).toFixed(2)

  // 텍스트 생성
  const percentText = `${Math.abs(percentAboveMin).toFixed(2)}`

  return { percentText, isExpensive, clampedInRange }
}
