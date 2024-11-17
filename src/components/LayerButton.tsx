import React from 'react'
import { FaLayerGroup } from 'react-icons/fa'

/**
 * LayerButton 컴포넌트는 레이어 아이콘을 표시하는 버튼입니다.
 * 클릭 가능한 UI 요소로, 특정 레이어 기능을 활성화하거나
 * 토글할 때 사용할 수 있습니다.
 *
 * @component
 * @example
 * // LayerButton 컴포넌트는 다음과 같이 사용됩니다.
 * <LayerButton />
 *
 * @returns {JSX.Element} 레이어 버튼을 렌더링하는 React 컴포넌트
 */
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
