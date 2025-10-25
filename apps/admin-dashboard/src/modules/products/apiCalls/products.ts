import { sdk } from '@/modules/shared/api/medusa-client';
import { AdminCreateProductOption, ProductStatus } from '@medusajs/types';
import { ProductSchemaType, ProductWithBrand } from '../types';

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
    additional_data: formData.additional_data,
  };
};

export const fetchProduct = async (productId: string) => {
  return (await sdk.admin.product.retrieve(productId, {
    fields: '*categories,+brands.*',
  })) as unknown as { product: ProductWithBrand };
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

interface FetchProductsResponse {
  products: Awaited<ReturnType<typeof sdk.admin.product.list>>['products'];
  count: number;
  limit: number;
  offset: number;
}

export const fetchProducts = async (
  searchQuery: string = '',
  limit: number = 10,
  offset: number = 0
): Promise<FetchProductsResponse> => {
  const response = await sdk.admin.product.list({
    fields: '*variants',
    limit,
    offset,
    q: searchQuery || undefined,
  });
  return {
    products: response.products || [],
    count: response.count || 0,
    limit: response.limit || limit,
    offset: response.offset || offset,
  };
};

export const deleteProduct = async (id: string) => {
  await sdk.admin.product.delete(id);
  return { id };
};

export const updateProductMetadata = async (
  productId: string,
  metadata: Record<string, unknown>
) => {
  return await sdk.admin.product.update(productId, { metadata });
};
