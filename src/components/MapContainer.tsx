import React from 'react'

interface IMapContainer {
  isVisible: boolean
  children: React.ReactNode
}

export const MapContainer: React.FC<IMapContainer> = ({ isVisible, children }) => {
  return (
    <div
      className={`${isVisible ? 'md:w-[30%] w-full md:h-full h-1/2' : 'w-full h-full'}`}
    >
      {children}
    </div>
  )
}
