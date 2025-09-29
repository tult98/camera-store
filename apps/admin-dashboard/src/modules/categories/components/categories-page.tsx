import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import { DataTable } from '../../shared/components/ui/data-table';

interface Category {
  id: string;
  name: string;
  handle: string;
  status: 'Active' | 'Inactive';
  visibility: 'Public' | 'Private';
  subRows?: Category[];
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Cameras',
    handle: '/cameras',
    status: 'Active',
    visibility: 'Public',
  },
  {
    id: '2',
    name: 'Lenses',
    handle: '/lenses',
    status: 'Active',
    visibility: 'Public',
    subRows: [
      {
        id: '3',
        name: 'Prime Lenses',
        handle: '/prime-lenses',
        status: 'Active',
        visibility: 'Public',
      },
      {
        id: '4',
        name: 'Zoom Lenses',
        handle: '/zoom-lenses',
        status: 'Active',
        visibility: 'Public',
      },
      {
        id: '5',
        name: 'Macro Lenses',
        handle: '/macro-lenses',
        status: 'Active',
        visibility: 'Public',
      },
      {
        id: '6',
        name: 'Telephoto Lenses',
        handle: '/telephoto-lenses',
        status: 'Active',
        visibility: 'Public',
      },
    ],
  },
];

export const CategoriesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'handle',
      header: 'Handle',
      cell: ({ getValue }) => (
        <span className="text-gray-500">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-gray-700">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'visibility',
      header: 'Visibility',
      cell: ({ getValue }) => {
        const visibility = getValue() as string;
        return (
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-gray-700">{visibility}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: () => (
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      ),
    },
  ];


  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Category
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setIsLoading(!isLoading)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
        >
          Toggle Loading
        </button>
        <button
          onClick={() => setShowEmpty(!showEmpty)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
        >
          Toggle Empty State
        </button>
      </div>

      <DataTable
        data={showEmpty ? [] : mockCategories}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No categories found. Create your first category to get started."
        pageSize={10}
        enableExpanding={true}
        getSubRows={(row) => row.subRows}
      />
    </div>
  );
};
