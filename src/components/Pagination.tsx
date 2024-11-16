import ReactPaginate from 'react-paginate'

interface PaginationProps {
  pageCount: number
  onPageChange: (selectedItem: { selected: number }) => void
}

export const Pagination = ({ pageCount, onPageChange }: PaginationProps) => {
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
