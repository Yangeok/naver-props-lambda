import { DataItem } from '../utils'
import { Pagination } from './Pagination'
import { useState } from 'react'

export const SidebarContent = ({ data }: { data: DataItem[] }) => {
  const itemsPerPage = 10

  const [currentPage, setCurrentPage] = useState(0)

  const offset = currentPage * itemsPerPage
  const currentData = data.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(data.length / itemsPerPage)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected)
  }

  return (
    <div className="p-4 max-h-[600px] overflow-y-auto">
      {currentData.map((item, index) => (
        <div key={index} className="p-0.5 mb-2 border-b hover:bg-gray-50">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-semibold">{item.title}</div>
            <div className="text-xs text-gray-600">
              {item.amount}억원 • {item.size}㎡
            </div>
            <div className="text-xs text-gray-500">{item.address}</div>
            <div className="text-xs text-gray-400">
              {item.subway} {item.length}m
            </div>
          </div>
        </div>
      ))}
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  )
}
