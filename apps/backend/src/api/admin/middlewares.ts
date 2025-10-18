import { MiddlewareRoute } from '@medusajs/framework';
import {
  getBrandsMiddlewareRoute,
  postBrandsMiddlewareRoute,
} from 'src/api/admin/brands/middleware';

export const adminMiddlewares: MiddlewareRoute[] = [
  postBrandsMiddlewareRoute,
  getBrandsMiddlewareRoute,
];
