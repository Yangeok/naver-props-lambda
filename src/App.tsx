import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import React, { useEffect, useRef, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { HiMenu } from 'react-icons/hi'
import { useKakaoLoader } from 'react-kakao-maps-sdk'
import { MapSection } from './MapSection'
import { RoadviewSection } from './RoadviewSection'
import { SidebarSection } from './SidebarSection'
import { RoadviewButton } from './components'
import { useFetchCsv } from './hooks'
import './index.css'
import { Center, DataItem, MarkerData } from './utils'

const App: React.FC = () => {
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
        setCollapsed(true)
      }
      if (event.key.toLowerCase() === 'r' || event.key === 'ㄱ') {
        setIsRoadviewVisible((prev) => !prev)
      }
      if (event.key === 'm' || event.key === 'ㅡ') {
        setCollapsed((prev) => !prev)
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

      {/* Sidebar Section */}
      <SidebarSection
        data={data}
        collapsed={collapsed}
        setCenter={setCenter}
        setSelectedMarker={setSelectedMarker}
      />

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
    id: row[22]?.split('/').at(-1) || '',
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
    priceDate: row[24],
    dealPriceMax: Number(row[25]) / 1e8 || undefined,
    dealPriceMin: Number(row[26]) / 1e8 || undefined,
    depositPriceMax: Number(row[27]) / 1e8 || undefined,
    depositPriceMin: Number(row[28]) / 1e8 || undefined,
  }
}
//#endregion
