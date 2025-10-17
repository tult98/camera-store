import { MiddlewareRoute, validateAndTransformBody } from '@medusajs/framework';
import { PostCategoryProductsSchema } from 'src/api/store/category-products/validators';

export const categoryProductsMiddlewareRoute: MiddlewareRoute = {
  matcher: '/store/category-products',
  middlewares: [validateAndTransformBody(PostCategoryProductsSchema)],
};
