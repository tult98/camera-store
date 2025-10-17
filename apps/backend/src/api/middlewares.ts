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
import { storeMiddlewares } from 'src/api/store/middlewares';

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
    ...storeMiddlewares,
    {
      matcher: '/static/*',
      middlewares: [staticMiddleware],
    },
    {
      matcher: '/admin/banners',
      method: 'POST',
      middlewares: [validateAndTransformBody(PostAdminCreateBannerSchema)],
    },
  ],
});
