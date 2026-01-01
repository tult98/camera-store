import { sdk } from '@/modules/shared/api/medusa-client';
import { generateHandle } from '@/modules/shared/utils/formatters';
import { AdminCreateProductOption } from '@medusajs/types';
import type { ProductData } from '../types/crawler.types';

export interface CreateProductFromCrawlPayload {
  title: string;
  handle: string;
  description: string;
  options: AdminCreateProductOption[];
  metadata?: Record<string, unknown>;
}

export const transformProductDataToPayload = (productData: ProductData): CreateProductFromCrawlPayload => {
  return {
    title: productData.title,
    description: productData.seoDescription!,
    handle: generateHandle(productData.title),
    options: [{ title: 'Default option', values: ['Default option value'] }] as AdminCreateProductOption[],
    metadata: {
      ...productData.specs,
    },
  };
};

export const createProductFromCrawl = async (productData: ProductData) => {
  const payload = transformProductDataToPayload(productData);
  return await sdk.admin.product.create(payload);
};

export const updateProductFromCrawl = async (productId: string, productData: ProductData) => {
  const payload = transformProductDataToPayload(productData);
  return await sdk.admin.product.update(productId, {
    description: payload.description,
    metadata: payload.metadata,
  });
};
