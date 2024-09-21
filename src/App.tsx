import { format } from 'date-fns'
import { map, pipe } from 'ramda'
import React, { useEffect, useState, useRef } from 'react'
import {
  Map,
  MapTypeId,
  MapMarker,
  MapTypeControl,
  ZoomControl,
  Roadview,
  RoadviewMarker,
  useKakaoLoader,
  CustomOverlayMap,
} from 'react-kakao-maps-sdk'
import { useFetchCsv, useDebounce } from './hooks'
import { parseDate, checkDateRange, getMarkerImageSrc, groupBy, DataItem, MarkerData, getLatestDate } from './utils'
import './index.css'
import { MarkerContent, RoadviewButton, RoadviewContainer, MapContainer } from './components'

const { VITE_KAKAO_APP_KEY } = import.meta.env

const App: React.FC = () => {
  useKakaoLoader({
    appkey: String(VITE_KAKAO_APP_KEY),
    libraries: ['services'],
  })

  const [center, setCenter] = useState({ lat: 37.566535, lng: 126.9779692 })
  const [pan, setPan] = useState(0)
  const [data, setData] = useState<DataItem[]>([])
  const [_, setMap] = useState<kakao.maps.Map>()
  const [_selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const selectedMarker = useDebounce(_selectedMarker, 150)
  const [isRoadviewVisible, setIsRoadviewVisible] = useState(false)
  const [roadviewPosition, setRoadviewPosition] = useState<kakao.maps.LatLng>()
  const { rows, error } = useFetchCsv('/analysis.csv')

  const mapRef = useRef<kakao.maps.Map>()

  useEffect(() => {
    if (error) console.error('Error loading CSV file:', error)
  }, [error])

  useEffect(() => {
    if (rows.length > 0) {
      const items = rows.map((i) => ({
        title: i[3],
        latlng: {
          lat: parseFloat(i[0]),
          lng: parseFloat(i[1]),
        },
        amount: Number(i[4]) / 10 ** 4,
        approvalYear: i[5],
        link1: i[20],
        link2: i[21],
        area: i[13],
        size: i[10],
        householdCount: Number(i[6]),
        minFloor: Number(i[15]) || i[15],
        maxFloor: Number(i[16]),
        direction: i[17],
        rooms: i[18],
        bathrooms: i[19],
        subwayLine: i[7],
        subway: i[8],
        length: Number(i[9]).toFixed(0),
        additionalInfo: i[11],
        date: i[2],
      }))
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

    return groupedData.map((group) => {
      const position = group[0].latlng
      const dateRange = pipe(
        map((item: DataItem) => parseDate(item.date)),
        getLatestDate,
        checkDateRange,
      )(group)

      const dateByDupedItem = group
        .map(item => parseDate(item.date))
        .sort((a, b) => a.getTime() - b.getTime())
      const firstDate = format(dateByDupedItem[0], 'yy.MM.dd')
      const isGroup = group.length > 1

      const markerData: MarkerData = {
        position,
        title: group[0].title,
        content: isGroup ? (
          <>
            {group.map((item, index) => {
              const prop = { ...item, firstDate }
              return (
                <React.Fragment key={index}>
                  <MarkerContent {...prop} />
                </React.Fragment>
              )
            })}
          </>
        ) : (
          <MarkerContent {...group[0]} />
        ),
        dateRange,
      }

      const markerKey = `${isGroup ? 'group' : 'single'}-${position.lat}-${position.lng}`

      const marker = (
        <MapMarker
          key={markerKey}
          position={position}
          title={markerData.title}
          clickable={true}
          image={{
            src: getMarkerImageSrc(markerData.dateRange),
            size: { width: 24, height: 24 },
          }}
          onClick={() => setSelectedMarker(markerData)}
        />
      )

      const infoWindow =
        selectedMarker &&
          selectedMarker.position.lat === position.lat &&
          selectedMarker.position.lng === position.lng ? (
          // REMOVE:
          // <MapInfoWindow key={`info-${markerKey}`} position={position} removable={true}>
          //   {markerData.content}
          // </MapInfoWindow>
          <CustomOverlayMap key={`info-${markerKey}`} position={position}>
            {selectedMarker.content}
          </CustomOverlayMap>
        ) : null

      return infoWindow ? [marker, infoWindow] : [marker]
    }).flat()
  }

  const handleMapClick = (_: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (selectedMarker) setSelectedMarker(null)
    if (isRoadviewVisible) setRoadviewPosition(mouseEvent.latLng)
  }

  const handleRoadview = () => {
    setIsRoadviewVisible(!isRoadviewVisible)
  }

  const handleDragEnd = (target: kakao.maps.Marker) => {
    setRoadviewPosition(
      new kakao.maps.LatLng(target.getPosition().getLat(),
        target.getPosition().getLng()),
    )
  }

  const handleCreateMap = (mapInstance: kakao.maps.Map) => {
    setMap(mapInstance)
    mapRef.current = mapInstance
  }

  return (
    <div
      className={`relative h-screen overflow-hidden ${isRoadviewVisible ? 'flex md:flex-row flex-col' : ''
        }`}
    >
      <MapContainer isVisible={isRoadviewVisible} >
        <Map
          center={center}
          className="w-full h-full"
          level={8}
          onCreate={handleCreateMap}
          onClick={handleMapClick}
        >
          {(isRoadviewVisible && roadviewPosition) && (
            <>
              <MapTypeId type={'ROADVIEW'} />
              <MapMarker
                position={{ lat: roadviewPosition.getLat(), lng: roadviewPosition.getLng() }}
                image={{
                  src: 'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
                  size: {
                    width: 26,
                    height: 46,
                  },
                  options: {
                    spriteSize: {
                      width: 1666,
                      height: 168,
                    },
                    spriteOrigin: {
                      x: 705,
                      y: 114,
                    },
                    offset: {
                      x: 13,
                      y: 46,
                    },
                  },
                }}
                draggable={true}
                onDragEnd={handleDragEnd}
              />
            </>
          )}
          <MapTypeControl position="TOPRIGHT" />
          <ZoomControl position="RIGHT" />
          {renderMarkers()}
        </Map>
        <RoadviewButton onClick={handleRoadview} isVisible={isRoadviewVisible} />
      </MapContainer>
      {isRoadviewVisible && roadviewPosition && (
        <RoadviewContainer isVisible={isRoadviewVisible}>
          <Roadview
            position={{ lat: roadviewPosition.getLat(), lng: roadviewPosition.getLng(), radius: 50 }}
            className="w-full h-full"
            pan={pan}
            onViewpointChange={(roadview) => setPan(roadview.getViewpoint().pan)}
            onPositionChanged={(roadview) => setCenter({ lat: roadview.getPosition().getLat(), lng: roadview.getPosition().getLng() })}
          >
            <RoadviewMarker position={{ lat: roadviewPosition.getLat(), lng: roadviewPosition.getLng() }} />
          </Roadview>
          <button
            onClick={handleRoadview}
            className="absolute py-1 bg-white border border-gray-300 rounded cursor-pointer top-2 left-2px-2"
          >
            닫기
          </button>
        </RoadviewContainer>
      )}
    </div>
  )
}

export default App
