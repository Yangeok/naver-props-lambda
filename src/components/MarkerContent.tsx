import React from 'react'
import { DepositAnalysis } from './'

/**
 * 마커 콘텐츠의 상세 정보를 담고 있는 인터페이스입니다.
 * 지도에서 특정 마커에 대한 부동산 관련 정보를 표시하는 데 사용됩니다.
 */
export interface IMarkerContent {
  /** 매물 이름 */
  title: string

  /** 매물과 관련된 금액 (예: 가격 또는 비용) */
  amount: number

  /** 매물과 관련된 주요 링크 */
  link1: string

  /** 매물과 관련된 추가 링크 */
  link2: string

  /** 매물의 최소 층수 */
  minFloor: number | string

  /** 매물의 최대 층수 */
  maxFloor: number

  /** 매물에 대한 추가 정보 */
  additionalInfo: string

  /** 정보 업데이트 날짜 */
  date: string

  /** 매물의 방향 */
  direction: string

  /** 매물의 첫 등록일 (선택적 필드) */
  firstDate?: string

  /** 시세 업데이트 날짜 (선택적 필드) */
  priceDate?: string

  /** 전세가 최대 (선택적 필드) */
  depositPriceMax?: number

  /** 전세가 최소 (선택적 필드) */
  depositPriceMin?: number
}

export const MarkerContent: React.FC<IMarkerContent> = ({
  amount,
  link1,
  link2,
  minFloor,
  maxFloor,
  additionalInfo,
  date,
  direction,
  firstDate,
  depositPriceMax,
  depositPriceMin,
}) => {
  const renderLink = (url: string, altText: string, iconUrl: string) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="ml-1">
      <img
        src={iconUrl}
        className="align-bottom w-[18px] h-[18px]"
        alt={altText}
      />
    </a>
  )

  return (
    <div className="relative float-left p-1 mb-1 bg-white border border-b-2 border-gray-300 rounded-md shadow-sm border-b-gray-400 w-72">
      <div className="text-xs whitespace-normal">
        <strong className="text-sm font-semibold">{amount}</strong>
        <strong>억원</strong> {minFloor}/{maxFloor}층 {direction}
        {renderLink(
          link1,
          'Kakao Map Favicon',
          'https://t1.daumcdn.net/localimg/localimages/07/common/kakaomap_favicon.ico'
        )}
        {renderLink(
          link2,
          'Naver Favicon',
          'https://www.naver.com/favicon.ico'
        )}
      </div>
      {depositPriceMax && depositPriceMin && (
        <DepositAnalysis
          amount={amount}
          depositPriceMin={depositPriceMin}
          depositPriceMax={depositPriceMax}
        />
      )}
      <div className="text-xs whitespace-normal">{additionalInfo}</div>
      <div className="text-xs whitespace-normal">
        {date} 등록
        {firstDate && date !== firstDate ? ` (${firstDate} 최초 등록)` : ''}
      </div>
    </div>
  )
}
