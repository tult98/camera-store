import { sdk } from '@modules/shared/api/medusa-client';

export interface ProductAttribute {
  id: string;
  product_id: string;
  template_id: string;
  attribute_values: Record<string, unknown>;
}

export interface FetchProductAttributesListResponse {
  product_attributes: ProductAttribute[];
  count: number;
  limit: number;
  offset: number;
}

export interface CreateProductAttributesPayload {
  product_id: string;
  template_id: string;
  attribute_values: Record<string, string | boolean>;
}

export interface UpdateProductAttributesPayload {
  id: string;
  product_id?: string;
  template_id?: string;
  attribute_values?: Record<string, string | boolean>;
}

export const fetchProductAttributes = async (
  productId: string
): Promise<FetchProductAttributesListResponse> => {
  const response = await sdk.client.fetch<FetchProductAttributesListResponse>(
    `/admin/product-attributes?product_id=${productId}`
  );
  return response;
};

export const createProductAttributes = async (
  payload: CreateProductAttributesPayload
) => {
  const response = await sdk.client.fetch('/admin/product-attributes', {
    method: 'POST',
    body: payload,
  });

  return response;
};

export const updateProductAttributes = async (
  payload: UpdateProductAttributesPayload
) => {
  const { id, ...updateData } = payload;
  const response = await sdk.client.fetch(`/admin/product-attributes/${id}`, {
    method: 'PUT',
    body: updateData,
  });

  return response;
};
