import type { InternalAxiosRequestConfig } from 'axios';
import type { TokenCallbacks } from '../types';

export function createRequestInterceptor(tokenCallbacks: TokenCallbacks) {
  return async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await tokenCallbacks.getAccessToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  };
}
