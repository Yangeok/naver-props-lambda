import React, { useMemo, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { map, pipe } from 'ramda'
import {
  Map,
  MapTypeId,
  MapMarker,
  MapTypeControl,
  ZoomControl,
  CustomOverlayMap,
} from 'react-kakao-maps-sdk'

import {
  parseDate,
  checkDateRange,
  getMarkerImageSrc,
  groupBy,
  DataItem,
  MarkerData,
  getLatestDate,
} from './utils'
import { MarkerContent } from './components'
import './index.css'

interface MapSectionProps {
  center: { lat: number; lng: number }
  data: DataItem[]
  isRoadviewVisible: boolean
  selectedMarker: MarkerData | null
  setCenter: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerData | null>>
}

export const MapSection: React.FC<MapSectionProps> = ({
  center,
  data,
  isRoadviewVisible,
  selectedMarker,
  setCenter,
  setSelectedMarker,
}) => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null)

  const handleCreateMap = (mapInstance: kakao.maps.Map) => {
    setMap(mapInstance)
  }

  const handleMapClick = (
    _map: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent,
  ) => {
    if (selectedMarker) setSelectedMarker(null)
    if (isRoadviewVisible) setCenter({ lat: mouseEvent.latLng.getLat(), lng: mouseEvent.latLng.getLng() })
  }

  const handleDragEnd = (target: kakao.maps.Marker) => {
    setCenter({
        lat: target.getPosition().getLat(),
        lng: target.getPosition().getLng(),
    })
  }

  useEffect(() => {
    if (!map) return
    
    if (isRoadviewVisible) {
      map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW)
      setCenter({
        lat: map.getCenter().getLat(),
        lng: map.getCenter().getLng(),
      })
    } else {
      map.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW)
    }
  }, [isRoadviewVisible])

  const markers = useMemo(() => generateMarkers(data, selectedMarker, setSelectedMarker), [data, selectedMarker])

  return (
    <Map
      center={center}
      className="w-full h-full"
      level={8}
      onCreate={handleCreateMap}
      onClick={handleMapClick}
    >
      {/* Roadview Marker */}
      {isRoadviewVisible && (
        <>
          <MapTypeId type='ROADVIEW' />
          <MapMarker
            position={{
              lat: center.lat,
              lng: center.lng,
            }}
            image={{
              src:
                'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
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
      {/* Map Controls */}
      <MapTypeControl position="TOPRIGHT" />
      <ZoomControl position="RIGHT" />
      {/* Render Markers */}
      {markers}
    </Map>
  )
}

const generateMarkers = (
  data: DataItem[],
  selectedMarker: MarkerData | null,
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerData | null>>,
) => {
  const groupedData = Object.values(groupBy(data, (item) => `${item.latlng.lat},${item.latlng.lng}`),)

  return groupedData
    .map((group) => {
      const markerData = createMarkerData(group)
      const markerKey = getMarkerKey(group)

      const marker = createMapMarker(markerData, markerKey, setSelectedMarker)

      const infoWindow = createInfoWindow(
        markerData,
        selectedMarker,
        markerKey,
      )

      return infoWindow ? [marker, infoWindow] : [marker]
    })
    .flat()
}

const createMarkerData = (group: DataItem[]): MarkerData => {
  const position = group[0].latlng
  const isGroup = group.length > 1

  const dateRange = calculateDateRange(group)
  const firstDate = formatFirstDate(group)

  const content = isGroup
    ? (
      <>
        {group.map((item, index) => (
          <React.Fragment key={index}>
            <MarkerContent {...{ ...item, firstDate }} />
          </React.Fragment>
        ))}
      </>
    )
    : (
      <MarkerContent {...group[0]} />
    )

  return {
    position,
    title: group[0].title,
    content,
    dateRange,
  }
}

const calculateDateRange = (group: DataItem[]) => {
  return pipe(
    map((item: DataItem) => parseDate(item.date)),
    getLatestDate,
    checkDateRange,
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
) => {
  return (
    <MapMarker
      key={markerKey}
      position={markerData.position}
      title={markerData.title}
      clickable={true}
      image={{
        src: getMarkerImageSrc(markerData.dateRange),
        size: { width: 24, height: 24 },
      }}
      onClick={() => setSelectedMarker(markerData)}
    />
  )
}

const createInfoWindow = (
  markerData: MarkerData,
  selectedMarker: MarkerData | null,
  markerKey: string,
) => {
  const isSelected =
    selectedMarker &&
    selectedMarker.position.lat === markerData.position.lat &&
    selectedMarker.position.lng === markerData.position.lng

  return isSelected ? (
    <CustomOverlayMap key={`info-${markerKey}`} position={markerData.position} clickable={true}>
      {selectedMarker?.content}
    </CustomOverlayMap>
  ) : null
}