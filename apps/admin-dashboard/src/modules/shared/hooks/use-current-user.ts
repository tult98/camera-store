import { getCurrentUser } from '@modules/auth/apiCalls/user';
import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth failures
  });
};
