import React from 'react'
import { DataItem } from '../utils'

export interface PropertyItemProps {
  item: DataItem
  onClick: (item: DataItem) => void
}

/**
 * PropertyItem 컴포넌트는 주어진 데이터 항목을 표시하고, 클릭 시 해당 항목을 처리하는 기능을 제공합니다.
 *
 * @component
 * @example
 * // PropertyItem 컴포넌트는 다음과 같이 사용됩니다.
 * <PropertyItem item={dataItem} onClick={handleClick} />
 *
 * @param {PropertyItemProps} props - PropertyItem 컴포넌트에 필요한 속성
 * @param {DataItem} props.item - 표시할 데이터 항목
 * @param {(item: DataItem) => void} props.onClick - 항목 클릭 시 호출될 함수
 * @returns {JSX.Element} 주어진 데이터를 렌더링하는 React 컴포넌트
 */
export const PropertyItem: React.FC<PropertyItemProps> = ({
  item,
  onClick,
}) => (
  <div
    className="p-0.5 mb-2 hover:bg-gray-50 cursor-pointer"
    onClick={() => onClick(item)}
  >
    <div className="flex flex-col gap-1">
      <div className="text-sm font-semibold">{item.title}</div>
      <div className="text-xs text-gray-600">
        {item.amount}억원 • {item.size}㎡
      </div>
      <div className="text-xs text-gray-500">{item.address}</div>
      {item.subway && (
        <div className="text-xs text-gray-400">
          {item.subway} {item.length}m
        </div>
      )}
    </div>
  </div>
)
