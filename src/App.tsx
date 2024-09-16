import React, { useEffect, useState, useRef } from 'react'
import {
  Map,
  MapTypeId,
  MapMarker,
  MapTypeControl,
  ZoomControl,
  Roadview,
  RoadviewMarker,
  MapInfoWindow,
  useKakaoLoader
} from 'react-kakao-maps-sdk'
import { useFetchCsv } from './hooks/useFetchCSV'
import { parseDate, checkDateRange, DateRange, groupBy, DataItem, MarkerData, getLatestDate } from './utils'
import './index.css'
import { MarkerContent } from './components/MarkerContent'
import { mapCenter } from './constants'

const { VITE_KAKAO_APP_KEY } = import.meta.env

const App: React.FC = () => {
  useKakaoLoader({
    appkey: String(VITE_KAKAO_APP_KEY),
    libraries: ['services'],
  })

  const [data, setData] = useState<DataItem[]>([])
  const [_, setMap] = useState<kakao.maps.Map>()
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const [isRoadviewVisible, setIsRoadviewVisible] = useState(false)
  const [roadviewPosition, setRoadviewPosition] = useState<kakao.maps.LatLng>()
  const { rows, error } = useFetchCsv('/analysis.csv')

  const mapRef = useRef<kakao.maps.Map>()

  useEffect(() => {
    if (error) console.error('Error loading CSV file:', error)
  }, [error])

  useEffect(() => {
    if (rows.length > 0) {
      const items = rows.map((i) => {
        const dateByDupedItem = i[22]
          ? JSON.parse(String(i[22]).replace(/'/g, '"')).sort(
            (a: string, b: string) => parseDate(a).getTime() - parseDate(b).getTime()
          )
          : []
        return {
          title: i[3],
          latlng: {
            lat: parseFloat(i[0]),
            lng: parseFloat(i[1]),
          },
          content: (
            <MarkerContent
              title={i[3]}
              amount={Number(i[4]) / 10 ** 4}
              approvalYear={i[5]}
              link1={i[20]}
              link2={i[21]}
              area={i[13]}
              size={i[10]}
              floorInfo={i[15]}
              roomInfo={i[16]}
              subwayLine={i[7]}
              subway={i[8]}
              length={Number(i[9]).toFixed(0)}
              additionalInfo={i[11]}
              date={i[2]}
              firstDate={dateByDupedItem[0]}
            />
          ),
          summary: `<div>${i[3]} ${Number(i[4]) / 10 ** 4}억</div>`,
          date: i[2],
        }
      })
      setData(items)
    }
  }, [rows])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsRoadviewVisible(false)
        setSelectedMarker(null)
      }
      if (event.key === 'R' || event.key === 'r') {
        setIsRoadviewVisible((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const renderMarkers = () => {
    const groupedData = Object.values(groupBy(data, (item) => `${item.latlng.lat},${item.latlng.lng}`))

    const markers: React.ReactNode[] = []

    groupedData.forEach((group) => {
      const position = group[0].latlng
      const dates = group.map((item) => parseDate(item.date))
      const latestDate = getLatestDate(dates)
      const dateRange = checkDateRange(latestDate)

      const isGroup = group.length > 1

      const markerData: MarkerData = {
        position,
        title: group[0].title,
        content: isGroup ? (
          <>
            {group.map((item, index) => (
              <React.Fragment key={index}>
                {item.content}
                {index < group.length - 1 && <hr className="my-2" />}
              </React.Fragment>
            ))}
          </>
        ) : (
          group[0].content
        ),
        dateRange,
      }

      const markerKey = `${isGroup ? 'group' : 'single'}-${position.lat}-${position.lng}`

      markers.push(
        <MapMarker
          key={markerKey}
          position={position}
          title={markerData.title}
          clickable={true}
          image={{
            src: (() => {
              switch (markerData.dateRange) {
                case DateRange.YESTERDAY:
                  return 'src/assets/markers/blue.png'
                case DateRange.LAST_WEEK:
                  return 'src/assets/markers/green.png'
                case DateRange.TWO_WEEKS_AGO:
                  return 'src/assets/markers/red.png'
                default:
                  return 'src/assets/markers/black.png'
              }
            })(),
            size: {
              width: 24,
              height: 24,
            },
          }}
          onClick={() => setSelectedMarker(markerData)}
        />
      )

      if (
        selectedMarker &&
        selectedMarker.position.lat === position.lat &&
        selectedMarker.position.lng === position.lng
      ) {
        markers.push(
          <MapInfoWindow
            key={`info-${markerKey}`}
            position={position}
            removable={true}
            onCloseClick={() => setSelectedMarker(null)}
          >
            {markerData.content}
          </MapInfoWindow>
        )
      }
    })

    return markers
  }

  const handleMapClick = (_: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (selectedMarker) {
      setSelectedMarker(null)
    }

    if (isRoadviewVisible) {
      setRoadviewPosition(mouseEvent.latLng)
    }
  }

  const toggleRoadview = () => {
    setIsRoadviewVisible(!isRoadviewVisible)
  }

  return (
    <div
      className={`relative h-screen overflow-hidden ${isRoadviewVisible ? 'flex md:flex-row flex-col' : ''
        }`}
    >
      <div
        className={`${isRoadviewVisible ? 'md:w-[30%] w-full md:h-full h-1/2' : 'w-full h-full'
          }`}
      >
        <Map
          center={mapCenter}
          className="w-full h-full"
          level={8}
          onCreate={(mapInstance) => {
            setMap(mapInstance)
            mapRef.current = mapInstance
          }}
          onClick={handleMapClick}
        >
          {isRoadviewVisible && roadviewPosition && <MapTypeId type={'ROADVIEW'} />}
          <MapTypeControl position="TOPRIGHT" />
          <ZoomControl position="RIGHT" />
          {renderMarkers()}
          {selectedMarker && (
            <MapInfoWindow
              position={selectedMarker.position}
              removable={true}
              onCloseClick={() => setSelectedMarker(null)}
            >
              {selectedMarker.content}
            </MapInfoWindow>
          )}
        </Map>
        <div
          onClick={toggleRoadview}
          className={`absolute top-1 left-1 w-10 h-10 z-10 cursor-pointer bg-no-repeat ${isRoadviewVisible
            ? 'bg-[url(https://t1.daumcdn.net/localimg/localimages/07/2018/pc/common/img_search.png)] bg-[0_-350px]'
            : 'bg-[url(https://t1.daumcdn.net/localimg/localimages/07/2018/pc/common/img_search.png)] bg-[0_-450px]'
            }`}
        />
      </div>
      {isRoadviewVisible && roadviewPosition && (
        <div
          className={`${isRoadviewVisible ? 'block' : 'hidden'
            } md:w-[70%] w-full md:h-full h-1/2 relative`}
        >
          <Roadview
            position={{
              lat: roadviewPosition.getLat(),
              lng: roadviewPosition.getLng(),
              radius: 50,
            }}
            className="w-full h-full"
          >
            <RoadviewMarker
              position={{
                lat: roadviewPosition.getLat(),
                lng: roadviewPosition.getLng(),
              }}
            />
          </Roadview>
          <button
            onClick={toggleRoadview}
            className="absolute top-2 left-2 px-2 py-1 bg-white border border-gray-300 rounded cursor-pointer"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  )
}

export default App
