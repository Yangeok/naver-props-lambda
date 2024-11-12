import Div100vh from 'react-div-100vh'
import React, { useEffect, useRef, useState } from 'react'
import { Allotment } from 'allotment'
import { Center, DataItem, MarkerData } from './utils'
import { HiMenu } from 'react-icons/hi'
import { MapSection } from './MapSection'
import { Menu, Sidebar, SubMenu } from 'react-pro-sidebar'
import { RoadviewButton } from './components'
import { RoadviewSection } from './RoadviewSection'
import { useFetchCsv } from './hooks'
import { useKakaoLoader } from 'react-kakao-maps-sdk'
import { useNavigate } from 'react-router-dom'
import './index.css'
import 'allotment/dist/style.css'

const App: React.FC = () => {
  const navigate = useNavigate()
  // const [searchParams] = useSearchParams()

  useKakaoLoader({
    appkey: String(import.meta.env.VITE_KAKAO_APP_KEY),
    libraries: ['services'],
  })

  const [sizes, setSizes] = useState<any[]>(['100%', '0'])
  const [vertical, setVertical] = useState<boolean>(false)
  const mapRef = useRef<kakao.maps.Map>(null)
  const [center, setCenter] = useState<Center>({
    lat: 37.566535,
    lng: 126.9779692,
  })
  const [pan, setPan] = useState(0)
  const [data, setData] = useState<DataItem[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const [isRoadviewVisible, setIsRoadviewVisible] = useState(false)
  const [collapsed, setCollapsed] = useState(true) // Sidebar

  const { rows, error } = useFetchCsv('/analysis.csv')

  //#region handler fns
  const handleRoadviewToggle = () => {
    setIsRoadviewVisible(!isRoadviewVisible)
  }

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      !collapsed &&
      (e.target as HTMLElement).closest('.sidebar-container') === null
    ) {
      setCollapsed(true)
    }
  }

  const handlePropertyClick = () => {
    // TODO: 나중에 필터 추가: `/properties?minPrice=1000&maxPrice=5000`
    navigate('/properties')
  }
  //#endregion

  //#region `useEffect`
  useEffect(() => {
    if (error) console.error('Error loading CSV file:', error)
  }, [error])

  useEffect(() => {
    if (rows.length > 0) {
      const items = rows.map((row) => mapRowToDataItem(row))
      setData(items)
    }
  }, [rows])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsRoadviewVisible(false)
        setSelectedMarker(null)
      }
      if (event.key.toLowerCase() === 'r' || event.key === 'ㄱ') {
        setIsRoadviewVisible((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const updateSplit = () => {
      if (window.innerWidth < 768) {
        setVertical(true) // vertical
      }
      if (window.innerWidth >= 768) {
        setVertical(false) // horizontal
      }
    }

    updateSplit()
    window.addEventListener('resize', updateSplit)

    return () => {
      window.removeEventListener('resize', updateSplit)
    }
  }, [])

  useEffect(() => {
    mapRef.current?.setKeyboardShortcuts(true)
  }, [])
  //#endregion

  return (
    <Div100vh
      className={`relative h-screen overflow-hidden ${
        isRoadviewVisible ? 'flex md:flex-row flex-col' : ''
      }`}
      onClick={handleOutsideClick}
    >
      {/* Navigation */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          setCollapsed(!collapsed)
        }}
        className={`top-[10px] left-[10px] !fixed !z-50 p-2 bg-[#f5f5f5] cursor-pointer text-xl font-bold border-b rounded border-[#bfbfbf] hover:bg-[#e6e6e6] flex items-center justify-center transition-all duration-300 ${
          collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <HiMenu size={18} />
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar-container !fixed !z-40 h-full transition-all duration-300 transform ${
          collapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar
          collapsed={false}
          className="h-full bg-white"
          style={{ backgroundColor: 'white' }}
        >
          <div className="gap-2 pt-4 pl-4 text-lg font-semibold text-primary">
            일반
          </div>
          <Menu>
            {/* TODO: hook으로 변경하여 open 상태 여러개 만들지 않도록 */}
            <SubMenu label="매물" onClick={handlePropertyClick} open={true}>
              <div className="p-4 max-h-[600px] overflow-y-auto">
                {data.slice(0, 10).map((item, index) => (
                  <div
                    key={index}
                    className="p-0.5 mb-2 border-b hover:bg-gray-50"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-gray-600">
                        {item.amount}억원 • {item.area}㎡
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.address}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.subway} {item.length}m
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SubMenu>
          </Menu>
        </Sidebar>
      </div>

      <Allotment
        key={vertical ? 'vertical' : 'horizontal'}
        vertical={vertical}
        defaultSizes={sizes}
        onChange={setSizes}
      >
        {/* Map Section */}
        <Allotment.Pane
          preferredSize="100%"
          visible={true}
          className="w-full h-full"
        >
          <MapSection
            mapRef={mapRef}
            center={center}
            setCenter={setCenter}
            sizes={sizes}
            setSizes={setSizes}
            data={data}
            isRoadviewVisible={isRoadviewVisible}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            pan={pan}
          />
          <RoadviewButton
            onClick={handleRoadviewToggle}
            isVisible={isRoadviewVisible}
          />
        </Allotment.Pane>

        {/* Roadview Section */}
        <Allotment.Pane visible={isRoadviewVisible} className="w-full h-full">
          <RoadviewSection
            mapRef={mapRef}
            center={center}
            pan={pan}
            setPan={setPan}
            setCenter={setCenter}
          />
        </Allotment.Pane>
      </Allotment>
    </Div100vh>
  )
}

export default App

//#region
const mapRowToDataItem = (row: string[]): DataItem => {
  return {
    title: row[3],
    latlng: {
      lat: parseFloat(row[0]),
      lng: parseFloat(row[1]),
    },
    amount: Number(row[4]) / 1e4,
    approvalYear: row[5],
    link1: row[20],
    link2: row[22],
    address: row[21],
    area: row[13],
    size: row[10],
    householdCount: Number(row[6]),
    minFloor: Number(row[15]) || row[15],
    maxFloor: Number(row[16]),
    direction: row[17],
    rooms: row[18],
    bathrooms: row[19],
    subwayLine: row[7],
    subway: row[8],
    length: Number(row[9]).toFixed(0),
    additionalInfo: row[11],
    date: row[2],
  }
}
//#endregion
