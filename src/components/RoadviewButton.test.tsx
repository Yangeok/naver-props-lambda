import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { RoadviewButton } from './RoadviewButton'

describe('RoadviewButton', () => {
  test('calls onClick when clicked', () => {
    const mockOnClick = vi.fn()

    render(<RoadviewButton isVisible={true} onClick={mockOnClick} />)

    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  test('renders correctly with visible state', () => {
    const mockOnClick = vi.fn()

    render(<RoadviewButton isVisible={true} onClick={mockOnClick} />)

    const button = screen.getByRole('button')

    expect(button).toHaveStyle({
      backgroundPosition: '0 -350px',
    })
  })

  test('renders correctly with hidden state', () => {
    const mockOnClick = vi.fn()

    render(<RoadviewButton isVisible={false} onClick={mockOnClick} />)

    const button = screen.getByRole('button')

    expect(button).toHaveStyle({
      backgroundPosition: '0 -450px',
    })
  })
})
