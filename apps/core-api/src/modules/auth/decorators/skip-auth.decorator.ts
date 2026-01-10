import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_KEY = 'skipAuth';
/**
 * Decorator to mark a route handler or controller as public by skipping
 * authentication guards. Use this for endpoints that must be accessible
 * without a valid user session or token, such as login, token refresh,
 * logout, health checks, or other public API routes.
 */
export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
