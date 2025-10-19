import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useState } from 'react';
import { LoadingIcon } from '../loading-icon';
import { Pagination } from './pagination';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableExpanding?: boolean;
  getSubRows?: (row: T) => T[] | undefined;
  manualPagination?: boolean;
  totalCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  pageSize = 10,
  enableSorting = true,
  enablePagination = true,
  enableExpanding = false,
  getSubRows,
  manualPagination = false,
  totalCount,
  onPaginationChange,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const handlePaginationChange = (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    setPagination(newPagination);
    onPaginationChange?.(newPagination);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: enablePagination ? pagination : undefined,
      expanded: enableExpanding ? expanded : undefined,
    },
    onSortingChange: setSorting,
    onPaginationChange: handlePaginationChange,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
    getSubRows: enableExpanding ? getSubRows : undefined,
    manualPagination,
    manualSorting: false,
    pageCount: manualPagination && totalCount !== undefined
      ? Math.ceil(totalCount / pageSize)
      : undefined,
  });

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} scope="col" className="px-6 py-3">
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'flex items-center cursor-pointer select-none'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12">
                <div className="flex items-center justify-center">
                  <LoadingIcon />
                  <span className="ml-2 text-gray-500">Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No data available</div>
                <div className="text-gray-400 text-sm">{emptyMessage}</div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className={`bg-white border-b border-gray-200 ${
                onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
              } ${
                index === table.getRowModel().rows.length - 1
                  ? 'border-b-0'
                  : ''
              }`}
            >
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={cell.id}
                  className={`px-6 py-4 ${
                    cellIndex === 0
                      ? 'font-medium text-gray-900 whitespace-nowrap'
                      : ''
                  }`}
                >
                  <div className="flex items-center">
                    {cellIndex === 0 && enableExpanding && (
                      <>
                        {row.depth > 0 && (
                          <span style={{ marginLeft: `${row.depth * 2}rem` }} />
                        )}
                        {row.getCanExpand() ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              row.toggleExpanded();
                            }}
                            className="mr-2 text-gray-500 hover:text-gray-700"
                          >
                            {row.getIsExpanded() ? '▼' : '▶'}
                          </button>
                        ) : (
                          row.depth === 0 && <span className="w-4 mr-2" />
                        )}
                      </>
                    )}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))
          )}
        </tbody>
      </table>
      {enablePagination && !isLoading && data.length > 0 && (
        <Pagination table={table} totalCount={manualPagination ? totalCount : undefined} />
      )}
    </div>
  );
}
