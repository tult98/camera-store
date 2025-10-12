import { sdk } from '@modules/shared/api/medusa-client';

export const fetchRegions = async () => {
  const response = await sdk.admin.region.list({
    fields: '*payment_providers',
  });

  return response.regions || [];
};
