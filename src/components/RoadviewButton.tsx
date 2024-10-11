import React from 'react'

interface IRoadviewButton {
  isVisible: boolean
  onClick: () => void
}

export const RoadviewButton: React.FC<IRoadviewButton> = ({ isVisible, onClick }) => {
  const sourceImage = 'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/common/img_search.png'
  const enabled = '0 -350px'
  const disabled = '0 -450px'

  return (
    <div
      role="button"
      onClick={onClick}
      className="absolute z-10 w-10 h-10 bg-no-repeat cursor-pointer top-1 left-1"
      style={{
        backgroundImage: `url('${sourceImage}')`,
        backgroundPosition: isVisible ? enabled : disabled,
      }}
    />
  )
}
