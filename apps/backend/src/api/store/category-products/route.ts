import type { CategoryProductsRequest } from "@camera-store/shared-types";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import type { CategoryProductsParams } from "./types/category-products.types";
import { CategoryProductsValidator, CategoryProductsSchema } from "./validation/category-products.validator";
import { CategoryProductService } from "./services/category-product.service";

export { CategoryProductsSchema };

export async function POST(
  req: MedusaRequest<CategoryProductsRequest>,
  res: MedusaResponse
): Promise<void> {
  try {
    const requestData = req.validatedBody as CategoryProductsRequest;

    const {
      category_id,
      page = 1,
      page_size = 24,
      order_by = "-created_at",
      filters = {},
      search_query,
    } = requestData;

    const sanitizedCategoryId = CategoryProductsValidator.validateCategoryId(category_id);
    const { region_id, currency_code } = CategoryProductsValidator.validateHeaders(req.headers);
    const sanitizedSearchQuery = CategoryProductsValidator.sanitizeSearchQuery(search_query);

    const params: CategoryProductsParams = {
      category_id: sanitizedCategoryId,
      page,
      page_size,
      order_by,
      filters,
      search_query: sanitizedSearchQuery,
      region_id,
      currency_code,
    };

    const categoryProductService = new CategoryProductService(req.scope);
    const result = await categoryProductService.getProductsByCategory(params);

    res.status(200).json(result);
  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error(`Error in POST /store/category-products: ${errorMessage}`);

    if (errorMessage.includes("category_id") || errorMessage.includes("headers")) {
      res.status(400).json({ error: errorMessage });
    } else if (errorMessage.includes("not found") || errorMessage.includes("invalid")) {
      res.status(404).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
