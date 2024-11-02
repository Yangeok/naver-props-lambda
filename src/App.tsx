import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import React, { useEffect, useRef, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { useKakaoLoader } from 'react-kakao-maps-sdk'

import { RoadviewButton } from './components'
import { useFetchCsv } from './hooks'
import './index.css'
import { MapSection } from './MapSection'
import { RoadviewSection } from './RoadviewSection'
import { Center, DataItem, MarkerData } from './utils'

const App: React.FC = () => {
  useKakaoLoader({
    appkey: String(import.meta.env.VITE_KAKAO_APP_KEY),
    libraries: ['services'],
  })

  const [sizes, setSizes] = useState<any[]>(['100%', '0'])
  const [vertical, setVertical] = useState<boolean>(false)
  const mapRef = useRef<kakao.maps.Map>(null)
  const [center, setCenter] = useState<Center>({ lat: 37.566535, lng: 126.9779692 })
  const [pan, setPan] = useState(0)
  const [data, setData] = useState<DataItem[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const [isRoadviewVisible, setIsRoadviewVisible] = useState(false)

  const { rows, error } = useFetchCsv('/analysis.csv')

  const handleRoadviewToggle = () => {
    setIsRoadviewVisible(!isRoadviewVisible)
  }

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
      className={`relative h-screen overflow-hidden ${isRoadviewVisible ? 'flex md:flex-row flex-col' : ''
        }`}
    >
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
        <Allotment.Pane
          visible={isRoadviewVisible}
          className="w-full h-full"
        >
          <RoadviewSection
            mapRef={mapRef}
            center={center}
            pan={pan}
            setPan={setPan}
            setCenter={setCenter}
            handleRoadviewToggle={handleRoadviewToggle}
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