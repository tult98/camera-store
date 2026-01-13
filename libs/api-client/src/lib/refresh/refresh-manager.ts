import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { TokenCallbacks, AuthEventCallbacks, RefreshResponse } from '../types';
import { RequestQueue } from './request-queue';

interface RefreshManagerConfig {
  axiosInstance: AxiosInstance;
  refreshEndpoint: string;
  tokenCallbacks: TokenCallbacks;
  authEventCallbacks: AuthEventCallbacks;
}

export class RefreshManager {
  private axiosInstance: AxiosInstance;
  private refreshEndpoint: string;
  private tokenCallbacks: TokenCallbacks;
  private authEventCallbacks: AuthEventCallbacks;
  private requestQueue: RequestQueue;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(config: RefreshManagerConfig) {
    this.axiosInstance = config.axiosInstance;
    this.refreshEndpoint = config.refreshEndpoint;
    this.tokenCallbacks = config.tokenCallbacks;
    this.authEventCallbacks = config.authEventCallbacks;
    this.requestQueue = new RequestQueue();
  }

  async queueRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.waitForRefreshAndRetry(config);
    }

    this.isRefreshing = true;
    this.refreshPromise = this.executeRefresh();

    try {
      const newToken = await this.refreshPromise;

      this.requestQueue.processAll(newToken);

      return this.updateConfigWithToken(config, newToken);
    } catch (error) {
      this.requestQueue.rejectAll(error as Error);
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async waitForRefreshAndRetry(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    return new Promise((resolve, reject) => {
      this.requestQueue.add({
        config,
        resolve: (updatedConfig) => resolve(updatedConfig),
        reject,
      });
    });
  }

  private async executeRefresh(): Promise<string> {
    try {
      const response = await this.axiosInstance.post<RefreshResponse>(
        this.refreshEndpoint,
        {},
        {
          headers: { 'X-Skip-Auth-Retry': 'true' },
        }
      );

      const newToken = response.data.accessToken;

      await this.tokenCallbacks.setAccessToken(newToken);

      this.authEventCallbacks.onTokenRefreshed?.(newToken);

      return newToken;
    } catch (error) {
      this.authEventCallbacks.onRefreshFailed?.(error as Error);
      throw error;
    }
  }

  private updateConfigWithToken(config: InternalAxiosRequestConfig, token: string): InternalAxiosRequestConfig {
    const newConfig = { ...config };
    newConfig.headers = newConfig.headers || {};
    newConfig.headers.Authorization = `Bearer ${token}`;
    return newConfig;
  }
}
