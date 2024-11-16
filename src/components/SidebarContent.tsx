import { Center, DataItem, MarkerData, parseDate } from '../utils'
import { format } from 'date-fns'
import { MarkerContent, MarkerHeader } from './'
import { Pagination } from './Pagination'
import { useMemo, useState } from 'react'

export const SidebarContent = ({
  data,
  setCenter,
  setSelectedMarker,
}: {
  data: DataItem[]
  setCenter: React.Dispatch<React.SetStateAction<Center>>
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerData | null>>
}) => {
  console.log(data)
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(0)
  const [groupBy, setGroupBy] = useState('')

  const handleGrouping = (data: DataItem[]) => {
    switch (groupBy) {
      case 'area':
        return data.reduce(
          (acc, item) => {
            if (!acc[item.area]) acc[item.area] = []
            acc[item.area].push(item)
            return acc
          },
          {} as Record<string, DataItem[]>
        )
      case 'district':
        return data.reduce(
          (acc, item) => {
            // "구"로 끝나는 부분만 추출
            const districtMatch = item.address?.match(/([^\s]+구)/)
            const district = districtMatch ? districtMatch[0] : 'Unknown'
            if (!acc[district]) acc[district] = []
            acc[district].push(item)
            return acc
          },
          {} as Record<string, DataItem[]>
        )
      case 'subwayLine':
        return data.reduce(
          (acc, item) => {
            const line = item.subwayLine
            if (!acc[line]) acc[line] = []
            acc[line].push(item)
            return acc
          },
          {} as Record<string, DataItem[]>
        )
      case 'bathrooms':
        return data.reduce(
          (acc, item) => {
            if (!acc[item.bathrooms]) acc[item.bathrooms] = []
            acc[item.bathrooms].push(item)
            return acc
          },
          {} as Record<string, DataItem[]>
        )
      case 'direction':
        return data.reduce(
          (acc, item) => {
            if (!acc[item.direction]) acc[item.direction] = []
            acc[item.direction].push(item)
            return acc
          },
          {} as Record<string, DataItem[]>
        )
      default:
        return { All: data }
    }
  }

  const groupedData = useMemo(() => handleGrouping(data), [data, groupBy])
  const offset = currentPage * itemsPerPage

  const pageCount = Math.ceil(data.length / itemsPerPage)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected)
  }

  const handleItemClick = (item: DataItem) => {
    setCenter(item.latlng)

    const markerData: MarkerData = {
      position: item.latlng,
      title: item.title,
      content: (
        <>
          <MarkerHeader {...item} />
          <MarkerContent
            {...item}
            firstDate={format(parseDate(item.date), 'yy.MM.dd.')}
          />
        </>
      ),
      latestDate: parseDate(item.date),
    }

    setSelectedMarker(markerData)
  }

  const groupButtons = [
    { id: '', label: '전체' },
    { id: 'area', label: '지역' },
    { id: 'district', label: '구' },
    { id: 'subwayLine', label: '지하철' },
    { id: 'bathrooms', label: '화장실' },
    { id: 'direction', label: '방향' },
  ]

  const renderGroupButtons = () => (
    <div className="mb-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 px-1 pb-2 snap-x snap-mandatory">
        {groupButtons.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setGroupBy(id)}
            className={`flex-none snap-start px-1.5 py-1 rounded-lg text-xs font-medium transition-colors outline-none border-none ${
              groupBy === id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-4 max-h-[600px] overflow-y-auto">
      {renderGroupButtons()}
      {Object.entries(groupedData).map(([group, items]) => (
        <div key={group} className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">
            {group === 'All' ? '전체 매물' : group}
          </h3>
          {items.slice(offset, offset + itemsPerPage).map((item, index) => (
            <div
              key={index}
              className="p-0.5 mb-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleItemClick(item)}
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
          ))}
        </div>
      ))}
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  )
}
