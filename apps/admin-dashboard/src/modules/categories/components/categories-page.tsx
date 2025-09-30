import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTable } from '../../shared/components/ui/data-table';
import { fetchCategories } from '../apiCalls/categories';

interface CategoryDisplay {
  id: string;
  name: string;
  handle: string;
  status: 'Active' | 'Inactive';
  visibility: 'Public' | 'Private';
  subRows?: CategoryDisplay[];
}

type CategoryFromAPI = Awaited<ReturnType<typeof fetchCategories>>[0];

export const CategoriesPage: React.FC = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories('', 'null'),
  });

  const transformCategory = (category: CategoryFromAPI): CategoryDisplay => {
    const transformed: CategoryDisplay = {
      id: category.id,
      name: category.name,
      handle: category.handle,
      status: category.is_active ? 'Active' : 'Inactive',
      visibility: category.is_internal ? 'Private' : 'Public',
    };

    if (category.category_children && category.category_children.length > 0) {
      transformed.subRows = category.category_children.map(transformCategory);
    }

    return transformed;
  };

  const displayCategories = categories.map(transformCategory);

  const columns: ColumnDef<CategoryDisplay>[] = [
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
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
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

      <DataTable
        data={displayCategories}
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
