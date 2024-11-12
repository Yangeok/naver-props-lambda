import { describe, expect, test } from 'vitest'
import { MarkerHeader } from './MarkerHeader'
import { render, screen } from '@testing-library/react'

describe('MarkerHeader', () => {
  const mockData = {
    title: 'Test Apartment',
    approvalYear: '2023',
    address: 'Seoul, Korea',
    area: 'Seoul',
    size: '85',
    householdCount: 100,
    rooms: '3',
    bathrooms: '2',
    subway: 'Gangnam',
    subwayLine: 'Line 2',
    length: '500',
    groupSize: 5,
  }

  test('renders title, approval year, and group size correctly', () => {
    render(<MarkerHeader {...mockData} />)
    expect(screen.getByText('Test Apartment (2023년 승인)')).toBeInTheDocument()
    expect(screen.getByText('+5')).toBeInTheDocument()
  })

  test('renders address correctly', () => {
    render(<MarkerHeader {...mockData} />)
    expect(screen.getByText('Seoul, Korea')).toBeInTheDocument()
  })

  test('renders area, size, and household count correctly', () => {
    render(<MarkerHeader {...mockData} />)
    expect(screen.getByText('Seoul 85m² 100세대')).toBeInTheDocument()
  })

  test('renders room and bathroom count correctly', () => {
    render(<MarkerHeader {...mockData} />)
    expect(
      screen.getByText('방/화장실 3/2개 Line 2 (Gangnam) 500m')
    ).toBeInTheDocument()
  })

  test('does not render subway information if subway is unavailable', () => {
    const noSubwayData = { ...mockData, subway: '', subwayLine: '', length: '' }
    render(<MarkerHeader {...noSubwayData} />)
    expect(screen.queryByText(/Line/)).not.toBeInTheDocument()
  })
})
