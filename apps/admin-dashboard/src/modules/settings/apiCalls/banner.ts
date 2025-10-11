import { sdk } from '@modules/shared/api/medusa-client';
import type { Banner, BannerSchemaType } from '../types';

export const fetchBanner = async () => {
  const response = await sdk.client.fetch<{ banner: Banner | null }>(
    '/admin/banners',
    {
      method: 'GET',
    }
  );
  return response.banner;
};

export const saveBanner = async (data: BannerSchemaType) => {
  const payload = {
    images: data.images.map((img) => img.url),
    is_active: data.is_active,
  };

  const response = await sdk.client.fetch<{ banner: Banner }>(
    '/admin/banners',
    {
      method: 'POST',
      body: payload,
    }
  );
  return response.banner;
};
