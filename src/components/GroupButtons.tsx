/**
 * @typedef {Object} GroupButton
 * @property {string} id - 그룹 버튼의 ID
 * @property {string} label - 그룹 버튼의 레이블
 */
interface GroupButton {
  id: string
  label: string
}

/**
 * @typedef {Object} GroupButtonsProps
 * @property {string} groupBy - 현재 선택된 그룹 ID
 * @property {(id: string) => void} setGroupBy - 선택된 그룹을 변경하는 함수
 */
export interface GroupButtonsProps {
  groupBy: string
  setGroupBy: (id: string) => void
}

/**
 * GroupButtons 컴포넌트는 여러 그룹 버튼을 제공하며,
 * 각 버튼을 클릭하여 데이터를 그룹화할 기준을 설정할 수 있습니다.
 *
 * @param {GroupButtonsProps} props - GroupButtons 컴포넌트에 필요한 속성
 * @returns {JSX.Element} 그룹 버튼을 렌더링하는 React 컴포넌트
 */
export const GroupButtons: React.FC<GroupButtonsProps> = ({
  groupBy,
  setGroupBy,
}) => {
  const groupButtons: GroupButton[] = [
    { id: '', label: '전체' },
    { id: 'area', label: '구조' },
    { id: 'district', label: '지역' },
    { id: 'subwayLine', label: '지하철' },
    { id: 'bathrooms', label: '화장실' },
    { id: 'direction', label: '방향' },
  ]

  return (
    <div className="mb-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 px-1 pb-2 snap-x snap-mandatory">
        {groupButtons.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setGroupBy(id)}
            className={`flex-none snap-start px-1.5 py-1 rounded-lg text-xs font-medium transition-colors outline-none border-none ${
              groupBy === id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
