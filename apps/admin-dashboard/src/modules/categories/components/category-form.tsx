import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../../shared/components/ui/form-input';
import { FormImageUpload } from '../../shared/components/ui/form-input/form-image-upload';
import { FormSwitch } from '../../shared/components/ui/form-input/form-switch';
import { FormTextarea } from '../../shared/components/ui/form-input/form-textarea';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { categorySchema, type CategorySchemaType } from '../types';


export const CategoryForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      handle: '',
      description: '',
      is_active: true,
      is_internal: false,
      metadata: {
        is_featured: false,
        hero_image_url: '',
      },
    },
  });

  const name = watch('name');

  // Auto-generate handle from name
  useEffect(() => {
    if (name) {
      const generatedHandle = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('handle', generatedHandle);
    }
  }, [name, setValue]);

  const handleFormSubmit = (data: CategorySchemaType) => {
    console.log('Category form data:', data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="name"
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
          disabled={isSubmitting}
        />

        <FormSwitch
          name="is_internal"
          control={control}
          label="Internal"
          disabled={isSubmitting}
        />

        <FormSwitch
          name="metadata.is_featured"
          control={control}
          label="Featured"
          description="Mark this category as featured on the homepage"
          disabled={isSubmitting}
        />
      </div>

      <FormImageUpload
        name="metadata.hero_image_url"
        control={control}
        label="Hero Image"
        disabled={isSubmitting}
        placeholder="Click to upload or drag and drop"
        maxSizeInMB={10}
        maxDimensions="MAX. 800×400px"
      />

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
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
          Create Category
        </button>
      </div>
    </form>
  );
};
