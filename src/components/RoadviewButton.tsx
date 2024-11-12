import React from 'react'
import { FaStreetView } from 'react-icons/fa'

interface IRoadviewButton {
  isVisible: boolean
  onClick: () => void
}

export const RoadviewButton: React.FC<IRoadviewButton> = ({
  isVisible,
  onClick,
}) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className="absolute z-10 bg-no-repeat cursor-pointer top-[10px] right-[51px] w-[36px] h-[36px] bg-[#f5f5f5] border border-[#bfbfbf] border-t-[rgb(226,226,226)] rounded flex items-center justify-center shadow-md hover:bg-[#e6e6e6]"
    >
      <FaStreetView
        size={18}
        className={`${isVisible ? 'text-blue-500' : 'text-gray-300'}`}
      />
    </div>
  )
}
