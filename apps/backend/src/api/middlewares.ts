import {
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from '@medusajs/framework';
import {
  defineMiddlewares,
  validateAndTransformBody,
} from '@medusajs/framework/http';
import express from 'express';
import path from 'path';
import { PostAdminCreateBannerSchema } from 'src/api/admin/banners/validators';
import { CategoryProductsSchema } from './store/category-products/route';

const staticMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  // Serve static files from the /static directory
  const staticPath = path.join(process.cwd(), 'static');
  return express.static(staticPath)(req as any, res as any, next);
};

export default defineMiddlewares({
  routes: [
    {
      matcher: '/static/*',
      middlewares: [staticMiddleware],
    },
    {
      matcher: '/store/category-products',
      method: 'POST',
      middlewares: [validateAndTransformBody(() => CategoryProductsSchema)],
    },
    {
      matcher: '/admin/banners',
      method: 'POST',
      middlewares: [validateAndTransformBody(PostAdminCreateBannerSchema)],
    },
  ],
});
