// Only include currently existing routes
export const PUBLIC_ROUTES = [
  '/login'
] as const;

export type PublicRoute = typeof PUBLIC_ROUTES[number];