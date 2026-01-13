import axios from 'axios';
import type { ApiClient, ApiClientConfig, LoginResponse } from './types';
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT, ENDPOINTS } from './constants';
import { createRequestInterceptor } from './interceptors/request.interceptor';
import { createResponseInterceptor } from './interceptors/response.interceptor';
import { RefreshManager } from './refresh/refresh-manager';

export function createApiClient(config: ApiClientConfig): ApiClient {
  const {
    baseURL = DEFAULT_BASE_URL,
    timeout = DEFAULT_TIMEOUT,
    apiKey,
    tokenCallbacks,
    authEventCallbacks = {},
    refreshEndpoint = ENDPOINTS.REFRESH,
    withCredentials = true,
  } = config;

  const instance = axios.create({
    baseURL,
    timeout,
    withCredentials,
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey && { 'x-api-key': apiKey }),
    },
  });

  const refreshManager = new RefreshManager({
    axiosInstance: instance,
    refreshEndpoint,
    tokenCallbacks,
    authEventCallbacks,
  });

  instance.interceptors.request.use(createRequestInterceptor(tokenCallbacks), (error) => Promise.reject(error));

  instance.interceptors.response.use(
    (response) => response,
    createResponseInterceptor(instance, refreshManager, tokenCallbacks, authEventCallbacks)
  );

  const client = instance as ApiClient;

  client.login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await instance.post<LoginResponse>(ENDPOINTS.LOGIN, { email, password });
    await tokenCallbacks.setAccessToken(response.data.accessToken);
    authEventCallbacks.onTokenRefreshed?.(response.data.accessToken);
    return response.data;
  };

  client.logout = async (): Promise<void> => {
    try {
      await instance.post(ENDPOINTS.LOGOUT);
    } finally {
      await tokenCallbacks.setAccessToken(null);
      authEventCallbacks.onLogout?.();
    }
  };

  client.logoutAll = async () => {
    const response = await instance.post<{ message: string; revokedCount: number }>(ENDPOINTS.LOGOUT_ALL);
    await tokenCallbacks.setAccessToken(null);
    authEventCallbacks.onLogout?.();
    return response.data;
  };

  client.getCurrentUser = async () => {
    const response = await instance.get<{ userId: string; email: string }>(ENDPOINTS.ME);
    return response.data;
  };

  return client;
}
