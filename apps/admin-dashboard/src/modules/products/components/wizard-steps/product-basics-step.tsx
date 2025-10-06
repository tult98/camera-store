import { zodResolver } from '@hookform/resolvers/zod';
import { AdminProduct } from '@medusajs/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../../../shared/components/ui/form-input';
import { FormRichTextEditor } from '../../../shared/components/ui/form-input/form-rich-text-editor';
import { LoadingIcon } from '../../../shared/components/ui/loading-icon';
import { useToast } from '../../../shared/hooks/use-toast';
import { generateHandle } from '../../../shared/utils/formatters';
import { createProduct, updateProduct } from '../../apiCalls/products';
import { productSchema, type ProductSchemaType } from '../../types';
import { MediaUploadSection } from './product-basics-step/media-upload-section';
import { ProductOptionsSection } from './product-basics-step/product-options-section';

interface ProductBasicsStepProps {
  initialData?: AdminProduct | null;
  isEditMode?: boolean;
  productId?: string;
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
  setProduct: React.Dispatch<React.SetStateAction<AdminProduct | null>>;
}

export const ProductBasicsStep: React.FC<ProductBasicsStepProps> = ({
  initialData,
  isEditMode = false,
  productId,
  onNext,
  onBack,
  currentStep = 1,
  setProduct,
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const getDefaultValues = (): Partial<ProductSchemaType> => {
    if (isEditMode && initialData) {
      return {
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        handle: initialData.handle || '',
        description: initialData.description || '',
        images:
          initialData.images?.map((img) => ({ id: img.id, url: img.url })) ||
          [],
        thumbnail: initialData.thumbnail || '',
        options:
          initialData.options?.map((opt) => ({
            title: opt.title,
            values: opt.values?.map((v) => v.value) || [],
          })) || [],
      };
    }
    return {
      title: '',
      subtitle: '',
      handle: '',
      description: '',
      images: [],
      options: [],
    };
  };

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    mode: 'onBlur',
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      reset(getDefaultValues());
    }
  }, [isEditMode, initialData]);

  const title = watch('title');
  const images = watch('images');
  const thumbnail = watch('thumbnail');

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (response) => {
      setProduct(response.product);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(
        `Product created`,
        `"${title}" has been created successfully`
      );
    },
    onError: (error) => {
      const errorMessage =
        error.message || 'Failed to create product. Please try again.';
      toast.error('Error', errorMessage);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (data: ProductSchemaType) => updateProduct(productId!, data),
    onSuccess: (response) => {
      setProduct({
        categories: initialData?.categories,
        ...response.product
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(
        `Product updated`,
        `"${title}" has been updated successfully`
      );
    },
    onError: (error) => {
      const errorMessage =
        error.message || 'Failed to update product. Please try again.';
      toast.error('Error', errorMessage);
    },
  });

  const imagesArray = images?.map((image) => ({
    id: image.id || image.url,
    url: image.url,
  }));

  useEffect(() => {
    setValue('handle', generateHandle(title));
  }, [title, setValue]);

  const handleImagesUpdate = (
    updatedImages: Array<{ id?: string; url: string }>
  ) => {
    setValue('images', updatedImages);
  };

  const handleThumbnailUpdate = (thumbnailUrl: string) => {
    setValue('thumbnail', thumbnailUrl);
  };

  const handleDeleteImages = (imageIds: string[]) => {
    const updatedImages = images?.filter(
      (img) => !imageIds.includes(img.id || img.url)
    );
    setValue('images', updatedImages || []);
  };

  const onSubmit = async (data: ProductSchemaType) => {
    if (isEditMode) {
      await updateProductMutation.mutateAsync(data);
    } else {
      await createProductMutation.mutateAsync(data);
    }
    onNext?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Product Basics & Media
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <MediaUploadSection
            images={imagesArray}
            thumbnail={thumbnail}
            onSave={handleImagesUpdate}
            onMakeThumbnail={handleThumbnailUpdate}
            onDeleteImages={handleDeleteImages}
          />
          <ProductOptionsSection
            control={control}
            isSubmitting={isSubmitting}
          />
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
            {currentStep > 1 && onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back
              </button>
            )}
            <div className={currentStep <= 1 ? 'ml-auto' : ''}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <LoadingIcon size="sm" color="white" className="mr-2" />
                )}
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
