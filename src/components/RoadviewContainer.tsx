import React from 'react'

interface IRoadviewContainer {
  isVisible: boolean
  children: React.ReactNode
}

export const RoadviewContainer: React.FC<IRoadviewContainer> = ({ isVisible, children }) => {
  return (
    <div
      className={`${isVisible ? 'block' : 'hidden'} md:w-[70%] w-full md:h-full h-1/2 relative`}
    >
      {children}
    </div>
  )
}
