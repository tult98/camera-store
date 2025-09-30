import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../../shared/components/ui/form-input';
import { FormRichTextEditor } from '../../shared/components/ui/form-input/form-rich-text-editor';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { useToast } from '../../shared/hooks/use-toast';
import { productSchema, type ProductSchemaType } from '../types';

interface ProductFormProps {
  initialData?: ProductSchemaType;
  isEditMode?: boolean;
  productId?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  isEditMode = false,
  productId: _productId,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { isSubmitting },
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    mode: 'onBlur',
    defaultValues: initialData || {
      title: '',
      subtitle: '',
      handle: '',
      description: '',
    },
  });

  const { success, error } = useToast();
  const navigate = useNavigate();

  const title = watch('title');

  // Auto-generate handle from title (only in create mode)
  useEffect(() => {
    if (title && !isEditMode) {
      const generatedHandle = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('handle', generatedHandle);
    }
  }, [title, setValue, isEditMode]);

  const handleFormSubmit = async (data: ProductSchemaType) => {
    const isValid = await trigger();

    if (isValid) {
      try {
        // TODO: Replace with actual API call when backend endpoints are ready
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        success(
          isEditMode ? 'Product updated' : 'Product created',
          `"${data.title}" has been ${isEditMode ? 'updated' : 'created'} successfully`
        );

        if (!isEditMode) {
          reset();
        }

        navigate('/products');
      } catch (err) {
        error(
          isEditMode ? 'Failed to update product' : 'Failed to create product',
          (err as Error)?.message || 'An unexpected error occurred'
        );
      }
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="title"
            control={control}
            type="text"
            label="Title"
            disabled={isSubmitting}
            required={true}
          />

          <FormInput
            name="handle"
            control={control}
            type="text"
            label="Handle"
            disabled={isSubmitting}
          />
        </div>

        <FormInput
          name="subtitle"
          control={control}
          type="text"
          label="Subtitle"
          placeholder="Enter product subtitle (optional)"
          disabled={isSubmitting}
        />

        <FormRichTextEditor
          name="description"
          control={control}
          label="Description"
          placeholder="Enter a detailed product description..."
          disabled={isSubmitting}
          minHeight={200}
          maxHeight={500}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting && (
              <LoadingIcon size="md" color="white" className="mr-2" />
            )}
            {isEditMode
              ? isSubmitting
                ? 'Updating...'
                : 'Update Product'
              : isSubmitting
              ? 'Creating...'
              : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  );
};