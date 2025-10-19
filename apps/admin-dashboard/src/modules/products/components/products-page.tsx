import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionDropdown } from '../../shared/components/ui/action-dropdown';
import { ConfirmationModal } from '../../shared/components/ui/confirmation-modal';
import { DataTable } from '../../shared/components/ui/data-table';
import { useToast } from '../../shared/hooks/use-toast';
import { deleteProduct, fetchProducts } from '../apiCalls/products';

interface ProductDisplay {
  id: string;
  title: string;
  thumbnail?: string;
  status: string;
  variantsCount: number;
}

type ProductFromAPI = Awaited<
  ReturnType<typeof fetchProducts>
>['products'][number];

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  const { data: productsData, isLoading } = useQuery({
    queryKey: [
      'products',
      debouncedSearchQuery,
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: () => fetchProducts(debouncedSearchQuery, limit, offset),
  });

  const products = productsData?.products || [];
  const totalCount = productsData?.count || 0;

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteModalOpen(false);
      success(
        'Product deleted',
        `"${productToDelete?.title}" has been deleted successfully`
      );
      setProductToDelete(null);
    },
    onError: (err: Error) => {
      error(
        'Failed to delete product',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const handleDeleteClick = (product: ProductDisplay) => {
    setProductToDelete({ id: product.id, title: product.title });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteMutation.mutateAsync(productToDelete.id);
    }
  };

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const transformProduct = (product: ProductFromAPI): ProductDisplay => {
    return {
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail || undefined,
      status: product.status || 'draft',
      variantsCount: product.variants?.length || 0,
    };
  };

  const displayProducts = products.map(transformProduct);

  const columns: ColumnDef<ProductDisplay>[] = [
    {
      accessorKey: 'thumbnail',
      header: 'Image',
      cell: ({ getValue }) => {
        const thumbnail = getValue() as string | undefined;
        return thumbnail ? (
          <img
            src={thumbnail}
            alt="Product"
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const statusColors: Record<string, string> = {
          published: 'bg-green-500',
          draft: 'bg-gray-500',
          proposed: 'bg-yellow-500',
          rejected: 'bg-red-500',
        };
        const bgColor = statusColors[status] || 'bg-gray-500';
        return (
          <div className="flex items-center">
            <span className={`w-2 h-2 ${bgColor} rounded-full mr-2`}></span>
            <span className="text-gray-700 capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'variantsCount',
      header: 'Variants',
      cell: ({ getValue }) => (
        <span className="text-gray-700">{getValue() as number}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;

        return (
          <ActionDropdown
            actions={[
              {
                icon: PencilIcon,
                label: 'Edit',
                onClick: () => navigate(`/products/${product.id}/edit`),
              },
              {
                icon: TrashIcon,
                label: 'Delete',
                variant: 'danger',
                onClick: () => handleDeleteClick(product),
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
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="block w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => navigate('/products/new')}
          >
            Add Product
          </button>
        </div>
      </div>

      <DataTable
        data={displayProducts}
        columns={columns}
        isLoading={isLoading}
        emptyMessage={
          debouncedSearchQuery
            ? `No products found matching "${debouncedSearchQuery}".`
            : 'No products found. Create your first product to get started.'
        }
        pageSize={pagination.pageSize}
        manualPagination={true}
        totalCount={totalCount}
        onPaginationChange={setPagination}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete product"
        description={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone and will remove all associated variants.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
