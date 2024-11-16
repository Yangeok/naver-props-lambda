import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MapMenu } from './MapMenu';
import { MapTypeIdEnum } from '../utils';
import '@testing-library/jest-dom';

describe('MapMenu Component', () => {
  const mockSetMapTypeIds = vi.fn()

  beforeEach(() => {
    mockSetMapTypeIds.mockClear()
  })

  it('renders the dropdown toggle button', () => {
    render(<MapMenu mapTypeIds={[]} setMapTypeIds={mockSetMapTypeIds} />)
    expect(screen.getByText('드롭다운 토글')).toBeInTheDocument()
  })

  it('opens and closes the dropdown menu', () => {
    render(<MapMenu mapTypeIds={[]} setMapTypeIds={mockSetMapTypeIds} />)
    const toggleButton = screen.getByText('드롭다운 토글')

    fireEvent.click(toggleButton)
    const buttons = screen.getAllByRole('button').filter(button => button !== toggleButton)
    expect(buttons[0]).toHaveTextContent('교통정보')
  })

  it('resets map type selection', () => {
    render(<MapMenu mapTypeIds={[MapTypeIdEnum.TRAFFIC]} setMapTypeIds={mockSetMapTypeIds} />)
    const toggleButton = screen.getByText('드롭다운 토글')
    fireEvent.click(toggleButton)

    const resetButton = screen.getByLabelText('Reset map type selection')
    fireEvent.click(resetButton)
    expect(mockSetMapTypeIds).toHaveBeenCalledWith([])
  })
})