import React from 'react'

interface IMarkerContent {
  title: string
  amount: number
  approvalYear: string
  link1: string
  link2: string
  area: string
  size: string
  householdCount: number
  minFloor: number | string
  maxFloor: number
  rooms: string
  bathrooms: string
  subway: string
  subwayLine: string
  length: string
  additionalInfo: string
  date: string
  direction: string
  address: string
  firstDate?: string
}

export const MarkerContent: React.FC<IMarkerContent> = ({
  title,
  amount,
  approvalYear,
  link1,
  link2,
  address,
  area,
  size,
  householdCount,
  minFloor,
  maxFloor,
  rooms,
  bathrooms,
  subway,
  subwayLine,
  length,
  additionalInfo,
  date,
  direction,
  firstDate,
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
      <div className="text-sm font-semibold whitespace-normal">
        {title} {amount}억 ({approvalYear}년 승인)
        {renderLink(link1, "Kakao Map Favicon", "https://t1.daumcdn.net/localimg/localimages/07/common/kakaomap_favicon.ico")}
        {renderLink(link2, "Naver Favicon", "https://www.naver.com/favicon.ico")}
      </div>
      <div className="text-xs whitespace-normal">
        {address}
      </div>
      <hr />
      <div className="text-xs whitespace-normal">
        {area} {size}m² {direction} {householdCount}세대
      </div>
      <div className="text-xs whitespace-normal">
        {minFloor}/{maxFloor}층 방/화장실 {rooms}/{bathrooms}개
      </div>
      <div className="text-xs whitespace-normal">
        {subway && `${subwayLine} (${subway}) ${length}m`}
      </div>
      <div className="text-xs whitespace-normal">{additionalInfo}</div>
      <div className="text-xs whitespace-normal">
        {date} 등록
        {firstDate && date !== firstDate ? ` (${firstDate} 최초 등록)` : ''}
      </div>
    </div>
  )
}
