import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon, PencilIcon } from '@heroicons/react/24/outline';
import { FormInput } from '../../shared/components/ui/form-input';
import { FormRichTextEditor } from '../../shared/components/ui/form-input/form-rich-text-editor';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { useToast } from '../../shared/hooks/use-toast';
import { productSchema, type ProductSchemaType } from '../types';
import { ProductImageModal } from './product-image-modal';

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
      images: [],
    },
  });

  const { success, error } = useToast();
  const navigate = useNavigate();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const title = watch('title');
  const images = watch('images');

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

  const handleImagesUpdate = (updatedImages: Array<{ id: string; url: string; isThumbnail?: boolean }>) => {
    setValue('images', updatedImages);
  };

  const getThumbnailImage = () => {
    return images?.find(img => img.isThumbnail) || images?.[0];
  };

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

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Media</h3>
              <p className="text-xs text-gray-500 mt-1">Add images to showcase your product</p>
            </div>
          </div>
          
          {images && images.length > 0 ? (
            <div className="flex items-center space-x-4">
              {getThumbnailImage() && (
                <img
                  src={getThumbnailImage()?.url}
                  alt="Product thumbnail"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
                </p>
                <p className="text-xs text-gray-500">
                  {getThumbnailImage()?.isThumbnail ? 'Thumbnail selected' : 'No thumbnail selected'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="flex items-center px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                <PencilIcon className="w-4 h-4 mr-1.5" />
                Edit
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              <PhotoIcon className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Add Media</span>
            </button>
          )}
        </div>

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

      <ProductImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={images || []}
        onSave={handleImagesUpdate}
      />
    </form>
  );
};