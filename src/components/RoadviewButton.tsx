import React from 'react'

interface IRoadviewButton {
  isVisible: boolean
  onClick: () => void
}

export const RoadviewButton: React.FC<IRoadviewButton> = ({ isVisible, onClick }) => {
  const sourceImage = 'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/common/img_search.png'
  const enabled = 'bg-[0_-350px]'
  const disabled = 'bg-[0_-450px]'

  return (
    <div
      onClick={onClick}
      className={`absolute top-1 left-1 w-10 h-10 z-10 cursor-pointer bg-no-repeat bg-[url('${sourceImage}')] ${isVisible ? enabled : disabled}`}
    />
  )
}
