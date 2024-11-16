import React from 'react'

interface ZoomControlProps {
  onZoomIn: () => void
  onZoomOut: () => void
}

export const ZoomControl: React.FC<ZoomControlProps> = ({
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="absolute top-[50px] right-[10px] w-[36px] h-[80px] overflow-hidden z-[1] bg-[#f5f5f5] border border-[#bfbfbf] rounded shadow-md">
      <span
        onClick={onZoomIn}
        className="block w-[36px] h-[40px] text-center cursor-pointer text-xl font-bold leading-[40px] border-b border-[#bfbfbf] hover:bg-[#e6e6e6]"
      >
        +
      </span>
      <span
        onClick={onZoomOut}
        className="block w-[36px] h-[40px] text-center cursor-pointer text-xl font-bold leading-[40px] hover:bg-[#e6e6e6]"
      >
        -
      </span>
    </div>
  )
}
