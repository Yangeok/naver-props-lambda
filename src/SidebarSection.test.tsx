global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

import { act, cleanup } from '@testing-library/react'
import { DataItem } from './utils'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { SidebarSection, SidebarSectionProps } from './SidebarSection'

describe('SidebarSection 컴포넌트', () => {
  const mockData: DataItem[] = [
    {
      title: '테스트 매물 1',
      amount: 10,
      size: '85',
      address: '서울시 강남구 ㅇㅇ동',
      subway: '강남역',
      length: '500',
      latlng: { lat: 37.5665, lng: 126.978 },
      area: 'A',
      date: '2024-01-01',
      direction: '남향',
      bathrooms: '2',
      subwayLine: '2호선',
      approvalYear: '2020',
      link1: 'https://example.com',
      link2: 'https://example.com',
      rooms: '3',
      householdCount: 100,
      minFloor: 1,
      maxFloor: 10,
      additionalInfo: '추가 정보',
    },
    {
      title: '테스트 매물 2',
      amount: 20,
      size: '100',
      address: '서울시 서초구 ㅇㅇ동',
      subway: '서초역',
      length: '300',
      latlng: { lat: 37.4844, lng: 127.001 },
      area: 'B',
      date: '2023-02-01',
      direction: '북향',
      bathrooms: '1',
      subwayLine: '3호선',
      approvalYear: '',
      link1: '',
      link2: '',
      householdCount: 0,
      minFloor: '',
      maxFloor: 0,
      rooms: '',
      additionalInfo: '',
    },
  ]

  const mockSetCenter = vi.fn()
  const mockSetSelectedMarker = vi.fn()
  const props: SidebarSectionProps = {
    data: mockData,
    collapsed: false,
    handlePropertyClick: vi.fn(),
    setCenter: mockSetCenter,
    setSelectedMarker: mockSetSelectedMarker,
  }

  it('그룹 버튼을 클릭하여 데이터를 그룹화할 수 있다', () => {
    // given: SidebarSection 컴포넌트가 렌더링됨
    render(<SidebarSection {...props} />)

    // when: '구조' 그룹 버튼을 클릭
    const groupButton = screen.getByText('구조')
    fireEvent.click(groupButton)

    // then: '구조' 그룹에 따라 데이터가 그룹화됨을 확인
    expect(
      screen.getByText(
        (content) => content.includes('B') && content.includes('(1)')
      )
    ).toBeInTheDocument()
  })

  it('페이지네이션을 통해 항목을 탐색할 수 있다', () => {
    // given: 15개 이상의 항목이 있는 데이터를 사용하여 컴포넌트를 렌더링
    const largeData = Array.from({ length: 15 }, (_, i) => ({
      ...mockData[0],
      title: `매물 ${i + 1}`,
    }))
    render(<SidebarSection {...props} data={largeData} />)

    // when: 페이지네이션의 다음 페이지 버튼을 클릭
    const nextPageButton = screen.getByText('>')
    act(() => {
      fireEvent.click(nextPageButton)
    })

    // then: 다음 페이지의 항목이 화면에 표시됨을 확인
    expect(screen.getByText('매물 11')).toBeInTheDocument()
  })

  it('collapsed 상태에 따라 Sidebar의 표시 상태가 변경된다', () => {
    // given: collapsed가 false인 경우
    render(<SidebarSection {...props} collapsed={false} />)
    // then: Sidebar가 화면에 표시되는지 확인
    expect(screen.getByTestId('sidebar-container')).toHaveClass('translate-x-0')

    cleanup()

    // when: collapsed가 true인 경우
    render(<SidebarSection {...props} collapsed={true} />)
    // then: Sidebar가 화면에서 숨겨지는지 확인
    expect(screen.getByTestId('sidebar-container')).toHaveClass(
      '-translate-x-full'
    )
  })

  it('groupBy 값이 변경될 때 데이터가 올바르게 그룹화된다', () => {
    // given: SidebarSection이 렌더링됨
    render(<SidebarSection {...props} />)

    // when: 그룹 버튼을 클릭하여 groupBy 값을 변경
    fireEvent.click(screen.getByText('지역'))

    // then: '서울시 강남구'에 해당하는 그룹이 표시되는지 확인
    expect(
      screen.getByText(
        (content) => content.includes('강남구') && content.includes('(1)')
      )
    ).toBeInTheDocument()
  })

  it('groupedData가 비어 있을 때 적절한 메시지를 표시한다', () => {
    // given: 빈 데이터를 props로 전달하여 SidebarSection 렌더링
    render(<SidebarSection {...props} data={[]} />)

    // then: '매물이 없습니다' 메시지가 표시되는지 확인
    expect(screen.getByText(/매물이 없습니다/)).toBeInTheDocument()
  })
})
