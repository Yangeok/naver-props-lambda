import React from 'react'

export interface IMarkerContent {
  title: string
  amount: number
  link1: string
  link2: string
  minFloor: number | string
  maxFloor: number
  additionalInfo: string
  date: string
  direction: string
  firstDate?: string
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
        <strong className="text-sm font-semibold">{amount}</strong><strong>억원</strong> {minFloor}/{maxFloor}층 {direction}
        {renderLink(link1, "Kakao Map Favicon", "https://t1.daumcdn.net/localimg/localimages/07/common/kakaomap_favicon.ico")}
        {renderLink(link2, "Naver Favicon", "https://www.naver.com/favicon.ico")}
      </div>
      <div className="text-xs whitespace-normal">
        
      </div>
      <div className="text-xs whitespace-normal">{additionalInfo}</div>
      <div className="text-xs whitespace-normal">
        {date} 등록
        {firstDate && date !== firstDate ? ` (${firstDate} 최초 등록)` : ''}
      </div>
    </div>
  )
}
