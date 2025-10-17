export const getRegionAndCurrencyFromHeaders = (
  headers: Record<string, unknown>
) => {
  // Since we have a middleware that validates the headers, we can safely cast them to strings
  const regionId = headers.region_id as string;
  const currencyCode = headers.currency_code as string;

  return { regionId, currencyCode };
};
