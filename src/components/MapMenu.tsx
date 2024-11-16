import { Controller, useForm } from 'react-hook-form'
import { MapTypeIdEnum } from '../utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 지도 메뉴 설정을 위한 인터페이스입니다.
 * 선택된 지도 유형을 저장하고 업데이트하는 기능을 포함합니다.
 */
interface IMapMenu {
  /** 활성화된 지도 유형들의 배열 */
  mapTypeIds: MapTypeIdEnum[]

  /** 지도 유형 배열을 설정하는 함수 */
  setMapTypeIds: (type: MapTypeIdEnum[]) => void
}

/**
 * @deprecated
 */
export const MapMenu: React.FC<IMapMenu> = ({ mapTypeIds, setMapTypeIds }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      selectedTypes: mapTypeIds,
    },
  })

  const buttons = [
    { type: MapTypeIdEnum.TRAFFIC, label: '교통정보' },
    { type: MapTypeIdEnum.TERRAIN, label: '지형도' },
    { type: MapTypeIdEnum.BICYCLE, label: '자전거' },
    { type: MapTypeIdEnum.USE_DISTRICT, label: '지적편집도' },
  ]

  const onSubmit = (data: { selectedTypes: MapTypeIdEnum[] }) => {
    setMapTypeIds(data.selectedTypes)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={dropdownRef}
      className="absolute z-10 h-10 bg-no-repeat w-50 top-1 left-[50px]"
    >
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="z-50 px-4 py-2 m-1 overflow-hidden text-white bg-blue-500 border-none rounded top-10 left-10 hover:bg-blue-600"
      >
        드롭다운 토글
      </button>
      {isDropdownOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="absolute z-50 top-10"
        >
          <Controller
            name="selectedTypes"
            control={control}
            render={({ field }) => (
              <div className="bg-white p-2.5 rounded-md mt-2 shadow-lg flex w-90">
                {buttons.map(({ type, label }) => (
                  <Button
                    key={type}
                    active={field.value.includes(type)}
                    onClick={() => {
                      const newMapTypeIds = field.value.includes(type)
                        ? field.value.filter((t: MapTypeIdEnum) => t !== type)
                        : field.value.length < 2
                          ? [...field.value, type]
                          : field.value
                      field.onChange(newMapTypeIds)
                    }}
                  >
                    {label}
                  </Button>
                ))}
                <button
                  type="button"
                  className="flex items-center p-2 m-1 text-gray-500 border-none rounded hover:text-gray-700"
                  onClick={() => {
                    setMapTypeIds([])
                    field.onChange()
                  }}
                  aria-label="Reset map type selection"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          />
        </form>
      )}
    </div>
  )
}

const Button = ({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    className={`px-4 py-2 m-1 w-20 rounded border-none ${active ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'} hover:${active ? 'bg-blue-800' : 'bg-blue-600'}`}
    onClick={onClick}
  >
    {children}
  </button>
)
