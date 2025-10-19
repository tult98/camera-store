import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionDropdown } from '../../shared/components/ui/action-dropdown';
import { ConfirmationModal } from '../../shared/components/ui/confirmation-modal';
import { DataTable } from '../../shared/components/ui/data-table';
import { useToast } from '../../shared/hooks/use-toast';
import { deleteBrand, fetchBrands } from '../apiCalls/brands';
import type { Brand } from '../types';

export const BrandsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  const { data: brandsData, isLoading } = useQuery({
    queryKey: ['brands', pagination.pageIndex, pagination.pageSize],
    queryFn: () => fetchBrands('', limit, offset),
  });

  const brands = brandsData?.brands || [];
  const totalCount = brandsData?.count || 0;

  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setDeleteModalOpen(false);
      success(
        'Brand deleted',
        `"${brandToDelete?.name}" has been deleted successfully`
      );
      setBrandToDelete(null);
    },
    onError: (err: Error) => {
      error(
        'Failed to delete brand',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete({ id: brand.id, name: brand.name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      await deleteMutation.mutateAsync(brandToDelete.id);
    }
  };

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'image_url',
      header: 'Image',
      cell: ({ getValue }) => {
        const imageUrl = getValue() as string | null;
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Brand"
            className="w-10 h-10 object-contain rounded"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const brand = row.original;

        return (
          <ActionDropdown
            actions={[
              {
                icon: PencilIcon,
                label: 'Edit',
                onClick: () => navigate(`/brands/${brand.id}/edit`),
              },
              {
                icon: TrashIcon,
                label: 'Delete',
                variant: 'danger',
                onClick: () => handleDeleteClick(brand),
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
        <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => navigate('/brands/new')}
        >
          Add Brand
        </button>
      </div>

      <DataTable
        data={brands}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No brands found. Create your first brand to get started."
        pageSize={pagination.pageSize}
        manualPagination={true}
        totalCount={totalCount}
        onPaginationChange={setPagination}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete brand"
        description={`Are you sure you want to delete "${brandToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
