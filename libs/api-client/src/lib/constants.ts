export const DEFAULT_BASE_URL = 'http://localhost:3001';
export const DEFAULT_TIMEOUT = 30000;

export const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  LOGOUT_ALL: '/api/auth/logout-all',
  ME: '/api/auth/me',
} as const;
