import { sdk } from '@modules/shared/api/medusa-client';

export const logoutUser = async () => {
  return await sdk.auth.logout();
};