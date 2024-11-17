import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { GroupButtons, GroupButtonsProps } from './GroupButtons'

describe('GroupButtons 컴포넌트', () => {
  it('선택된 그룹 버튼이 강조되고 다른 버튼은 기본 스타일을 가진다', () => {
    // given: 초기 그룹 설정 및 mock 함수 준비
    const mockSetGroupBy = vi.fn()
    const initialProps: GroupButtonsProps = {
      groupBy: 'area',
      setGroupBy: mockSetGroupBy,
    }

    // when: GroupButtons 컴포넌트를 렌더링
    render(<GroupButtons {...initialProps} />)

    // then: 선택된 '구조' 버튼은 강조된 스타일을 가지고 있다
    const selectedButton = screen.getByText('구조')
    expect(selectedButton).toHaveClass('bg-gray-900 text-white')

    // then: 다른 버튼은 기본 스타일을 가진다
    const unselectedButton = screen.getByText('전체')
    expect(unselectedButton).toHaveClass('bg-gray-50 text-gray-600')
  })

  it('버튼 클릭 시 setGroupBy 함수가 호출된다', () => {
    // given: 초기 그룹 설정 및 mock 함수 준비
    const mockSetGroupBy = vi.fn()
    const initialProps: GroupButtonsProps = {
      groupBy: '',
      setGroupBy: mockSetGroupBy,
    }

    // when: GroupButtons 컴포넌트를 렌더링하고 버튼을 클릭
    render(<GroupButtons {...initialProps} />)
    const areaButton = screen.getByText('구조')
    fireEvent.click(areaButton)

    // then: setGroupBy 함수가 'area' 인자로 호출된다
    expect(mockSetGroupBy).toHaveBeenCalledWith('area')
  })
})
