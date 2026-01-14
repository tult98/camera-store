import { coreApiClient } from '@modules/shared/api/core-api-client';

export const getCurrentUser = async () => {
  return await coreApiClient.getCurrentUser();
};
