import { Brand } from '@/modules/brands/types';
import { transformDataToUpdateProductPayload } from '@/modules/products/apiCalls/products';
import { sdk } from '@/modules/shared/api/medusa-client';
import { useStores } from '@/modules/shared/hooks/use-stores';
import { useToast } from '@/modules/shared/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminUpdateProduct } from '@medusajs/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { fetchBrands } from '../../../brands/apiCalls/brands';
import { fetchCategories } from '../../../categories/apiCalls/categories';
import type { SelectOption } from '../../../shared/components/ui/form-input/form-select';
import { FormSelect } from '../../../shared/components/ui/form-input/form-select';
import { LoadingIcon } from '../../../shared/components/ui/loading-icon';
import {
  productSchema,
  ProductWithBrand,
  type ProductSchemaType,
} from '../../types';
import { VariantList } from './organization-variants-step/variant-list';

interface OrganizationVariantsStepProps {
  brand?: Brand | null;
  onNext?: () => void;
  onBack?: () => void;
  product: ProductWithBrand | null;
}

const statusOptions: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'proposed', label: 'Proposed' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
];

const getFormDefaultValues = (
  initialValues: ProductWithBrand | null,
  defaultSalesChannelId: string | null,
  defaultCurrencyCode: string
): Partial<ProductSchemaType> => ({
  title: initialValues?.title,
  status:
    (initialValues?.status as
      | 'draft'
      | 'proposed'
      | 'published'
      | 'rejected') || 'published',
  category_ids: initialValues?.categories?.map((cat) => cat.id) || [],
  sales_channels: defaultSalesChannelId ? [{ id: defaultSalesChannelId }] : [],
  additional_data: {
    brand_id: initialValues?.brand?.id,
  },
  variants:
    initialValues?.variants?.map((variant) => ({
      title: variant.title || '',
      prices: variant.prices?.map((price) => ({
        amount: price.amount,
        currency_code: price.currency_code,
      })) || [{ amount: 0, currency_code: defaultCurrencyCode }],
      options:
        variant.options?.reduce((acc, opt) => {
          if (opt.option?.title) {
            acc[opt.option.title] = opt.value;
          }
          return acc;
        }, {} as Record<string, string>) || {},
    })) || [],
});

export const OrganizationVariantsStep: React.FC<
  OrganizationVariantsStepProps
> = ({ product, brand, onNext, onBack }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { defaultSalesChannelId, defaultCurrencyCode } = useStores();

  const { control, handleSubmit, setValue } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(
      product
        ? { ...product, brand, variants: product.variants ?? null }
        : null,
      defaultSalesChannelId,
      defaultCurrencyCode
    ),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  useEffect(() => {
    if (!product && defaultSalesChannelId) {
      setValue('sales_channels', [{ id: defaultSalesChannelId }]);
    }
  }, [product, defaultSalesChannelId, setValue]);

  const onAppendVariant = useCallback(() => {
    append({
      title: '',
      prices: [{ amount: 0, currency_code: defaultCurrencyCode }],
      options: {},
    });
  }, [append, defaultCurrencyCode]);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  const categoryOptions: SelectOption[] = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => fetchBrands('', 100, 0),
  });

  const brandOptions: SelectOption[] =
    brandsData?.brands.map((brand) => ({
      value: brand.id,
      label: brand.name,
    })) || [];

  const updateProductMutation = useMutation({
    mutationFn: async (data: AdminUpdateProduct) => {
      if (!product?.id) throw new Error('Product ID is required');
      return await sdk.admin.product.update(product.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Success', 'Product updated successfully');
      onNext?.();
    },
    onError: (error: Error) => {
      toast.error('Error', error.message || 'Failed to update product');
    },
  });

  const onSubmit = async (data: ProductSchemaType) => {
    const payload = transformDataToUpdateProductPayload(data);
    updateProductMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Options & Variants
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <FormSelect
              name="status"
              control={control}
              options={statusOptions}
              label="Status"
              placeholder="Select status"
            />

            <FormSelect
              name="category_ids"
              control={control}
              options={categoryOptions}
              label="Categories"
              placeholder="Select categories"
              isMulti={true}
              isClearable={true}
            />

            <FormSelect
              name="additional_data.brand_id"
              control={control}
              options={brandOptions}
              label="Brand"
              placeholder="Select brand"
              isClearable={true}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">
                Product Variants
              </h3>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 min-h-[200px]">
              <VariantList
                fields={fields}
                control={control}
                product={product}
                defaultCurrencyCode={defaultCurrencyCode}
                onAppendVariant={onAppendVariant}
                onRemoveVariant={remove}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back
              </button>
            )}
            <div className={!onBack ? 'ml-auto' : ''}>
              <button
                type="submit"
                disabled={!product || updateProductMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {updateProductMutation.isPending && (
                  <LoadingIcon size="sm" color="white" className="mr-2" />
                )}
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
