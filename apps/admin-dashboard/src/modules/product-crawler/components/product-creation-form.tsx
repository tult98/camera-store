import { zodResolver } from '@hookform/resolvers/zod';
import JsonView from '@microlink/react-json-view';
import { FormInput } from '@modules/shared/components/ui/form-input';
import { FormRadioGroup } from '@modules/shared/components/ui/form-input/form-radio-group';
import { LoadingIcon } from '@modules/shared/components/ui/loading-icon';
import { useToast } from '@modules/shared/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createProductFromCrawl, updateProductFromCrawl } from '../apiCalls/products';
import type { ProductData } from '../types/crawler.types';

interface ProductCreationFormProps {
  productData: ProductData;
}

const productCreationSchema = z
  .object({
    mode: z.enum(['create', 'update']),
    productId: z.string(),
  })
  .refine(
    (data) => {
      if (data.mode === 'update') {
        return data.productId.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Product ID is required for updates',
      path: ['productId'],
    }
  );

type FormData = z.infer<typeof productCreationSchema>;

export const ProductCreationForm: React.FC<ProductCreationFormProps> = ({ productData }) => {
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();
  const { control, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(productCreationSchema),
    mode: 'onBlur',
    defaultValues: {
      mode: 'create',
      productId: '',
    },
  });

  const mode = watch('mode');

  const createMutation = useMutation({
    mutationFn: () => createProductFromCrawl(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['crawl-jobs'] });
      success('Product created successfully');
    },
    onError: (error: Error) => {
      showError('Failed to create product', error.message || 'Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => updateProductFromCrawl(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['crawl-jobs'] });
      success('Product updated successfully');
    },
    onError: (error: Error) => {
      showError('Failed to update product', error.message || 'Please try again.');
    },
  });

  const onSubmit = (data: FormData) => {
    if (mode === 'create') {
      createMutation.mutate();
    } else {
      if (!data.productId.trim()) {
        showError('Product ID is required for updates');
        return;
      }
      updateMutation.mutate(data.productId.trim());
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormRadioGroup
          control={control}
          name="mode"
          options={[
            { value: 'create', label: 'Create New Product' },
            { value: 'update', label: 'Update Existing Product' },
          ]}
          direction="horizontal"
        />

        {mode === 'update' && (
          <div className="flex-1">
            <FormInput
              control={control}
              name="productId"
              label="Product ID"
              placeholder="Enter product ID"
              required={mode === 'update'}
            />
          </div>
        )}

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Crawled Product Data (Preview)</h3>
          <JsonView
            src={productData}
            collapsed={true}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
            }}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading && <LoadingIcon size="md" color="white" className="mr-2" />}
            {isLoading
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
              ? 'Create Product'
              : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
