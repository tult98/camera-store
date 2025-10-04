import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../../../shared/components/ui/form-input';
import { FormRichTextEditor } from '../../../shared/components/ui/form-input/form-rich-text-editor';
import { useToast } from '../../../shared/hooks/use-toast';
import { generateHandle } from '../../../shared/utils/formatters';
import { createProduct } from '../../apiCalls/products';
import { productSchema, type ProductSchemaType } from '../../types';
import { MediaUploadSection } from './product-basics-step/media-upload-section';
import { ProductOptionsSection } from './product-basics-step/product-options-section';

interface ProductBasicsStepProps {
  initialData?: ProductSchemaType;
  isEditMode?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
}

export const ProductBasicsStep: React.FC<ProductBasicsStepProps> = ({
  onNext,
  onBack,
  currentStep = 1,
}) => {
  const toast = useToast();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      subtitle: '',
      handle: '',
      description: '',
      images: [],
      options: [],
    },
  });

  const title = watch('title');
  const images = watch('images');
  const thumbnail = watch('thumbnail');

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
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
    await createProductMutation.mutateAsync(data);
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
