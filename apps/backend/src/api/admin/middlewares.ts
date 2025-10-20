import { MiddlewareRoute } from '@medusajs/framework';
import {
  getBrandsMiddlewareRoute,
  postBrandsMiddlewareRoute,
  putBrandByIdMiddlewareRoute,
} from 'src/api/admin/brands/middleware';
import { z } from 'zod';

export const adminMiddlewares: MiddlewareRoute[] = [
  postBrandsMiddlewareRoute,
  getBrandsMiddlewareRoute,
  putBrandByIdMiddlewareRoute,
  {
    matcher: '/admin/products/:id',
    method: 'POST',
    additionalDataValidator: {
      brand_id: z.string().optional(),
    },
  },
];
