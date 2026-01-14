import type { InternalAxiosRequestConfig } from 'axios';

export function updateConfigWithToken(config: InternalAxiosRequestConfig, token: string): InternalAxiosRequestConfig {
  const newConfig = { ...config };
  newConfig.headers = newConfig.headers || {};
  newConfig.headers.Authorization = `Bearer ${token}`;
  return newConfig;
}
