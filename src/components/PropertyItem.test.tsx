import { DataItem } from '../utils'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PropertyItem, PropertyItemProps } from './PropertyItem'

describe('PropertyItem 컴포넌트', () => {
  it('주어진 데이터 항목이 화면에 올바르게 렌더링된다', () => {
    // given: 데이터 항목과 mock onClick 함수 설정
    const item: DataItem = {
      id: '테스트 매물 1',
      title: '테스트 아파트',
      amount: 10,
      size: '85',
      address: '서울시 강남구',
      subway: '강남역',
      length: '500',
      latlng: { lat: 37.5665, lng: 126.978 },
      approvalYear: '',
      link1: '',
      link2: '',
      area: '',
      householdCount: 0,
      minFloor: '',
      maxFloor: 0,
      direction: '',
      rooms: '',
      bathrooms: '',
      subwayLine: '',
      additionalInfo: '',
      date: '',
    }
    const mockOnClick = vi.fn()
    const props: PropertyItemProps = { item, onClick: mockOnClick }

    // when: PropertyItem 컴포넌트를 렌더링
    render(<PropertyItem {...props} />)

    // then: 각 데이터 속성이 화면에 올바르게 표시됨을 확인
    expect(screen.getByText('테스트 아파트')).toBeInTheDocument()
    expect(screen.getByText('10억원 • 85㎡')).toBeInTheDocument()
    expect(screen.getByText('서울시 강남구')).toBeInTheDocument()
    expect(screen.getByText('강남역 500m')).toBeInTheDocument()
  })

  it('항목을 클릭하면 onClick 함수가 호출된다', () => {
    // given: 데이터 항목과 mock onClick 함수 설정
    const item: DataItem = {
      id: '테스트 매물 1',
      title: '테스트 아파트',
      amount: 10,
      size: '85',
      address: '서울시 강남구',
      subway: '강남역',
      length: '500',
      latlng: { lat: 37.5665, lng: 126.978 },
      approvalYear: '2021',
      link1: 'https://example.com/link1',
      link2: 'https://example.com/link2',
      area: '',
      householdCount: 0,
      minFloor: '',
      maxFloor: 0,
      direction: '',
      rooms: '',
      bathrooms: '',
      subwayLine: '',
      additionalInfo: '',
      date: '',
    }
    const mockOnClick = vi.fn()
    const props: PropertyItemProps = { item, onClick: mockOnClick }

    // when: PropertyItem 컴포넌트를 렌더링하고 항목을 클릭
    render(<PropertyItem {...props} />)
    const itemElement = screen.getByText('테스트 아파트')
    fireEvent.click(itemElement)

    // then: onClick 함수가 클릭된 항목 데이터와 함께 호출됨을 확인
    expect(mockOnClick).toHaveBeenCalledWith(item)
  })
})
