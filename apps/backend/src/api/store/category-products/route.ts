import type { CategoryProductsRequest } from '@camera-store/shared-types';
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';

import { getRegionAndCurrencyFromHeaders } from 'src/utils/headers';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/utils/pagination';
import { CategoryProductService } from './services/category-product.service';
import type { CategoryProductsParams } from './types/category-products.types';
import { CategoryProductsValidator } from './validation/category-products.validator';

export async function POST(
  req: MedusaRequest<CategoryProductsRequest>,
  res: MedusaResponse
) {
  try {
    const requestData = req.validatedBody as CategoryProductsRequest;
    const { regionId, currencyCode } = getRegionAndCurrencyFromHeaders(
      req.headers
    );

    const {
      category_id,
      page = DEFAULT_PAGE,
      page_size = DEFAULT_PAGE_SIZE,
      order_by = '-created_at',
      filters = {},
      search_query,
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
    };

    const categoryProductService = new CategoryProductService(req.scope);
    const result = await categoryProductService.getProductsByCategory(params);

    res.status(200).json(result);
  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error(`Error in POST /store/category-products: ${errorMessage}`);

    if (
      errorMessage.includes('category_id') ||
      errorMessage.includes('headers')
    ) {
      res.status(400).json({ error: errorMessage });
    } else if (
      errorMessage.includes('not found') ||
      errorMessage.includes('invalid')
    ) {
      res.status(404).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
