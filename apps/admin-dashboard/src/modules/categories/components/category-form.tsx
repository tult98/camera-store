import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../../shared/components/ui/form-input';
import { FormAsyncSelect } from '../../shared/components/ui/form-input/form-async-select';
import { FormImageUpload } from '../../shared/components/ui/form-input/form-image-upload';
import { FormSwitch } from '../../shared/components/ui/form-input/form-switch';
import { FormTextarea } from '../../shared/components/ui/form-input/form-textarea';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { useToast } from '../../shared/hooks/use-toast';
import { generateHandle } from '../../shared/utils/formatters';
import {
  createCategory,
  fetchCategories,
  searchCategories,
  updateCategory,
} from '../apiCalls/categories';
import { categorySchema, type CategorySchemaType } from '../types';

interface CategoryFormProps {
  initialData?: CategorySchemaType;
  isEditMode?: boolean;
  categoryId?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  isEditMode = false,
  categoryId,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { isSubmitting },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    mode: 'onBlur',
    defaultValues: initialData || {
      name: '',
      handle: '',
      description: '',
      is_active: true,
      is_internal: false,
      parent_category_id: '',
      metadata: {
        is_featured: false,
        hero_image_url: '',
      },
    },
  });

  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const name = watch('name');

  // Fetch initial categories for default options
  const { data: initialCategories = [] } = useQuery({
    queryKey: ['categories', 'initial'],
    queryFn: () => fetchCategories(''),
  });

  // Convert to select options format
  const defaultCategoryOptions = initialCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  // Auto-generate handle from name (only in create mode)
  useEffect(() => {
    if (!isEditMode) {
      setValue('handle', generateHandle(name));
    }
  }, [name, setValue, isEditMode]);

  const loadParentCategories = useCallback(
    async (inputValue: string) => {
      // If no input and we have default options, return them instead of making API call
      if (!inputValue || inputValue.trim().length === 0) {
        return defaultCategoryOptions;
      }

      // Only search if user typed at least 2 characters
      if (inputValue.trim().length < 2) {
        return defaultCategoryOptions;
      }

      try {
        const options = await searchCategories(inputValue);
        return options;
      } catch (error) {
        console.error('Error loading parent categories:', error);
        return defaultCategoryOptions; // Fallback to default options on error
      }
    },
    [defaultCategoryOptions]
  );

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      // Invalidate categories queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['categories'] });

      // Show success toast
      success(
        'Category created',
        `"${newCategory.name}" has been created successfully`
      );

      // Reset form
      reset();

      // Redirect to categories page
      navigate('/categories');
    },
    onError: (err: Error) => {
      // Show error toast
      error(
        'Failed to create category',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (data: CategorySchemaType) => updateCategory(categoryId!, data),
    onSuccess: (updatedCategory) => {
      // Invalidate categories queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] });

      // Show success toast
      success(
        'Category updated',
        `"${updatedCategory.name}" has been updated successfully`
      );
    },
    onError: (err: Error) => {
      // Show error toast
      error(
        'Failed to update category',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const handleFormSubmit = async (data: CategorySchemaType) => {
    // Trigger validation and mark fields as touched
    const isValid = await trigger();

    if (isValid) {
      if (isEditMode) {
        updateCategoryMutation.mutate(data);
      } else {
        createCategoryMutation.mutate(data);
      }
    }
    // If not valid, errors will now show because fields are marked as touched
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="name"
          control={control}
          type="text"
          label="Title"
          disabled={
            isSubmitting ||
            createCategoryMutation.isPending ||
            updateCategoryMutation.isPending
          }
          required={true}
        />

        <FormInput
          name="handle"
          control={control}
          type="text"
          label="Handle"
          disabled={
            isSubmitting ||
            createCategoryMutation.isPending ||
            updateCategoryMutation.isPending
          }
        />
      </div>

      <FormAsyncSelect
        name="parent_category_id"
        control={control}
        loadOptions={loadParentCategories}
        label="Parent Category"
        placeholder="Search and select a parent category..."
        disabled={isSubmitting}
        defaultOptions={defaultCategoryOptions}
        cacheOptions={true}
        debounceTime={500}
        loadingMessage="Loading categories..."
        noOptionsMessage={(obj) =>
          obj.inputValue
            ? `No categories found for "${obj.inputValue}"`
            : 'No categories available'
        }
      />

      <FormTextarea
        name="description"
        control={control}
        label="Description"
        placeholder="Enter category description (optional)"
        disabled={isSubmitting}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormSwitch
          name="is_active"
          control={control}
          label="Active"
          disabled={
            isSubmitting ||
            createCategoryMutation.isPending ||
            updateCategoryMutation.isPending
          }
        />

        <FormSwitch
          name="is_internal"
          control={control}
          label="Internal"
          disabled={
            isSubmitting ||
            createCategoryMutation.isPending ||
            updateCategoryMutation.isPending
          }
        />

        <FormSwitch
          name="metadata.is_featured"
          control={control}
          label="Featured"
          description="Mark this category as featured on the homepage"
          disabled={
            isSubmitting ||
            createCategoryMutation.isPending ||
            updateCategoryMutation.isPending
          }
        />
      </div>

      <FormImageUpload
        name="metadata.hero_image_url"
        control={control}
        label="Hero Image"
        disabled={isSubmitting}
        placeholder="Click to upload or drag and drop"
        maxSizeInMB={10}
      />

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          disabled={
            isSubmitting ||
            createCategoryMutation.isPending ||
            updateCategoryMutation.isPending
          }
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            isSubmitting ||
            createCategoryMutation.isPending ||
            updateCategoryMutation.isPending
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {(isSubmitting ||
            createCategoryMutation.isPending ||
            updateCategoryMutation.isPending) && (
            <LoadingIcon size="md" color="white" className="mr-2" />
          )}
          {isEditMode
            ? updateCategoryMutation.isPending
              ? 'Updating...'
              : 'Update Category'
            : createCategoryMutation.isPending
            ? 'Creating...'
            : 'Create Category'}
        </button>
      </div>
    </form>
  );
};
