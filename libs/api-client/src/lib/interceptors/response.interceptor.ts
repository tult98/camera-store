import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { TokenCallbacks, AuthEventCallbacks } from '../types';
import type { RefreshManager } from '../refresh/refresh-manager';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function createResponseInterceptor(
  axiosInstance: AxiosInstance,
  refreshManager: RefreshManager,
  tokenCallbacks: TokenCallbacks,
  authEventCallbacks: AuthEventCallbacks
) {
  return async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      await tokenCallbacks.setAccessToken(null);
      authEventCallbacks.onRefreshFailed?.(new Error('Token refresh failed'));
      authEventCallbacks.onLogout?.();
      return Promise.reject(error);
    }

    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newConfig = await refreshManager.queueRequest(originalRequest);
      return axiosInstance(newConfig);
    } catch (refreshError) {
      await tokenCallbacks.setAccessToken(null);
      authEventCallbacks.onRefreshFailed?.(refreshError as Error);
      authEventCallbacks.onLogout?.();
      return Promise.reject(refreshError);
    }
  };
}

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  const authPaths = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];
  return authPaths.some((path) => url.includes(path));
}
