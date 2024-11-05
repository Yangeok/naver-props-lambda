import React from 'react'
import { Roadview, RoadviewMarker } from 'react-kakao-maps-sdk'

import { Center } from './utils'

interface RoadviewSectionProps {
  mapRef: React.RefObject<kakao.maps.Map>
  center: Center
  pan: number
  setPan: React.Dispatch<React.SetStateAction<number>>
  setCenter: React.Dispatch<React.SetStateAction<Center>>
}

export const RoadviewSection: React.FC<RoadviewSectionProps> = ({
  mapRef,
  center,
  pan,
  setPan,
  setCenter,
}) => {
  if (!mapRef.current) {
    return
  }

  return (
    <>
      <Roadview
        position={{ ...center, radius: 50 }}
        className="w-full h-full"
        pan={pan}
        onViewpointChange={(roadview) => {
          setPan(roadview.getViewpoint().pan)
        }}
        onPositionChanged={(roadview) => {
          setCenter({
            lat: roadview.getPosition().getLat(),
            lng: roadview.getPosition().getLng(),
          })
        }}
      >
        <RoadviewMarker position={center} />
      </Roadview>
    </>
  )
}
