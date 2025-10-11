import { zodResolver } from '@hookform/resolvers/zod';
import { FetchError } from '@medusajs/js-sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorState } from '../../shared/components/ui/error-state';
import { FormSwitch } from '../../shared/components/ui/form-input/form-switch';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { useToast } from '../../shared/hooks/use-toast';
import { fetchBanner, saveBanner } from '../apiCalls/banner';
import { bannerSchema, type Banner, type BannerSchemaType } from '../types';
import { BannerUploadSection } from './banner-upload-section';

export const BannerSettingsPage: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: banner,
    isLoading,
    error,
  } = useQuery<Banner | null, FetchError>({
    queryKey: ['banner'],
    queryFn: fetchBanner,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<BannerSchemaType>({
    resolver: zodResolver(bannerSchema),
    mode: 'onBlur',
    defaultValues: {
      images: [],
      is_active: true,
    },
  });

  useEffect(() => {
    if (banner) {
      const images = Array.isArray(banner.images)
        ? banner.images.map((url: string, index: number) => ({
            id: `img-${index}`,
            url,
          }))
        : [];

      reset({
        images,
        is_active: banner.is_active ?? true,
      });
    }
  }, [banner, reset]);

  const images = watch('images');

  const saveMutation = useMutation({
    mutationFn: saveBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banner'] });
      toast.success(
        'Banner updated',
        'Banner settings have been saved successfully'
      );
    },
    onError: (err: Error) => {
      toast.error(
        'Failed to save banner',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const handleImagesUpdate = (
    updatedImages: Array<{ id?: string; url: string }>
  ) => {
    const currentImages = images || [];
    setValue('images', [...currentImages, ...updatedImages]);
  };

  const handleDeleteImages = (imageIds: string[]) => {
    const updatedImages = images?.filter(
      (img) => !imageIds.includes(img.id || img.url)
    );
    setValue('images', updatedImages || []);
  };

  const onSubmit = async (data: BannerSchemaType) => {
    await saveMutation.mutateAsync(data);
  };

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
        message={error.message || 'Failed to load banner data'}
        actionLabel="Back to Dashboard"
        actionPath="/"
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Banner Settings
        </h1>
        <p className="text-gray-600">
          Manage your store banner images and visibility.
        </p>
      </div>

      <form className="space-y-6 max-w-4xl" onSubmit={handleSubmit(onSubmit)}>
        <BannerUploadSection
          images={images}
          onSave={handleImagesUpdate}
          onDeleteImages={handleDeleteImages}
        />

        <FormSwitch
          name="is_active"
          control={control}
          label="Active"
          description="Show banner on the storefront"
          disabled={isSubmitting || saveMutation.isPending}
        />

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || saveMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {(isSubmitting || saveMutation.isPending) && (
              <LoadingIcon size="md" color="white" className="mr-2" />
            )}
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
