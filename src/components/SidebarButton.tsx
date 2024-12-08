import React from 'react'
import { BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs'

interface SidebarButtonProps {
  /** 버튼 클릭 시 실행될 콜백 함수 */
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

/**
 * SidebarButton 컴포넌트는 사이드바를 토글하는 버튼을 표시합니다.
 *
 * @component
 * @example
 * ```tsx
 * const handleClick = () => {
 *   setCollapsed(prev => !prev)
 * }
 *
 * return <SidebarButton onClick={handleClick} />
 * ```
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Function} props.onClick - 버튼 클릭 시 실행될 콜백 함수
 * @returns {JSX.Element} 사이드바 토글 버튼을 렌더링하는 React 컴포넌트
 */
export const SidebarButton: React.FC<SidebarButtonProps> = ({ onClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>)
    }
  }

  return (
    <div
      role="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="사이드바 토글"
      className="absolute z-10 bg-no-repeat cursor-pointer top-[10px] right-[10px] w-[36px] h-[36px] bg-[#f5f5f5] border border-[#bfbfbf] border-t-[rgb(226,226,226)] rounded flex items-center justify-center shadow-md hover:bg-[#e6e6e6]"
    >
      <BsReverseLayoutSidebarInsetReverse size={18} />
    </div>
  )
}
