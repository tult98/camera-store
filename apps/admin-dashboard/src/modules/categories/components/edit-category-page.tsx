import { FetchError } from '@medusajs/js-sdk';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState } from '../../shared/components/ui/error-state';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { fetchCategoryById } from '../apiCalls/categories';
import type { CategorySchemaType } from '../types';
import { CategoryForm } from './category-form';

export const EditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: category,
    isLoading,
    error,
  } = useQuery<any, FetchError>({
    queryKey: ['category', id],
    queryFn: () => fetchCategoryById(id!),
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
        message={error.message || 'Failed to load category data'}
        actionLabel="Back to Categories"
        actionPath="/categories"
      />
    );
  }

  if (!category) {
    return (
      <ErrorState
        code={404}
        message={`No category found with ID: ${id}`}
        actionLabel="Back to Categories"
        actionPath="/categories"
      />
    );
  }

  // Transform category data to match CategorySchemaType
  const initialData: CategorySchemaType = {
    name: category.name,
    handle: category.handle,
    description: category.description || '',
    is_active: category.is_active,
    is_internal: category.is_internal,
    parent_category_id: category.parent_category_id || '',
    metadata: {
      is_featured: Boolean(category.metadata?.is_featured),
      hero_image_url: String(category.metadata?.hero_image_url || ''),
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Category</h1>
        <p className="text-gray-600">
          Update the category information and settings.
        </p>
      </div>

      <CategoryForm
        initialData={initialData}
        isEditMode={true}
        categoryId={id!}
      />
    </div>
  );
};
