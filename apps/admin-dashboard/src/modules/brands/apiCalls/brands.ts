import { sdk } from '@modules/shared/api/medusa-client';
import type { Brand, BrandSchemaType } from '../types';

interface FetchBrandsResponse {
  brands: Brand[];
  count: number;
  limit: number;
  offset: number;
}

export const fetchBrands = async (
  query: string = '',
  limit: number = 100,
  offset: number = 0
): Promise<FetchBrandsResponse> => {
  const response = await sdk.client.fetch<FetchBrandsResponse>(
    '/admin/brands',
    {
      method: 'GET',
      query: {
        q: query,
        limit,
        offset,
      },
    }
  );

  return response;
};

export const fetchBrandById = async (id: string): Promise<Brand> => {
  const response = await sdk.client.fetch<{ brand: Brand }>(
    `/admin/brands/${id}`,
    {
      method: 'GET',
    }
  );

  return response.brand;
};

export const createBrand = async (data: BrandSchemaType): Promise<Brand> => {
  const response = await sdk.client.fetch<{ brand: Brand }>(
    '/admin/brands',
    {
      method: 'POST',
      body: data,
    }
  );

  return response.brand;
};

export const updateBrand = async (
  id: string,
  data: BrandSchemaType
): Promise<Brand> => {
  const response = await sdk.client.fetch<{ brand: Brand }>(
    `/admin/brands/${id}`,
    {
      method: 'PUT',
      body: data,
    }
  );

  return response.brand;
};

export const deleteBrand = async (id: string): Promise<void> => {
  await sdk.client.fetch(`/admin/brands/${id}`, {
    method: 'DELETE',
  });
};
