import { coreApiClient } from '@modules/shared/api/core-api-client';
import type { LoginSchemaType } from '../types';

export const loginUser = async (credentials: LoginSchemaType) => {
  return await coreApiClient.login(credentials.email, credentials.password);
};
