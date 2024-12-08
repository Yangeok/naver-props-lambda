import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DepositAnalysis } from './DepositAnalysis'

describe('보증금 분석 컴포넌트', () => {
  it('보증금이 비싼 경우 빨간색 화살표로 분석 결과를 표시해야 함', () => {
    // given: 값이 최저가보다 높은 경우
    const props = {
      amount: 30000,
      depositPriceMin: 20000,
      depositPriceMax: 50000,
    }

    // when: 컴포넌트를 렌더링
    render(<DepositAnalysis {...props} />)

    // then: 빨간색 ▲ 화살표와 적절한 텍스트가 표시됨
    const percentText = screen.getByText(/50.00% ▲/i)
    const rangeText = screen.getByText(/33.33%/i)

    expect(percentText).toBeInTheDocument()
    expect(percentText).toHaveClass('text-red-500')
    expect(rangeText).toBeInTheDocument()
  })

  it('보증금이 저렴한 경우 파란색 화살표로 분석 결과를 표시해야 함', () => {
    // given: 값이 최저가보다 낮은 경우
    const props = {
      amount: 15000,
      depositPriceMin: 20000,
      depositPriceMax: 50000,
    }

    // when: 컴포넌트를 렌더링
    render(<DepositAnalysis {...props} />)

    // then: 파란색 ▼ 화살표와 적절한 텍스트가 표시됨
    const percentText = screen.getByText(/25.00% ▼/i)
    const rangeText = screen.getByText(/0.00%/i)

    expect(percentText).toBeInTheDocument()
    expect(percentText).toHaveClass('text-blue-500')
    expect(rangeText).toBeInTheDocument()
  })

  it('최소/최대 보증금 값이 없는 경우 null을 반환해야 함', () => {
    // given: 잘못된 props가 주어진 경우
    const props = {
      amount: 30000,
      depositPriceMin: 0,
      depositPriceMax: 0,
    }

    // when: 컴포넌트를 렌더링
    const { container } = render(<DepositAnalysis {...props} />)

    // then: 컴포넌트가 렌더링되지 않음
    expect(container.firstChild).toBeNull()
  })
})
