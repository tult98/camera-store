import { createApiClient, type ApiClient } from '@camera-store/api-client';

const ACCESS_TOKEN_KEY = 'admin_access_token';

const tokenCallbacks = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string | null) => {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  },
};

let onLogoutCallback: (() => void) | null = null;

export const setOnLogoutCallback = (callback: () => void) => {
  onLogoutCallback = callback;
};

export const coreApiClient: ApiClient = createApiClient({
  baseURL: import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001',
  apiKey: import.meta.env.VITE_CORE_API_KEY,
  tokenCallbacks,
  authEventCallbacks: {
    onLogout: () => onLogoutCallback?.(),
    onRefreshFailed: () => onLogoutCallback?.(),
  },
  withCredentials: true,
});
