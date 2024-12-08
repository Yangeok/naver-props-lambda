import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { SidebarButton } from './SidebarButton'

describe('SidebarButton', () => {
  it('클릭 이벤트가 발생하면 onClick 핸들러가 호출되어야 한다', () => {
    // given
    const mockOnClick = vi.fn()
    render(<SidebarButton onClick={mockOnClick} />)
    const button = screen.getByRole('button', { name: '사이드바 토글' })

    // when
    fireEvent.click(button)

    // then
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('키보드로 접근 가능해야 한다', () => {
    // given
    const mockOnClick = vi.fn()
    render(
      <MemoryRouter>
        <SidebarButton onClick={mockOnClick} />
      </MemoryRouter>
    )
    const button = screen.getByRole('button', { name: '사이드바 토글' })

    // when
    fireEvent.keyDown(button, { key: 'Enter' })

    // then
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('올바른 스타일과 아이콘이 렌더링되어야 한다', () => {
    // given
    render(<SidebarButton onClick={() => {}} />)

    // when
    const button = screen.getByRole('button', { name: '사이드바 토글' })

    // then
    expect(button).toHaveClass('absolute', 'z-10', 'cursor-pointer')
    expect(button.querySelector('svg')).toBeInTheDocument()
  })
})
