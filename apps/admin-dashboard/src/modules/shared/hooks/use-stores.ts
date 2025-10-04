import { sdk } from '@/modules/shared/api/medusa-client';
import { useQuery } from '@tanstack/react-query';

export const useStores = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => await sdk.admin.store.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth failures
  });

  const defaultStore = data?.stores?.[0] || null;
  const defaultCurrencyCode =
    defaultStore?.supported_currencies?.[0]?.currency_code || 'php';
  const defaultSalesChannelId = defaultStore?.default_sales_channel_id || null;

  return {
    data,
    isLoading,
    defaultStore,
    defaultCurrencyCode,
    defaultSalesChannelId,
  };
};
