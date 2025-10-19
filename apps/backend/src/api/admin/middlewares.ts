import { MiddlewareRoute } from '@medusajs/framework';
import {
  getBrandsMiddlewareRoute,
  postBrandsMiddlewareRoute,
  putBrandByIdMiddlewareRoute,
} from 'src/api/admin/brands/middleware';

export const adminMiddlewares: MiddlewareRoute[] = [
  postBrandsMiddlewareRoute,
  getBrandsMiddlewareRoute,
  putBrandByIdMiddlewareRoute,
];
