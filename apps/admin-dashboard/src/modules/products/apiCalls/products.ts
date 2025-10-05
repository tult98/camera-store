import { sdk } from '@/modules/shared/api/medusa-client';
import {
  AdminCreateProductOption,
  ProductStatus,
} from '@medusajs/types';
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
  const options =
    formData?.options && formData.options.length > 0
      ? formData.options
      : ([
          { title: 'Default option', values: ['Default option value'] },
        ] as AdminCreateProductOption[]);

  return {
    ...formData,
    images: formData.images?.map((image) => ({ url: image.url })),
    options,
  };
};

export const transformDataToUpdateProductPayload = (
  formData: ProductSchemaType
) => {
  return {
    categories: formData.category_ids?.map((id) => ({ id })),
    status: formData.status,
    variants: formData.variants?.map((variant) => ({
      ...variant,
      manage_inventory: false,
    })),
    sales_channels: formData.sales_channels,
  };
};

export const fetchProduct = async (productId: string) => {
  return await sdk.admin.product.retrieve(productId, {
    fields: '*categories',
  });
};

export const createProduct = async (formData: ProductSchemaType) => {
  const payload = transformFormDataToPayload(formData);
  return await sdk.admin.product.create(payload);
};

export const updateProduct = async (
  productId: string,
  formData: ProductSchemaType
) => {
  const payload = {
    title: formData.title,
    subtitle: formData.subtitle,
    handle: formData.handle,
    description: formData.description,
    thumbnail: formData.thumbnail,
    images: formData.images?.map((image) => ({ url: image.url })),
    options: formData.options,
  };
  return await sdk.admin.product.update(productId, payload);
};
