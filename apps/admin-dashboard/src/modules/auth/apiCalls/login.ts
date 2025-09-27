import { sdk } from '@modules/shared/api/medusa-client';
import type { LoginSchemaType } from '../types';

export const loginUser = async (credentials: LoginSchemaType) => {
  return await sdk.auth.login('user', 'emailpass', credentials);
};
