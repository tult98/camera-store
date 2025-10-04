import { sdk } from '@modules/shared/api/medusa-client';

export interface CreateProductAttributesPayload {
  product_id: string;
  template_id: string;
  attribute_values: Record<string, string | boolean>;
}

export const createProductAttributes = async (
  payload: CreateProductAttributesPayload
) => {
  const response = await sdk.client.fetch('/admin/product-attributes', {
    method: 'POST',
    body: payload,
  });

  return response;
};
