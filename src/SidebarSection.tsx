import { Center, DataItem, MarkerData } from './utils'
import { Menu, Sidebar, SubMenu } from 'react-pro-sidebar'
import { SidebarContent } from './components/SidebarContent'

export const SidebarSection = ({
  data,
  collapsed,
  handlePropertyClick,
  setCenter,
  setSelectedMarker,
}: {
  data: DataItem[]
  collapsed: boolean
  handlePropertyClick: () => void
  setCenter: React.Dispatch<React.SetStateAction<Center>>
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerData | null>>
}) => {
  return (
    <div
      className={`sidebar-container !fixed !z-40 h-full transition-all duration-300 transform ${
        collapsed ? '-translate-x-full' : 'translate-x-0'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <Sidebar collapsed={collapsed} className="h-full bg-white">
        <div className="gap-2 pt-4 pl-4 text-lg font-semibold text-primary">
          일반
        </div>
        <Menu>
          <SubMenu label="매물" onClick={handlePropertyClick} open={true}>
            <SidebarContent
              data={data}
              setCenter={setCenter}
              setSelectedMarker={setSelectedMarker}
            />
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  )
}
