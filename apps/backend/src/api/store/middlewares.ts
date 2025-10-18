import { MiddlewareRoute } from '@medusajs/framework/http';
import { categoryProductsMiddlewareRoute } from 'src/api/store/category-products/middleware';

// NOTE: Will add this back later.
// const regionCurrencyGuardMiddleware = (
//   req: MedusaRequest,
//   res: MedusaResponse,
//   next: MedusaNextFunction
// ) => {
//   const regionId = req.headers['region_id'] as string;
//   const currencyCode = req.headers['currency_code'] as string;

//   if (!regionId || !currencyCode) {
//     throw new MedusaError(
//       MedusaError.Types.INVALID_DATA,
//       'region_id and currency_code are required'
//     );
//   }

//   next();
// };

export const storeMiddlewares: MiddlewareRoute[] = [
  // {
  //   matcher: '/store/*',
  //   middlewares: [regionCurrencyGuardMiddleware],
  // },
  categoryProductsMiddlewareRoute,
];
