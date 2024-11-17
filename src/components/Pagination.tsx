import ReactPaginate from 'react-paginate'

export interface PaginationProps {
  pageCount: number
  onPageChange: (selectedItem: { selected: number }) => void
}

/**
 * Pagination 컴포넌트는 ReactPaginate를 사용하여 페이지네이션을 제공합니다.
 * 사용자가 페이지를 변경할 때마다 `onPageChange` 함수가 호출되어 페이지 전환을 처리합니다.
 *
 * @component
 * @example
 * // Pagination 컴포넌트는 다음과 같이 사용됩니다.
 * <Pagination pageCount={10} onPageChange={handlePageChange} />
 *
 * @param {PaginationProps} props - Pagination 컴포넌트에 필요한 속성
 * @param {number} props.pageCount - 전체 페이지 수
 * @param {(selectedItem: { selected: number }) => void} props.onPageChange - 페이지가 변경될 때 호출되는 함수
 * @returns {JSX.Element} 페이지네이션을 렌더링하는 React 컴포넌트
 */
export const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center w-full">
      <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        breakLabel=".."
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={1}
        onPageChange={onPageChange}
        containerClassName="pagination flex gap-1 mt-2 list-none p-0"
        pageClassName="px-2 py-1 border rounded text-xs hover:bg-gray-100"
        previousClassName="px-2 py-1 border rounded text-xs hover:bg-gray-100"
        nextClassName="px-2 py-1 border rounded text-xs hover:bg-gray-100"
        breakClassName="px-2 py-1 text-xs"
        activeClassName="!bg-gray-900 !text-white"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </div>
  )
}
