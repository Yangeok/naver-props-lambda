import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Pagination, PaginationProps } from './Pagination'

describe('Pagination 컴포넌트', () => {
  it('페이지네이션이 지정된 페이지 수대로 렌더링된다', () => {
    // given: 페이지 수와 mock onPageChange 함수 설정
    const pageCount = 5
    const mockOnPageChange = vi.fn()
    const initialProps: PaginationProps = {
      pageCount,
      onPageChange: mockOnPageChange,
    }

    // when: Pagination 컴포넌트를 렌더링
    render(<Pagination {...initialProps} />)

    // then: 페이지네이션이 지정된 수의 페이지를 표시하는지 확인
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(
      pageCount
    )
  })

  it('다음 페이지 버튼 클릭 시 onPageChange가 호출된다', () => {
    // given: 페이지 수와 mock onPageChange 함수 설정
    const pageCount = 5
    const mockOnPageChange = vi.fn()
    render(<Pagination pageCount={pageCount} onPageChange={mockOnPageChange} />)

    // when: 다음 페이지 버튼을 클릭
    const nextButton = screen.getByText('>')
    fireEvent.click(nextButton)

    // then: onPageChange 함수가 호출됨을 확인
    expect(mockOnPageChange).toHaveBeenCalled()
  })

  it('페이지 번호를 클릭하면 해당 페이지로 이동하는 이벤트가 발생한다', () => {
    // given: 페이지 수와 mock onPageChange 함수 설정
    const pageCount = 5
    const mockOnPageChange = vi.fn()
    render(<Pagination pageCount={pageCount} onPageChange={mockOnPageChange} />)

    // when: 페이지 번호를 클릭
    const pageButton = screen.getByText('2')
    fireEvent.click(pageButton)

    // then: onPageChange 함수가 클릭한 페이지 번호와 함께 호출됨을 확인
    expect(mockOnPageChange).toHaveBeenCalledWith({ selected: 1 }) // 페이지 번호는 0부터 시작
  })

  it('이전 페이지 버튼 클릭 시 onPageChange가 호출된다', () => {
    // given: 페이지 수와 mock onPageChange 함수 설정
    const pageCount = 5
    const mockOnPageChange = vi.fn()
    render(<Pagination pageCount={pageCount} onPageChange={mockOnPageChange} />)

    // when: 다음 페이지 버튼을 클릭한 후
    const nextButton = screen.getByText('>')
    fireEvent.click(nextButton)

    // 다시: 이전 페이지 버튼을 클릭
    const prevButton = screen.getByText('<')
    fireEvent.click(prevButton)

    // then: onPageChange 함수가 호출됨을 확인
    expect(mockOnPageChange).toHaveBeenCalled()
  })
})
