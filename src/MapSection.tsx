import React, { useEffect, useMemo, useState } from 'react'
import {
  Center,
  DataItem,
  getLatestDate,
  getMarkerImageSrc,
  groupBy,
  MarkerData,
  parseDate,
} from './utils'
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  MapTypeId,
} from 'react-kakao-maps-sdk'
import { format } from 'date-fns'
import {
  LayerButton,
  MarkerContent,
  MarkerHeader,
  ZoomControl,
} from './components'
import { map, pipe } from 'ramda'
import { useSearchParams } from 'react-router-dom'
import './index.css'
import './MapWalker.css'

interface MapSectionProps {
  mapRef: React.RefObject<kakao.maps.Map>
  center: Center
  data: DataItem[]
  isRoadviewVisible: boolean
  selectedMarker: MarkerData | null
  pan: number
  sizes: any[]
  setSizes: React.Dispatch<React.SetStateAction<any[]>>
  setCenter: React.Dispatch<React.SetStateAction<Center>>
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerData | null>>
}

export const MapSection: React.FC<MapSectionProps> = ({
  mapRef,
  center,
  data,
  isRoadviewVisible,
  selectedMarker,
  pan,
  sizes,
  setSizes,
  setCenter,
  setSelectedMarker,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(8)
  const [searchParams, setSearchParams] = useSearchParams()

  const handleMapClick = (
    _map: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent
  ) => {
    if (selectedMarker) setSelectedMarker(null)
    if (isRoadviewVisible)
      setCenter({
        lat: mouseEvent.latLng.getLat(),
        lng: mouseEvent.latLng.getLng(),
      })
  }

  const handleMapDragEnd = (_map: kakao.maps.Map) => {
    if (isRoadviewVisible)
      setCenter({
        lat: _map.getCenter().getLat(),
        lng: _map.getCenter().getLng(),
      })
  }

  const getAngleClassName = (angle: number) => {
    const threshold = 22.5

    const index = Array.from({ length: 16 })
      .map((_, i) => i)
      .filter((i) => angle > threshold * i && angle < threshold * (i + 1))[0]

    return index !== undefined ? 'm' + index : ''
  }

  const zoomIn = () => {
    const map = mapRef.current
    if (!map) return
    setZoomLevel(map.getLevel() - 1)
  }

  const zoomOut = () => {
    const map = mapRef.current
    if (!map) return
    setZoomLevel(map.getLevel() + 1)
  }

  const markers = useMemo(
    () =>
      generateMarkers(data, selectedMarker, setSelectedMarker, setSearchParams),
    [data, selectedMarker]
  )

  useEffect(() => {
    if (!mapRef.current) return

    if (isRoadviewVisible) {
      mapRef.current.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW)
      setCenter({
        lat: mapRef.current.getCenter().getLat(),
        lng: mapRef.current.getCenter().getLng(),
      })
      setZoomLevel(3)
      setSizes(['50%', 'auto'])
    } else {
      mapRef.current.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW)
      setSizes(['100%', '0'])
    }

    mapRef.current.relayout()
  }, [mapRef, isRoadviewVisible])

  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.relayout()
  }, [sizes])

  useEffect(() => {
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const id = searchParams.get('id')

    if (lat && lng && id) {
      const selectedItem = data.find((item) => item.id.toString() === id)
      if (selectedItem) {
        setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) })
        setSelectedMarker({
          position: { lat: parseFloat(lat), lng: parseFloat(lng) },
          title: selectedItem.title,
          content: (
            <>
              <MarkerHeader {...selectedItem} />
              <MarkerContent
                {...selectedItem}
                firstDate={format(parseDate(selectedItem.date), 'yy.MM.dd.')}
              />
            </>
          ),
          latestDate: parseDate(selectedItem.date),
        })
      }
    }
  }, [searchParams, data])

  return (
    <Map
      center={center}
      className="w-full h-full"
      level={zoomLevel}
      ref={mapRef}
      onClick={handleMapClick}
      onDragEnd={handleMapDragEnd}
      onZoomChanged={(map) => {
        setZoomLevel(map.getLevel())
      }}
    >
      {/* Layer Button */}
      <LayerButton />

      {/* Roadview Button */}
      {isRoadviewVisible && (
        <>
          <MapTypeId type="ROADVIEW" />
          <CustomOverlayMap position={center} yAnchor={1}>
            <div className={`MapWalker ${getAngleClassName(pan)}`}>
              <div className={`angleBack`}></div>
              <div className={'figure'}></div>
            </div>
          </CustomOverlayMap>
        </>
      )}

      {/* Zoom Button */}
      <ZoomControl onZoomIn={zoomIn} onZoomOut={zoomOut} />

      {/* Render Markers */}
      {markers}
    </Map>
  )
}

//#region
const generateMarkers = (
  data: DataItem[],
  selectedMarker: MarkerData | null,
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerData | null>>,
  setSearchParams: ReturnType<typeof useSearchParams>[1]
) => {
  const groupedData = Object.values(
    groupBy(data, (item) => `${item.latlng.lat},${item.latlng.lng}`)
  )

  return groupedData
    .map((group) =>
      group.sort(
        (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
      )
    )
    .map((group) => {
      const markerData = createMarkerData(group)
      const markerKey = getMarkerKey(group)

      const marker = createMapMarker(
        markerData,
        markerKey,
        setSelectedMarker,
        setSearchParams
      )

      const infoWindow = createInfoWindow(markerData, selectedMarker, markerKey)

      return infoWindow ? [marker, infoWindow] : [marker]
    })
    .flat()
}

const createMarkerData = (group: DataItem[]): MarkerData => {
  const position = group[0].latlng
  const isGroup = group.length > 1

  const latestDate = calculateLatestDate(group)
  const firstDate = formatFirstDate(group)

  const content = isGroup ? (
    <>
      <MarkerHeader {...group[0]} groupSize={group.length} />
      {group.map((item, index) => (
        <React.Fragment key={index}>
          <MarkerContent {...{ ...item, firstDate }} />
        </React.Fragment>
      ))}
    </>
  ) : (
    <>
      <MarkerHeader {...group[0]} />
      <MarkerContent {...group[0]} />
    </>
  )

  return {
    position,
    title: group[0].title,
    content,
    latestDate,
  }
}

const calculateLatestDate = (group: DataItem[]) => {
  return pipe(
    map((item: DataItem) => parseDate(item.date)),
    getLatestDate
  )(group)
}

const formatFirstDate = (group: DataItem[]) => {
  const dates = group
    .map((item) => parseDate(item.date))
    .sort((a, b) => a.getTime() - b.getTime())

  return format(dates[0], 'yy.MM.dd.')
}

const getMarkerKey = (group: DataItem[]) => {
  const position = group[0].latlng
  const isGroup = group.length > 1

  return `${isGroup ? 'group' : 'single'}-${position.lat}-${position.lng}`
}

const createMapMarker = (
  markerData: MarkerData,
  markerKey: string,
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerData | null>>,
  setSearchParams: ReturnType<typeof useSearchParams>[1]
) => {
  return (
    <MapMarker
      key={markerKey}
      position={markerData.position}
      title={markerData.title}
      clickable={true}
      image={{
        src: getMarkerImageSrc(markerData.latestDate),
        size: { width: 24, height: 24 },
      }}
      onClick={() => {
        setSelectedMarker(markerData)
        setSearchParams({
          lat: markerData.position.lat.toString(),
          lng: markerData.position.lng.toString(),
        })
      }}
    />
  )
}

const createInfoWindow = (
  markerData: MarkerData,
  selectedMarker: MarkerData | null,
  markerKey: string
) => {
  const isSelected =
    selectedMarker &&
    selectedMarker.position.lat === markerData.position.lat &&
    selectedMarker.position.lng === markerData.position.lng

  return isSelected ? (
    <CustomOverlayMap
      key={`info-${markerKey}`}
      position={markerData.position}
      clickable={true}
      zIndex={99}
    >
      {selectedMarker?.content}
    </CustomOverlayMap>
  ) : null
}
//#endregion
