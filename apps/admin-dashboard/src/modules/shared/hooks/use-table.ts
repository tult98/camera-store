import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useState } from 'react';

interface UseTableOptions<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  globalFilter?: string;
}

export function useTable<T>({
  data,
  columns,
  pageSize = 10,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  globalFilter = '',
}: UseTableOptions<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: enablePagination ? pagination : undefined,
      globalFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
  });

  return {
    table,
    sorting,
    setSorting,
    pagination,
    setPagination,
    flexRender,
  };
}
