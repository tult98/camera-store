import { sdk } from '@modules/shared/api/medusa-client';

export const getCurrentUser = async () => {
  return await sdk.admin.user.me();
};
