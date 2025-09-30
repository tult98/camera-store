import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../shared/components/ui/data-table';
import { ActionDropdown } from '../../shared/components/ui/action-dropdown';
import { ConfirmationModal } from '../../shared/components/ui/confirmation-modal';
import { deleteCategory, fetchCategories } from '../apiCalls/categories';

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories('', 'null'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    },
  });

  const handleDeleteClick = (category: CategoryDisplay) => {
    setCategoryToDelete({ id: category.id, name: category.name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await deleteMutation.mutateAsync(categoryToDelete.id);
    }
  };

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
      cell: ({ row }) => {
        const category = row.original;
        
        return (
          <ActionDropdown
            actions={[
              {
                icon: PencilIcon,
                label: 'Edit',
                onClick: () => navigate(`/categories/${category.id}/edit`),
              },
              {
                icon: TrashIcon,
                label: 'Delete',
                variant: 'danger',
                onClick: () => handleDeleteClick(category),
              },
            ]}
          />
        );
      },
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

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and may affect related products.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
