import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface TokenCallbacks {
  getAccessToken: () => string | null | Promise<string | null>;
  setAccessToken: (token: string | null) => void | Promise<void>;
}

export interface AuthEventCallbacks {
  onTokenRefreshed?: (newToken: string) => void;
  onRefreshFailed?: (error: Error) => void;
  onLogout?: () => void;
}

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  apiKey?: string;
  tokenCallbacks: TokenCallbacks;
  authEventCallbacks?: AuthEventCallbacks;
  refreshEndpoint?: string;
  withCredentials?: boolean;
}

export interface ApiClient extends AxiosInstance {
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<{ message: string; revokedCount: number }>;
  getCurrentUser: () => Promise<User>;
}

export interface QueuedRequest {
  config: InternalAxiosRequestConfig;
  resolve: (value: InternalAxiosRequestConfig) => void;
  reject: (error: Error) => void;
}
