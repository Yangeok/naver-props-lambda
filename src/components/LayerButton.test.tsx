import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { LayerButton } from './LayerButton'

describe('LayerButton 컴포넌트', () => {
  it('레이어 아이콘이 버튼으로 렌더링된다', () => {
    // given: LayerButton 컴포넌트가 렌더링됨
    render(<LayerButton />)

    // when: 아이콘이 버튼 역할을 하고 있는지 확인
    const button = screen.getByRole('button')

    // then: 버튼이 존재하고, FaLayerGroup 아이콘이 포함되어 있다
    expect(button).toBeInTheDocument()
    expect(button.querySelector('svg')).not.toBeNull() // FaLayerGroup 아이콘이 SVG로 렌더링됨
  })

  it('버튼에 hover 효과가 적용된다', () => {
    // given: LayerButton 컴포넌트가 렌더링됨
    render(<LayerButton />)
    const button = screen.getByRole('button')

    // when: hover 이벤트가 발생함
    fireEvent.mouseOver(button)

    // then: hover 스타일이 적용됨을 확인
    expect(button).toHaveClass('hover:bg-[#e6e6e6]')
  })

  it('버튼이 클릭 가능한 상태이다', () => {
    // given: LayerButton 컴포넌트가 렌더링됨
    render(<LayerButton />)
    const button = screen.getByRole('button')

    // when: 버튼을 클릭
    fireEvent.click(button)

    // then: 버튼이 클릭 가능한 상태임을 확인
    // (여기서는 실제 동작은 없지만, 클릭 이벤트에 반응 가능함을 확인)
    expect(button).toBeEnabled()
  })
})
