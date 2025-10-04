import { PhotoIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { searchCategories } from '../../../categories/apiCalls/categories';
import { FormInput } from '../../../shared/components/ui/form-input';
import { FormAsyncSelect } from '../../../shared/components/ui/form-input/form-async-select';
import { FormRichTextEditor } from '../../../shared/components/ui/form-input/form-rich-text-editor';
import { FormSelect } from '../../../shared/components/ui/form-input/form-select';
import { useToast } from '../../../shared/hooks/use-toast';
import { generateHandle } from '../../../shared/utils/formatters';
import { productSchema, type ProductSchemaType } from '../../types';
import { ProductImageModal } from '../product-image-modal';

interface ProductBasicsStepProps {
  initialData?: ProductSchemaType;
  isEditMode?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
}

export const ProductBasicsStep: React.FC<ProductBasicsStepProps> = ({
  isEditMode = false,
  onNext,
  onBack,
  currentStep = 1,
}) => {
  const {
    control,
    watch,
    setValue,
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
      status: 'draft',
      category_ids: [],
    },
  });

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const title = watch('title');
  const images = watch('images');
  const thumbnail = watch('thumbnail');

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Product Basics & Media
        </h2>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              name="status"
              control={control}
              label="Status"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'proposed', label: 'Proposed' },
                { value: 'published', label: 'Published' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              placeholder="Select status"
              disabled={isSubmitting}
            />

            <FormAsyncSelect
              isMulti
              name="category_ids"
              control={control}
              label="Category"
              loadOptions={searchCategories}
              placeholder="Search and select category"
              disabled={isSubmitting}
            />
          </div>

          <FormRichTextEditor
            name="description"
            control={control}
            label="Description"
            placeholder="Enter a detailed product description..."
            disabled={isSubmitting}
            minHeight={200}
            maxHeight={500}
          />

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Media</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Add images to showcase your product
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              <PhotoIcon className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Add Media</span>
            </button>
          </div>
        </div>
      </div>

      <ProductImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={imagesArray || []}
        thumbnail={thumbnail}
        onSave={handleImagesUpdate}
        onThumbnailChange={handleThumbnailUpdate}
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
          {currentStep < 3 && onNext ? (
            <button
              type="button"
              onClick={onNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>
          ) : (
            <SubmitButton isEditMode={isEditMode} />
          )}
        </div>
      </div>
    </div>
  );
};

const SubmitButton: React.FC<{ isEditMode: boolean }> = ({ isEditMode }) => {
  const { success } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        success('Product created', 'Product has been created successfully')
      }
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {isEditMode ? 'Update Product' : 'Create Product'}
    </button>
  );
};
