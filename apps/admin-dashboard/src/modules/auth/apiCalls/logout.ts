import { coreApiClient } from '@modules/shared/api/core-api-client';

export const logoutUser = async () => {
  return await coreApiClient.logout();
};
