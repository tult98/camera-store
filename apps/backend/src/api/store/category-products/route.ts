import type { CategoryProductsRequest } from '@camera-store/shared-types';
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { MedusaError } from '@medusajs/framework/utils';

import { getRegionAndCurrencyFromHeaders } from 'src/utils/headers';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/utils/pagination';
import { getProductsByCategoryFn } from './services/category-product.service';
import type { CategoryProductsParams } from './types/category-products.types';
import { CategoryProductsValidator } from './validation/category-products.validator';

export async function POST(
  req: MedusaRequest<CategoryProductsRequest>,
  res: MedusaResponse
) {
  const requestData = req.validatedBody as CategoryProductsRequest;
  const { regionId, currencyCode } = getRegionAndCurrencyFromHeaders(
    req.headers
  );

  if (!regionId || !currencyCode) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'region_id and currency_code headers are required'
    );
  }

  const {
    category_id,
    page = DEFAULT_PAGE,
    page_size = DEFAULT_PAGE_SIZE,
    order_by = '-created_at',
    filters = {},
    search_query,
    brand_id,
  } = requestData;

  const sanitizedSearchQuery =
    CategoryProductsValidator.sanitizeSearchQuery(search_query);

  const params: CategoryProductsParams = {
    category_id,
    page,
    page_size,
    order_by,
    filters,
    search_query: sanitizedSearchQuery,
    region_id: regionId,
    currency_code: currencyCode,
    brand_id,
  };

  const result = await getProductsByCategoryFn(req.scope, params);

  res.status(200).json(result);
}
