export const JWT_ISSUER = 'core-api';
// Short-lived (15 min) to limit token compromise impact
export const ACCESS_TOKEN_EXPIRY = '15m';
// Long-lived (7 days) for seamless re-authentication
export const REFRESH_TOKEN_EXPIRY = '7d';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
