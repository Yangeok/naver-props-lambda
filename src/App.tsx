import React, { useEffect, useState, useRef } from 'react'
import {
  Map,
  MapMarker,
  MapTypeControl,
  ZoomControl,
  Roadview,
  RoadviewMarker,
  MapInfoWindow,
  useKakaoLoader
} from 'react-kakao-maps-sdk'
import MarkerContent from './components/MarkerContent'
import { useFetchCsv } from './hooks/useFetchCSV'
import { parseDate, checkDateRange, DateRange, groupBy, DataItem, MarkerData, getLatestDate } from './utils'

const {
  VITE_KAKAO_APP_KEY,
} = import.meta.env

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

  const mapCenter = {
    lat: 37.566535,
    lng: 126.9779692,
  }

  useEffect(() => {
    if (error) console.error('Error loading CSV file:', error)
  }, [error])

  useEffect(() => {
    if (rows.length > 0) {
      const items = rows.map((i) => {
        const dateByDupedItem = i[22] ? JSON.parse(String(i[22]).replace(/'/g, '"')).sort((a: string, b: string) => parseDate(a).getTime() - parseDate(b).getTime()) : []
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
      console.log({ items })
      setData(items)
    }
  }, [rows])

  useEffect(() => {
    // 키보드 이벤트 리스너 추가
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
      // 이벤트 리스너 정리
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
                {index < group.length - 1 && <hr />}
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
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Map
        center={mapCenter}
        style={{ width: '100%', height: '100%' }}
        level={8}
        onCreate={(mapInstance) => {
          setMap(mapInstance)
          mapRef.current = mapInstance
        }}
        onClick={handleMapClick}
      >
        <MapTypeControl position="TOPRIGHT" />
        <ZoomControl position="RIGHT" />
        {renderMarkers()}
        {selectedMarker && (
          <MapInfoWindow
            position={selectedMarker.position}
            removable={true}
            onCloseClick={() => setSelectedMarker(null)} // FIXME:
          >
            {selectedMarker.content}
          </MapInfoWindow>
        )}
      </Map>
      <div
        onClick={toggleRoadview}
        style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          width: '42px',
          height: '42px',
          zIndex: 1,
          cursor: 'pointer',
          background: 'url(https://t1.daumcdn.net/localimg/localimages/07/2018/pc/common/img_search.png) 0 -450px',
        }}
      />
      {isRoadviewVisible && roadviewPosition && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '70%',
            height: '100%',
            zIndex: 2,
            boxShadow: '-2px 0 5px rgba(0,0,0,0.3)',
          }}
        >
          <Roadview
            position={{
              lat: roadviewPosition.getLat(),
              lng: roadviewPosition.getLng(),
              radius: 50,
            }}
            style={{ width: '100%', height: '100%' }}
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
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              padding: '5px 10px',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  )
}

export default App
