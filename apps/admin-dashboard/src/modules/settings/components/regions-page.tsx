import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FetchError } from '@medusajs/js-sdk';
import { AdminRegion } from '@medusajs/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ActionDropdown,
  ActionItem,
} from '../../shared/components/ui/action-dropdown';
import { ConfirmationModal } from '../../shared/components/ui/confirmation-modal';
import { DataTable } from '../../shared/components/ui/data-table';
import { ErrorState } from '../../shared/components/ui/error-state';
import { useToast } from '../../shared/hooks/use-toast';
import { deleteRegion, fetchRegions } from '../apiCalls/regions';

interface RegionDisplay {
  id: string;
  name: string;
  countries: string;
  paymentProviders: string;
}

export const RegionsPage: React.FC = () => {
  const [regionToDelete, setRegionToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const {
    data: regions = [],
    isLoading,
    error,
  } = useQuery<AdminRegion[], FetchError>({
    queryKey: ['regions'],
    queryFn: fetchRegions,
  });

  const deleteRegionMutation = useMutation({
    mutationFn: deleteRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      success('Region deleted', 'The region has been deleted successfully');
      setRegionToDelete(null);
    },
    onError: (err: Error) => {
      showError(
        'Failed to delete region',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const transformRegion = (region: AdminRegion): RegionDisplay => {
    const countries =
      region.countries
        ?.map((country) => country.display_name || country.name)
        .join(', ') || '-';

    const paymentProviders =
      region.payment_providers?.map((provider) => provider.id).join(', ') ||
      '-';

    return {
      id: region.id,
      name: region.name,
      countries,
      paymentProviders,
    };
  };

  const displayRegions = regions.map(transformRegion);

  const columns: ColumnDef<RegionDisplay>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'countries',
      header: 'Countries',
      cell: ({ getValue }) => (
        <span className="text-gray-700">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'paymentProviders',
      header: 'Payment Providers',
      cell: ({ getValue }) => (
        <span className="text-gray-700">{getValue() as string}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const region = row.original;
        const actions: ActionItem[] = [
          {
            icon: PencilIcon,
            label: 'Edit',
            onClick: () => navigate(`/settings/regions/${region.id}/edit`),
            variant: 'default',
          },
          {
            icon: TrashIcon,
            label: 'Delete',
            onClick: () =>
              setRegionToDelete({ id: region.id, name: region.name }),
            variant: 'danger',
          },
        ];

        return <ActionDropdown actions={actions} />;
      },
    },
  ];

  if (error) {
    return (
      <ErrorState
        code={error.status}
        message={error.message || 'Failed to load regions'}
        actionLabel="Back to Dashboard"
        actionPath="/"
      />
    );
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Regions</h1>
          <Link
            to="/settings/regions/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            New Region
          </Link>
        </div>

        <DataTable
          data={displayRegions}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No regions found."
          pageSize={10}
        />
      </div>

      {regionToDelete && (
        <ConfirmationModal
          isOpen={true}
          title="Delete Region"
          description={`Are you sure you want to delete "${regionToDelete.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={() => deleteRegionMutation.mutate(regionToDelete.id)}
          onClose={() => setRegionToDelete(null)}
          loading={deleteRegionMutation.isPending}
        />
      )}
    </>
  );
};
