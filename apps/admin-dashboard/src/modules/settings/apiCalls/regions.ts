import { sdk } from '@modules/shared/api/medusa-client';
import { RegionSchemaType } from '../types';

export const fetchRegions = async () => {
  const response = await sdk.admin.region.list({
    fields: '*payment_providers',
  });

  return response.regions || [];
};

export const createRegion = async (data: RegionSchemaType) => {
  const response = await sdk.admin.region.create({
    name: data.name,
    currency_code: data.currency_code,
    countries: data.countries,
    payment_providers: data.payment_providers,
  });

  return response.region;
};

export const fetchCurrencies = async () => {
  const response = await sdk.admin.currency.list();
  return response.currencies || [];
};

export const fetchPaymentProviders = async () => {
  const response = await sdk.admin.payment.listPaymentProviders();
  return response.payment_providers || [];
};
