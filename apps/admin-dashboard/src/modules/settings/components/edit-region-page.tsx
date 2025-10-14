import { FetchError } from '@medusajs/js-sdk';
import {
  AdminPaymentProvider,
  AdminRegion,
  AdminRegionCountry,
} from '@medusajs/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState } from '../../shared/components/ui/error-state';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { fetchRegionById } from '../apiCalls/regions';
import type { RegionSchemaType } from '../types';
import { RegionForm } from './region-form';

export const EditRegionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: region,
    isLoading,
    error,
  } = useQuery<AdminRegion, FetchError>({
    queryKey: ['region', id],
    queryFn: () => fetchRegionById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <LoadingIcon size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={error.status}
        message={error.message || 'Failed to load region data'}
        actionLabel="Back to Regions"
        actionPath="/settings/regions"
      />
    );
  }

  if (!region) {
    return (
      <ErrorState
        code={404}
        message={`No region found with ID: ${id}`}
        actionLabel="Back to Regions"
        actionPath="/settings/regions"
      />
    );
  }

  const initialData: RegionSchemaType = {
    name: region.name,
    currency_code: region.currency_code,
    countries:
      region.countries?.map((country: AdminRegionCountry) => country.iso_2!) ||
      [],
    payment_providers:
      region.payment_providers?.map(
        (provider: AdminPaymentProvider) => provider.id
      ) || [],
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Region</h1>
        <p className="text-gray-600">
          Update the region information and settings.
        </p>
      </div>

      <RegionForm initialData={initialData} isEditMode={true} regionId={id!} />
    </div>
  );
};
