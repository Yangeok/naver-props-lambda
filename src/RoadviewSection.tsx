import React from 'react'
import { Roadview, RoadviewMarker } from 'react-kakao-maps-sdk'

import { Center } from './utils'

interface RoadviewSectionProps {
  center: Center
  isRoadviewVisible: boolean
  pan: number
  setPan: React.Dispatch<React.SetStateAction<number>>
  setCenter: React.Dispatch<React.SetStateAction<Center>>
  handleRoadviewToggle: () => void
}

export const RoadviewSection: React.FC<RoadviewSectionProps> = ({
  center,
  isRoadviewVisible,
  pan,
  setPan,
  setCenter,
  handleRoadviewToggle,
}) => {
  if (!mapRef.current) {
    return
  }

  return (
    <div
      className={`${isRoadviewVisible ? 'block' : 'hidden'
        } md:w-[70%] w-full md:h-full h-1/2 relative`}
    >
      <Roadview
        position={{ ...center, radius: 50 }}
        className="w-full h-full"
        pan={pan}
        onViewpointChange={(roadview) =>
          setPan(roadview.getViewpoint().pan)
        }
        onPositionChanged={(roadview) =>
          setCenter({
            lat: roadview.getPosition().getLat(),
            lng: roadview.getPosition().getLng(),
          })
        }
      >
        <RoadviewMarker
          position={{ ...center }}
        />
      </Roadview>
      <button
        onClick={handleRoadviewToggle}
        className="absolute px-2 py-1 bg-white border border-gray-300 rounded cursor-pointer top-2 left-2"
      >
        닫기
      </button>
    </div>
  )
}
