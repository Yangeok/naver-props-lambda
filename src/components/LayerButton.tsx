import React from 'react'
import { FaLayerGroup } from 'react-icons/fa'

export const LayerButton: React.FC = () => {
  return (
    <div
      role="button"
      className="absolute z-10 bg-no-repeat cursor-pointer top-[10px] right-[10px] w-[36px] h-[36px] bg-[#f5f5f5] border border-[#bfbfbf] border-t-[rgb(226,226,226)] rounded flex items-center justify-center shadow-md hover:bg-[#e6e6e6]"
    >
      <FaLayerGroup size={18} />
    </div>
  )
}
