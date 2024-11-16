interface GroupButton {
  id: string
  label: string
}

interface GroupButtonsProps {
  groupBy: string
  setGroupBy: (id: string) => void
}

export const GroupButtons = ({ groupBy, setGroupBy }: GroupButtonsProps) => {
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
