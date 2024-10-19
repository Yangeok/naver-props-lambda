import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PaneSash } from './PaneSash'

describe('PaneSash Component', () => {
  test('renders with horizontal split', () => {
    const { container } = render(<PaneSash split="horizontal" />)
    expect(container.firstChild).toHaveClass('cursor-row-resize h-2 w-full')
  })

  test('renders with vertical split', () => {
    const { container } = render(<PaneSash split="vertical" />)
    expect(container.firstChild).toHaveClass('cursor-col-resize w-2 h-full')
  })
})
