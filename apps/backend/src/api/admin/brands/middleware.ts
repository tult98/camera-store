import {
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery,
} from '@medusajs/framework/http';
import {
  GetBrandsQuerySchema,
  PostCreateBrandSchema,
} from 'src/api/admin/brands/validators';

export const postBrandsMiddlewareRoute: MiddlewareRoute = {
  matcher: '/admin/brands',
  method: 'POST',
  middlewares: [validateAndTransformBody(PostCreateBrandSchema)],
};

export const getBrandsMiddlewareRoute: MiddlewareRoute = {
  matcher: '/admin/brands',
  method: 'GET',
  middlewares: [validateAndTransformQuery(GetBrandsQuerySchema, {})],
};
