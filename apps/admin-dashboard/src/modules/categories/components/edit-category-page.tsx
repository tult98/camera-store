import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
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
  } = useQuery({
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">
            Error Loading Category
          </h2>
          <p className="text-red-600">
            {error instanceof Error
              ? error.message
              : 'Failed to load category data'}
          </p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-yellow-800 font-semibold mb-2">
            Category Not Found
          </h2>
          <p className="text-yellow-600">No category found with ID: {id}</p>
        </div>
      </div>
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
