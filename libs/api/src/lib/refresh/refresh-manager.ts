import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { TokenCallbacks, AuthEventCallbacks, RefreshResponse } from '../types';
import { createRequestQueue } from './request-queue';
import { updateConfigWithToken } from '../utils/token-utils';

interface RefreshManagerConfig {
  axiosInstance: AxiosInstance;
  refreshEndpoint: string;
  tokenCallbacks: TokenCallbacks;
  authEventCallbacks: AuthEventCallbacks;
}

export function createRefreshManager(config: RefreshManagerConfig) {
  const { axiosInstance, refreshEndpoint, tokenCallbacks, authEventCallbacks } = config;
  const requestQueue = createRequestQueue();
  let isRefreshing = false;
  let refreshPromise: Promise<string> | null = null;

  const executeRefresh = async (): Promise<string> => {
    const response = await axiosInstance.post<RefreshResponse>(
      refreshEndpoint,
      {},
      {
        headers: { 'X-Skip-Auth-Retry': 'true' },
      }
    );

    const newToken = response.data.accessToken;

    await tokenCallbacks.setAccessToken(newToken);

    authEventCallbacks.onTokenRefreshed?.(newToken);

    return newToken;
  };

  const waitForRefreshAndRetry = (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    return new Promise((resolve, reject) => {
      requestQueue.add({
        config,
        resolve: (updatedConfig) => resolve(updatedConfig),
        reject,
      });
    });
  };

  return {
    queueRequest: async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      if (isRefreshing && refreshPromise) {
        return waitForRefreshAndRetry(config);
      }

      isRefreshing = true;
      refreshPromise = executeRefresh();

      try {
        const newToken = await refreshPromise;

        requestQueue.processAll(newToken);

        return updateConfigWithToken(config, newToken);
      } catch (error) {
        requestQueue.rejectAll(error as Error);
        throw error;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    },
  };
}

export type RefreshManager = ReturnType<typeof createRefreshManager>;
