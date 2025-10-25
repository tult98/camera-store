import type { MedusaContainer } from '@medusajs/framework/types';
import { MedusaError } from '@medusajs/framework/utils';
import {
  getAllCategoryIds,
  resolveQueryInstance,
} from 'src/utils/category-hierarchy';
import { toPaginatedResponse } from 'src/utils/pagination';
import { getProductIdsByBrand } from '../filters/brand-filter';
import { FilterPipeline } from '../filters/filter-pipeline';
import type {
  CategoryProductsParams,
  Product,
  ProductProcessingContext,
} from '../types/category-products.types';
import {
  buildQueryFilters,
  buildSortOrder,
  buildGraphQuery,
} from './product-query-builder.service';

function attachProductAttributes(products: Product[]): Product[] {
  return products.map((product: Product) => {
    const { attribute_template_id: _attribute_template_id, ...attributeValues } = (product.metadata || {}) as Record<string, unknown>;

    return {
      ...product,
      product_attributes: attributeValues,
    };
  });
}

export async function getProductsByCategoryFn(
  container: MedusaContainer,
  params: CategoryProductsParams
) {
  const {
    category_id,
    page,
    page_size,
    order_by,
    filters,
    search_query,
    region_id,
    currency_code,
    brand_id,
  } = params;

  const query = resolveQueryInstance(container);

  const { itemsPerPage, offset } = {
    itemsPerPage: Math.min(Math.max(1, Number(page_size) || 24), 100),
    offset:
      (Math.max(1, Number(page) || 1) - 1) *
      Math.min(Math.max(1, Number(page_size) || 24), 100),
  };

  const categoryIds = await getAllCategoryIds(query, category_id);

  if (
    !categoryIds ||
    categoryIds.length === 0 ||
    categoryIds.some((id) => !id || typeof id !== 'string')
  ) {
    throw new Error('Category not found or invalid');
  }

  const context: ProductProcessingContext = {
    region_id,
    currency_code,
    categoryIds,
  };

  let productIdsByBrand: string[] | undefined;
  if (brand_id) {
    productIdsByBrand = await getProductIdsByBrand(query, brand_id);

    if (!productIdsByBrand || productIdsByBrand.length === 0) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Brand not found');
    }
  }

  const queryFilters = buildQueryFilters(
    categoryIds,
    filters,
    productIdsByBrand
  );
  const sortOrder = buildSortOrder(order_by);
  const graphQuery = buildGraphQuery(
    queryFilters,
    sortOrder,
    context
  );

  const result = await query.graph(graphQuery);
  let products = (result.data || []) as Product[];

  products = attachProductAttributes(products);

  const pipeline = new FilterPipeline(products);
  const { products: processedProducts, totalCount } = pipeline
    .applySearch(search_query)
    .applyPriceFilter(filters.price)
    .applyAttributeFilters(filters)
    .applySorting(order_by)
    .getResults();

  const paginatedProducts = processedProducts.slice(
    offset,
    offset + itemsPerPage
  );

  return toPaginatedResponse({
    data: paginatedProducts,
    count: totalCount,
    limit: itemsPerPage,
    offset,
  });
}
