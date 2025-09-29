import { Table } from '@tanstack/react-table';

interface PaginationProps<T> {
  table: Table<T>;
}

export function Pagination<T>({ table }: PaginationProps<T>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const currentPage = pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 text-sm text-gray-600">
      <div>
        {startRow} — {endRow} of {totalRows} results
      </div>
      
      <div className="flex items-center gap-6">
        <span>
          {currentPage} of {totalPages} pages
        </span>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={`${
            table.getCanPreviousPage() 
              ? 'text-gray-600 hover:text-gray-900 hover:underline' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          Prev
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={`${
            table.getCanNextPage() 
              ? 'text-gray-600 hover:text-gray-900 hover:underline' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}