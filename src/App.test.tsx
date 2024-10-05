import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'


test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3)
})

// vi.mock('react-kakao-maps-sdk', () => ({
//   useKakaoLoader: vi.fn(),
//   Map: () => <div data-test-id="map-section"></div>,
//   MapTypeControl: () => <div data-test-id="map-type-control-section"></div>,
//   ZoomControl: () => <div data-test-id="zoom-control-section"></div>,
// }))

// vi.mock('./hooks', () => ({
//   useFetchCsv: () => ({
//     rows: [
//       '37.642059', '127.019534', '24.08.27.', '수유벽산1차', '30000', '1993', '1454', '우이신설', '가오리역', '578.0', '63.78', '상태좋은 아파트 전세입니다', '["25년이상", "융자금없는", "역세권", "대단지"]', '복도식', '0.77', '2', '15', '동향', '3', '1', 'https://map.kakao.com/?q=서울시 강북구 수유동 205&service=opensearch', 'https://fin.land.naver.com/articles/2442311534', '["24.08.27."]',
//     ],
//     error: null,
//   }),
// }))

// describe('App Component', () => {
//   test('renders without crashing', () => {
//     render(<App />)
//     const mapElement = screen.getByTestId('map-section')
//     expect(mapElement).toBeInTheDocument()
//   })

//   test('toggles Roadview when the button is clicked', () => {
//     render(<App />)
//     const roadviewButton = screen.getByRole('button')

//     // 초기 상태에서 Roadview는 보이지 않아야 합니다.
//     expect(screen.queryByTestId('roadview-section')).not.toBeInTheDocument()

//     // 버튼 클릭하여 Roadview 표시
//     fireEvent.click(roadviewButton)
//     expect(screen.getByTestId('roadview-section')).toBeInTheDocument()

//     // 다시 버튼 클릭하여 Roadview 숨김
//     fireEvent.click(roadviewButton)
//     expect(screen.queryByTestId('roadview-section')).not.toBeInTheDocument()
//   })

//   test('handles Escape key press to hide Roadview', () => {
//     render(<App />)
//     const roadviewButton = screen.getByRole('button')

//     // Roadview 표시
//     fireEvent.click(roadviewButton)
//     expect(screen.getByTestId('roadview-section')).toBeInTheDocument()

//     // Escape 키 눌러서 Roadview 숨김
//     fireEvent.keyDown(window, { key: 'Escape' })
//     expect(screen.queryByTestId('roadview-section')).not.toBeInTheDocument()
//   })
// })
