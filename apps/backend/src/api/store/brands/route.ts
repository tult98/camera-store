import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import {
  ContainerRegistrationKeys,
  MedusaError,
} from '@medusajs/framework/utils';
import type { GetCategoryBrandsResponse } from '@camera-store/shared-types';

import {
  getAllCategoryIds,
  resolveQueryInstance,
} from 'src/utils/category-hierarchy';

interface BrandFromQuery {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ProductWithBrands {
  id: string;
  brands?: BrandFromQuery[];
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse<GetCategoryBrandsResponse>
) {
  const { category_id } = req.query;

  if (!category_id || typeof category_id !== 'string') {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'category_id query parameter is required'
    );
  }

  const query = resolveQueryInstance(req.scope);
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);

  const categoryIds = await getAllCategoryIds(query, category_id);

  if (
    !categoryIds ||
    categoryIds.length === 0 ||
    categoryIds.some((id) => !id || typeof id !== 'string')
  ) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'Category not found or invalid'
    );
  }

  logger.debug(
    `Querying brands for ${categoryIds.length} categories: ${JSON.stringify(categoryIds)}`
  );

  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'brands.*'],
    filters: {
      categories: { id: categoryIds },
      status: 'published',
    },
  });

  const brandsMap = new Map<string, BrandFromQuery>();

  if (products && Array.isArray(products)) {
    products.forEach((product: ProductWithBrands) => {
      if (product.brands && Array.isArray(product.brands)) {
        product.brands.forEach((brand: BrandFromQuery) => {
          if (brand?.id && !brandsMap.has(brand.id)) {
            brandsMap.set(brand.id, {
              id: brand.id,
              name: brand.name,
              image_url: brand.image_url,
              created_at: brand.created_at,
              updated_at: brand.updated_at,
              deleted_at: brand.deleted_at,
            });
          }
        });
      }
    });
  }

  const brands = Array.from(brandsMap.values());

  logger.debug(`Found ${brands.length} unique brands`);

  res.json({ brands });
}
