'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { FormInput } from '../../shared/components/ui/form-input';
import { FormImageUpload } from '../../shared/components/ui/form-input/form-image-upload';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { useToast } from '../../shared/hooks/use-toast';
import { createBrand, updateBrand } from '../apiCalls/brands';
import type { BrandSchemaType } from '../types';

const brandSchema = z.object({
  name: z
    .string()
    .min(1, 'Brand name is required')
    .max(255, 'Brand name must be less than 255 characters'),
  image_url: z.string().url('Must be a valid URL').or(z.literal('')),
});

interface BrandFormProps {
  initialData?: BrandSchemaType;
  isEditMode?: boolean;
  brandId?: string;
}

export const BrandForm: React.FC<BrandFormProps> = ({
  initialData,
  isEditMode = false,
  brandId,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { isSubmitting },
  } = useForm<BrandSchemaType>({
    resolver: zodResolver(brandSchema),
    mode: 'onBlur',
    defaultValues: initialData || {
      name: '',
      image_url: '',
    },
  });

  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const createBrandMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: (newBrand) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });

      success(
        'Brand created',
        `"${newBrand.name}" has been created successfully`
      );

      reset();

      navigate('/brands');
    },
    onError: (err: Error) => {
      error(
        'Failed to create brand',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: (data: BrandSchemaType) => updateBrand(brandId!, data),
    onSuccess: (updatedBrand) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brand', brandId] });

      success(
        'Brand updated',
        `"${updatedBrand.name}" has been updated successfully`
      );
    },
    onError: (err: Error) => {
      error(
        'Failed to update brand',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const handleFormSubmit = async (data: BrandSchemaType) => {
    const isValid = await trigger();

    if (isValid) {
      if (isEditMode) {
        updateBrandMutation.mutate(data);
      } else {
        createBrandMutation.mutate(data);
      }
    }
  };

  const handleCancel = () => {
    navigate('/brands');
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <FormInput
        name="name"
        control={control}
        type="text"
        label="Brand Name"
        placeholder="Enter brand name"
        disabled={
          isSubmitting ||
          createBrandMutation.isPending ||
          updateBrandMutation.isPending
        }
        required={true}
      />

      <FormImageUpload
        name="image_url"
        control={control}
        label="Brand Logo"
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
            createBrandMutation.isPending ||
            updateBrandMutation.isPending
          }
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            isSubmitting ||
            createBrandMutation.isPending ||
            updateBrandMutation.isPending
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {(isSubmitting ||
            createBrandMutation.isPending ||
            updateBrandMutation.isPending) && (
            <LoadingIcon size="md" color="white" className="mr-2" />
          )}
          {isEditMode
            ? updateBrandMutation.isPending
              ? 'Updating...'
              : 'Update Brand'
            : createBrandMutation.isPending
            ? 'Creating...'
            : 'Create Brand'}
        </button>
      </div>
    </form>
  );
};
