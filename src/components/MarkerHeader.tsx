import React from 'react'

/**
 * 마커 헤더에 표시될 부동산 기본 정보를 담고 있는 인터페이스입니다.
 * 지도에서 특정 마커에 대한 간단한 부동산 정보를 표시하는 데 사용됩니다.
 */
interface IMarkerHeader {
  /** 매물 이름 */
  title: string

  /** 부동산 승인 연도 */
  approvalYear: string

  /** 부동산이 위치한 지역 또는 구역 */
  area: string

  /** 부동산의 크기 (예: 제곱미터) */
  size: string

  /** 부동산 내 가구 수 */
  householdCount: number

  /** 부동산의 방 개수 */
  rooms: string

  /** 부동산의 욕실 개수 */
  bathrooms: string

  /** 인근 지하철역 */
  subway: string

  /** 인근 지하철 노선 */
  subwayLine: string

  /** 지하철역에서 부동산까지의 거리 */
  length: string

  /** 부동산 주소 */
  address: string

  /** 해당 그룹의 크기 (선택적 필드) */
  groupSize?: number
}

export const MarkerHeader: React.FC<IMarkerHeader> = ({
  title,
  approvalYear,
  address,
  area,
  size,
  householdCount,
  rooms,
  bathrooms,
  subway,
  subwayLine,
  length,
  groupSize,
}) => {
  return (
    <div className="relative float-left p-1 mb-1 bg-white border border-b-2 border-gray-300 rounded-md shadow-sm border-b-gray-400 w-72">
      <div className="text-sm font-semibold whitespace-normal">
        {title} ({approvalYear}년 승인){' '}
        {groupSize && (
          <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
            +{groupSize}
          </span>
        )}
      </div>
      <div className="text-xs whitespace-normal">{address}</div>
      <hr />
      <div className="text-xs whitespace-normal">
        {area} {size}m² {householdCount}세대
      </div>
      <div className="text-xs whitespace-normal">
        방/화장실 {rooms}/{bathrooms}개{' '}
        {subway && `${subwayLine} (${subway}) ${length}m`}
      </div>
    </div>
  )
}
