import React, { useEffect, useState } from 'react'
import { Map, MapMarker, MapTypeControl, ZoomControl, Roadview, RoadviewMarker, MapInfoWindow, useKakaoLoader } from 'react-kakao-maps-sdk'
import Papa from 'papaparse'
import MarkerContent from './components/MarkerContent'
import { parseDate, checkDateRange, DateRange, groupBy, DataItem, MarkerData, getLatestDateRange } from './utils'

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

  const mapCenter = {
    lat: 37.566535,
    lng: 126.9779692,
  }

  useEffect(() => {
    fetch('/analysis.csv')
      .then((response) => response.text())
      .then((text) => {
        const parsedData = Papa.parse<string[]>(text)
        const items = parsedData.data.slice(1).map((i) => {
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
        setData(items)
      })
      .catch((error) => console.error('Error loading CSV file:', error))
  }, [])

  const parseDate = (str: string) => {
    if (!str) {
      return new Date(0)
    }
    const [year, month, day] = str.split('.')
    return new Date(`20${year}-${month}-${day}`)
  }

  const renderMarkers = () => {
    const groupedData = groupBy(data, (item) => `${item.latlng.lat},${item.latlng.lng}`)
    const markers: React.ReactNode[] = []

    Object.values(groupedData).forEach((group) => {
      const position = group[0].latlng
      const dateRanges = group.map((item) => checkDateRange(parseDate(item.date)))
      const latestDateRange = dateRanges.reduce((prev, curr) => {
        if (curr === DateRange.YESTERDAY) return curr
        if (curr === DateRange.LAST_WEEK && prev !== DateRange.YESTERDAY) return curr
        if (curr === DateRange.TWO_WEEKS_AGO && prev === DateRange.OUT_OF_RANGE) return curr
        return prev
      }, DateRange.OUT_OF_RANGE)

      const markerData: MarkerData = {
        position,
        title: group[0].title,
        content: (
          <>
            {group.map((item, index) => (
              <React.Fragment key={index}>
                {item.content}
                {index < group.length - 1 && <hr />}
              </React.Fragment>
            ))}
          </>
        ),
        dateRange: latestDateRange,
      }

      markers.push(
        <MapMarker
          key={`${position.lat}-${position.lng}`}
          position={position}
          title={markerData.title}
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
    })

    return markers
  }

  const handleMapClick = (_: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (selectedMarker) {
      setSelectedMarker(null)
    }

    if (isRoadviewVisible) {
      const position = mouseEvent.latLng
      setRoadviewPosition(position)
    }
  }

  const toggleRoadview = () => {
    setIsRoadviewVisible(!isRoadviewVisible)
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Map // 지도를 표시할 Container
        center={mapCenter}
        style={{ width: '100%', height: '100%' }}
        level={8}
        onCreate={setMap}
        onClick={handleMapClick}
      >
        <MapTypeControl position="TOPRIGHT" />
        <ZoomControl position="RIGHT" />
        {renderMarkers()}
        {selectedMarker && (
          <MapInfoWindow
            position={selectedMarker.position}
            removable={true}
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
        </div>
      )}
    </div>
  )
}

export default App
