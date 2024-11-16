import { Center, DataItem, MarkerData, parseDate } from './utils'
import { format } from 'date-fns'
import { GroupButtons } from './components/GroupButtons'
import { MarkerContent, MarkerHeader } from './components'
import { Menu, Sidebar, SubMenu } from 'react-pro-sidebar'
import { Pagination } from './components/Pagination'
import { PropertyItem } from './components/PropertyItem'
import { useMemo, useState } from 'react'

interface SidebarSectionProps {
  data: DataItem[]
  collapsed: boolean
  handlePropertyClick: () => void
  setCenter: React.Dispatch<React.SetStateAction<Center>>
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerData | null>>
}

export const SidebarSection = ({
  data,
  collapsed,
  setCenter,
  setSelectedMarker,
}: SidebarSectionProps) => {
  const itemsPerPage = 10
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({})
  const [groupBy, setGroupBy] = useState('')

  const groupedData = useMemo(() => {
    const groupingFunctions: Record<
      string,
      (item: DataItem) => string | undefined
    > = {
      area: (item) => item.area,
      district: (item) => item.address?.match(/([^\s]+구)/)?.[0],
      subwayLine: (item) => item.subwayLine,
      bathrooms: (item) => item.bathrooms,
      direction: (item) => item.direction,
    }

    if (!groupBy) return { All: data }

    const groupFn = groupingFunctions[groupBy]
    if (!groupFn) return { All: data }

    return data.reduce(
      (acc, item) => {
        const key = groupFn(item)
        if (!key) return acc
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
      },
      {} as Record<string, DataItem[]>
    )
  }, [data, groupBy])

  const handlePageChange =
    (group: string) =>
    ({ selected }: { selected: number }) => {
      setCurrentPages((prev) => ({
        ...prev,
        [group]: selected,
      }))
    }

  const handleItemClick = (item: DataItem) => {
    setCenter(item.latlng)
    setSelectedMarker({
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
    })
  }

  return (
    <div
      className={`sidebar-container !fixed !z-40 h-full transition-all duration-300 transform ${
        collapsed ? '-translate-x-full' : 'translate-x-0'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <Sidebar collapsed={collapsed} className="h-full bg-white">
        <div className="gap-2 pt-4 pl-4 text-lg font-semibold text-primary">
          매물
        </div>
        <Menu>
          <div className="p-4 max-h-[600px] overflow-y-auto">
            <GroupButtons groupBy={groupBy} setGroupBy={setGroupBy} />
            {Object.entries(groupedData).map(([group, items]) => {
              const currentPage = currentPages[group] || 0
              const offset = currentPage * itemsPerPage
              const pageCount = Math.ceil(items.length / itemsPerPage)

              return (
                <div key={group} className="mb-4 bg-transparent">
                  <SubMenu
                    label={`${group === 'All' ? '전체 매물' : group} ${
                      items.length > 0 && ` (${items.length})`
                    }`}
                    className="mb-2 text-base font-semibold"
                  >
                    {items
                      .slice(offset, offset + itemsPerPage)
                      .map((item, index) => (
                        <PropertyItem
                          key={index}
                          item={item}
                          onClick={handleItemClick}
                        />
                      ))}
                    {pageCount > 1 && (
                      <Pagination
                        pageCount={pageCount}
                        onPageChange={handlePageChange(group)}
                      />
                    )}
                  </SubMenu>
                </div>
              )
            })}
          </div>
        </Menu>
      </Sidebar>
    </div>
  )
}
