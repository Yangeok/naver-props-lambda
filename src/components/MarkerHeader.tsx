import React from 'react'

interface IMarkerHeader {
  title: string
  approvalYear: string
  area: string
  size: string
  householdCount: number
  rooms: string
  bathrooms: string
  subway: string
  subwayLine: string
  length: string
  address: string
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
        {title} ({approvalYear}년 승인) {groupSize && (
          <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
            +{groupSize}
          </span>
        )}
      </div>
      <div className="text-xs whitespace-normal">
        {address}
      </div>
      <hr />
      <div className="text-xs whitespace-normal">
        {area} {size}m² {householdCount}세대
      </div>
      <div className="text-xs whitespace-normal">
        방/화장실 {rooms}/{bathrooms}개 {subway && `${subwayLine} (${subway}) ${length}m`}
      </div>
    </div>
  )
}
