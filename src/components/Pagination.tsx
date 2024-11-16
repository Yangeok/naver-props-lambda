import ReactPaginate from 'react-paginate'

interface PaginationProps {
  pageCount: number
  onPageChange: (selectedItem: { selected: number }) => void
}

export const Pagination = ({ pageCount, onPageChange }: PaginationProps) => {
  return (
    <ReactPaginate
      previousLabel="<"
      nextLabel=">"
      breakLabel=".."
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={1}
      onPageChange={onPageChange}
      containerClassName="pagination flex justify-center mt-2 list-none"
      pageClassName="px-2 py-1 border text-xs first:ml-0 last:mr-0"
      previousClassName="px-2 py-1 border text-xs"
      nextClassName="px-2 py-1 border text-xs"
      activeClassName="bg-gray-300 text-black font-semibold rounded"
    />
  )
}
