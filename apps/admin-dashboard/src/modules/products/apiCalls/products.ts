import { sdk } from '@/modules/shared/api/medusa-client';
import { AdminCreateProductOption, ProductStatus } from '@medusajs/types';
import { ProductSchemaType } from '../types';

export interface CreateProductPayload {
  title: string;
  subtitle?: string;
  handle?: string;
  description?: string;
  status?: ProductStatus;
  thumbnail?: string;
  images?: Array<{ url: string }>;
  categories?: Array<{ id: string }>;
  options: AdminCreateProductOption[];
}

export const transformFormDataToPayload = (
  formData: ProductSchemaType
): CreateProductPayload => {
  const { category_ids, ...rest } = formData;

  return {
    ...rest,
    categories: category_ids?.map((id) => ({ id })),
    images: rest.images?.map((image) => ({ url: image.url })),
    options: rest.options || [],
  };
};

export const createProduct = async (formData: ProductSchemaType) => {
  const payload = transformFormDataToPayload(formData);
  return await sdk.admin.product.create(payload);
};
