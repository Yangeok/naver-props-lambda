import { DataItem } from '../utils'

interface PropertyItemProps {
  item: DataItem
  onClick: (item: DataItem) => void
}

export const PropertyItem = ({ item, onClick }: PropertyItemProps) => (
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
