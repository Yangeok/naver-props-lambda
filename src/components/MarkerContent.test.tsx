import { describe, expect, test } from 'vitest'
import { IMarkerContent, MarkerContent } from './MarkerContent'
import { render, screen } from '@testing-library/react'

describe('MarkerContent', () => {
  const mockData: IMarkerContent = {
    title: 'Test Title',
    amount: 10,
    link1: 'https://map.kakao.com',
    link2: 'https://map.naver.com',
    minFloor: 1,
    maxFloor: 10,
    additionalInfo: 'Close to park',
    date: '2024-01-01',
    direction: 'South',
    firstDate: '2023-01-01',
  }

  test('금액이 강조된 형태로 렌더링된다', () => {
    render(<MarkerContent {...mockData} />)
    expect(
      screen.getByText((content) => content.includes('억원'))
    ).toBeInTheDocument()
  })

  test('링크가 올바르게 렌더링된다', () => {
    render(<MarkerContent {...mockData} />)
    const kakaoLink = screen.getByAltText('Kakao Map Favicon')
    const naverLink = screen.getByAltText('Naver Favicon')

    expect(kakaoLink).toBeInTheDocument()
    expect(naverLink).toBeInTheDocument()
    expect(kakaoLink.closest('a')).toHaveAttribute(
      'href',
      'https://map.kakao.com'
    )
    expect(naverLink.closest('a')).toHaveAttribute(
      'href',
      'https://map.naver.com'
    )
  })

  test('층수, 방 수, 방향이 올바르게 렌더링된다', () => {
    render(<MarkerContent {...mockData} />)
    expect(
      screen.getByText((content) => content.includes('1/10층 South'))
    ).toBeInTheDocument()
  })

  test('추가 정보가 올바르게 렌더링된다', () => {
    render(<MarkerContent {...mockData} />)
    expect(screen.getByText('Close to park')).toBeInTheDocument()
  })

  test('등록일과 최초 등록일이 올바르게 렌더링된다', () => {
    render(<MarkerContent {...mockData} />)
    expect(
      screen.getByText((content) =>
        content.includes('2024-01-01 등록 (2023-01-01 최초 등록)')
      )
    ).toBeInTheDocument()
  })

  test('등록일과 최초 등록일이 같을 때 최초 등록일을 렌더링하지 않는다', () => {
    const sameDateData = {
      ...mockData,
      date: '2023-01-01',
      firstDate: '2023-01-01',
    }
    render(<MarkerContent {...sameDateData} />)
    expect(
      screen.getByText((content) => content.includes('2023-01-01 등록'))
    ).toBeInTheDocument()
    expect(
      screen.queryByText((content) =>
        content.includes('(2023-01-01 최초 등록)')
      )
    ).not.toBeInTheDocument()
  })
})
