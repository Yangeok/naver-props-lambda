import { render, screen } from '@testing-library/react'
import { MarkerContent } from './MarkerContent'
import { describe, test, expect } from 'vitest'

describe('MarkerContent', () => {
  const mockData = {
    title: 'Test Title',
    amount: 10,
    approvalYear: '2023',
    link1: 'https://map.kakao.com',
    link2: 'https://map.naver.com',
    area: 'Seoul',
    size: '85',
    householdCount: 100,
    minFloor: 1,
    maxFloor: 10,
    rooms: '3',
    bathrooms: '2',
    subway: 'Gangnam',
    subwayLine: 'Line 2',
    length: '500',
    additionalInfo: 'Close to park',
    date: '2024-01-01',
    direction: 'South',
    firstDate: '2023-01-01',
  }

  test('renders title, amount, and approval year correctly', () => {
    render(<MarkerContent {...mockData} />)

    expect(screen.getByText('Test Title 10억 (2023년 승인)')).toBeInTheDocument()
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

  test('renders area, size, and household count correctly', () => {
    render(<MarkerContent {...mockData} />)

    expect(screen.getByText('Seoul 85m² South 100세대')).toBeInTheDocument()
  })

  test('renders floor, rooms, and bathrooms correctly', () => {
    render(<MarkerContent {...mockData} />)

    expect(screen.getByText('1/10층 방/화장실 3/2개')).toBeInTheDocument()
  })

  test('renders subway information when available', () => {
    render(<MarkerContent {...mockData} />)

    expect(screen.getByText('Line 2 (Gangnam) 500m')).toBeInTheDocument()
  })

  test('renders additional information correctly', () => {
    render(<MarkerContent {...mockData} />)

    expect(screen.getByText('Close to park')).toBeInTheDocument()
  })

  test('renders registration date and first date correctly', () => {
    render(<MarkerContent {...mockData} />)

    expect(screen.getByText('2024-01-01 등록 (2023-01-01 최초 등록)')).toBeInTheDocument()
  })

  test('does not render firstDate if it matches date', () => {
    const sameDateData = { ...mockData, date: '2023-01-01', firstDate: '2023-01-01' }
    render(<MarkerContent {...sameDateData} />)

    expect(screen.getByText('2023-01-01 등록')).toBeInTheDocument()
    expect(screen.queryByText('(2023-01-01 최초 등록)')).not.toBeInTheDocument()
  })
})
