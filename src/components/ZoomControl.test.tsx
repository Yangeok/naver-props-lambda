import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ZoomControl } from './ZoomControl'

describe('ZoomControl', () => {
  const mockZoomIn = vi.fn()
  const mockZoomOut = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('컴포넌트가 정상적으로 렌더링됩니다', () => {
    render(<ZoomControl onZoomIn={mockZoomIn} onZoomOut={mockZoomOut} />)

    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('+ 버튼 클릭시 onZoomIn이 호출됩니다', () => {
    render(<ZoomControl onZoomIn={mockZoomIn} onZoomOut={mockZoomOut} />)

    fireEvent.click(screen.getByText('+'))
    expect(mockZoomIn).toHaveBeenCalledTimes(1)
  })

  it('- 버튼 클릭시 onZoomOut이 호출됩니다', () => {
    render(<ZoomControl onZoomIn={mockZoomIn} onZoomOut={mockZoomOut} />)

    fireEvent.click(screen.getByText('-'))
    expect(mockZoomOut).toHaveBeenCalledTimes(1)
  })

  it('hover 상태에서 스타일이 적용됩니다', () => {
    render(<ZoomControl onZoomIn={mockZoomIn} onZoomOut={mockZoomOut} />)

    const plusButton = screen.getByText('+')
    const minusButton = screen.getByText('-')

    expect(plusButton).toHaveClass('hover:bg-[#e6e6e6]')
    expect(minusButton).toHaveClass('hover:bg-[#e6e6e6]')
  })
})
