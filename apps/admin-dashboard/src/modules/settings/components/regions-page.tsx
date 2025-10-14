import { FetchError } from '@medusajs/js-sdk';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';
import { ErrorState } from '../../shared/components/ui/error-state';
import { DataTable } from '../../shared/components/ui/data-table';
import { fetchRegions } from '../apiCalls/regions';

interface RegionDisplay {
  id: string;
  name: string;
  countries: string;
  paymentProviders: string;
}

type Region = Awaited<ReturnType<typeof fetchRegions>>[0];

export const RegionsPage: React.FC = () => {
  const {
    data: regions = [],
    isLoading,
    error,
  } = useQuery<Region[], FetchError>({
    queryKey: ['regions'],
    queryFn: fetchRegions,
  });

  const transformRegion = (region: Region): RegionDisplay => {
    const countries = region.countries
      ?.map((country) => country.display_name || country.name)
      .join(', ') || '-';

    const paymentProviders = region.payment_providers
      ?.map((provider) => provider.id)
      .join(', ') || '-';

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
  );
};
