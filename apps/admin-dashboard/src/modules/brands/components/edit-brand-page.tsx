import { FetchError } from '@medusajs/js-sdk';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState } from '../../shared/components/ui/error-state';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { fetchBrandById } from '../apiCalls/brands';
import type { BrandSchemaType } from '../types';
import { BrandForm } from './brand-form';

export const EditBrandPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: brand,
    isLoading,
    error,
  } = useQuery<any, FetchError>({
    queryKey: ['brand', id],
    queryFn: () => fetchBrandById(id!),
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
        message={error.message || 'Failed to load brand data'}
        actionLabel="Back to Brands"
        actionPath="/brands"
      />
    );
  }

  if (!brand) {
    return (
      <ErrorState
        code={404}
        message={`No brand found with ID: ${id}`}
        actionLabel="Back to Brands"
        actionPath="/brands"
      />
    );
  }

  const initialData: BrandSchemaType = {
    name: brand.name,
    image_url: brand.image_url || '',
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Brand</h1>
        <p className="text-gray-600">
          Update the brand information and settings.
        </p>
      </div>

      <BrandForm
        initialData={initialData}
        isEditMode={true}
        brandId={id!}
      />
    </div>
  );
};
