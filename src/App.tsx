import React, { useEffect, useState } from 'react'
import { useKakaoLoader } from 'react-kakao-maps-sdk'

import { useFetchCsv } from './hooks'
import { DataItem, MarkerData } from './utils'
import { RoadviewButton } from './components'
import './index.css'
import { MapSection } from './MapSection'
import { RoadviewSection } from './RoadviewSection'

const App: React.FC = () => {
  useKakaoLoader({
    appkey: String(import.meta.env.VITE_KAKAO_APP_KEY),
    libraries: ['services'],
  })

  const [center, setCenter] = useState({ lat: 37.566535, lng: 126.9779692 })
  const [pan, setPan] = useState(0)
  const [data, setData] = useState<DataItem[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const [isRoadviewVisible, setIsRoadviewVisible] = useState(false)

  const { rows, error } = useFetchCsv('/analysis.csv')

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

  const handleRoadviewToggle = () => {
    setIsRoadviewVisible(!isRoadviewVisible)
  }

  return (
    <div
      className={`relative h-screen overflow-hidden ${isRoadviewVisible ? 'flex md:flex-row flex-col' : ''
        }`}
    >
      {/* Map Section */}
      <div
        className={`${isRoadviewVisible
          ? 'md:w-[30%] w-full md:h-full h-1/2'
          : 'w-full h-full'
          }`}
      >
        <MapSection
          center={center}
          setCenter={setCenter}
          data={data}
          isRoadviewVisible={isRoadviewVisible}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
        />
        <RoadviewButton
          onClick={handleRoadviewToggle}
          isVisible={isRoadviewVisible}
        />
      </div>

      {/* Roadview Section */}
      {isRoadviewVisible && (
        <RoadviewSection
          center={center}
          isRoadviewVisible={isRoadviewVisible}
          pan={pan}
          setPan={setPan}
          setCenter={setCenter}
          handleRoadviewToggle={handleRoadviewToggle}
        />
      )}
    </div>
  )
}

export default App

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
    link2: row[21],
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
