import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { MarkerContent } from './MarkerContent'

describe('MarkerContent', () => {
  const mockData = {
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
    area: 'Seoul',
    size: '85',
    householdCount: 100,
    rooms: '3',
    bathrooms: '2',
    subway: 'Gangnam',
    subwayLine: 'Line 2',
    length: '500',
  }

  test('renders amount correctly with strong emphasis', () => {
    render(<MarkerContent {...mockData} />)
    expect(screen.getByText((content) => content.includes('10억'))).toBeInTheDocument()
  })

  test('renders links correctly', () => {
    render(<MarkerContent {...mockData} />)
    const kakaoLink = screen.getByAltText('Kakao Map Favicon')
    const naverLink = screen.getByAltText('Naver Favicon')

    expect(kakaoLink).toBeInTheDocument()
    expect(naverLink).toBeInTheDocument()
    expect(kakaoLink.closest('a')).toHaveAttribute('href', 'https://map.kakao.com')
    expect(naverLink.closest('a')).toHaveAttribute('href', 'https://map.naver.com')
  })

  test('renders floor, rooms, and bathrooms correctly', () => {
    render(<MarkerContent {...mockData} />)
    expect(screen.getByText((content) => content.includes('1/10층 South'))).toBeInTheDocument()
  })

  test('renders additional information correctly', () => {
    render(<MarkerContent {...mockData} />)
    expect(screen.getByText('Close to park')).toBeInTheDocument()
  })

  test('renders registration date and first date correctly', () => {
    render(<MarkerContent {...mockData} />)
    expect(screen.getByText((content) => content.includes('2024-01-01 등록 (2023-01-01 최초 등록)'))).toBeInTheDocument()
  })

  test('does not render firstDate if it matches date', () => {
    const sameDateData = { ...mockData, date: '2023-01-01', firstDate: '2023-01-01' }
    render(<MarkerContent {...sameDateData} />)
    expect(screen.getByText((content) => content.includes('2023-01-01 등록'))).toBeInTheDocument()
    expect(screen.queryByText((content) => content.includes('(2023-01-01 최초 등록)'))).not.toBeInTheDocument()
  })
})
