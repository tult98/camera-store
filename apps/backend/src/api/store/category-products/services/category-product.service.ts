import type { MedusaContainer } from '@medusajs/framework/types';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { PRODUCT_ATTRIBUTES_MODULE } from 'src/modules/product-attributes/index';
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
  ProductAttributesService,
  ProductProcessingContext,
} from '../types/category-products.types';
import { ProductQueryBuilderService } from './product-query-builder.service';

export class CategoryProductService {
  constructor(private container: MedusaContainer) {}

  async getProductsByCategory(params: CategoryProductsParams) {
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

    const query = resolveQueryInstance(this.container);

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
    }

    const queryFilters = ProductQueryBuilderService.buildQueryFilters(
      categoryIds,
      filters,
      productIdsByBrand
    );
    const sortOrder = ProductQueryBuilderService.buildSortOrder(order_by);
    const graphQuery = ProductQueryBuilderService.buildGraphQuery(
      queryFilters,
      sortOrder,
      context
    );

    const result = await query.graph(graphQuery);
    let products = (result.data || []) as Product[];

    products = await this.attachProductAttributes(products);

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

  private async attachProductAttributes(
    products: Product[]
  ): Promise<Product[]> {
    try {
      const logger = this.container.resolve(ContainerRegistrationKeys.LOGGER);
      const productAttributesService = this.container.resolve(
        PRODUCT_ATTRIBUTES_MODULE
      ) as unknown as ProductAttributesService;

      const productIds = products.map((p: Product) => p.id);
      const productAttributes =
        await productAttributesService.listProductAttributes({
          product_id: productIds,
        });

      logger.debug(`Retrieved ${productAttributes.length} product attributes`);

      const attributesMap = new Map<string, Record<string, unknown>>();
      for (const attr of productAttributes) {
        attributesMap.set(attr.product_id, attr.attribute_values || {});
      }

      return products.map((product: Product) => ({
        ...product,
        product_attributes: attributesMap.get(product.id) || {},
      }));
    } catch (error) {
      const logger = this.container.resolve(ContainerRegistrationKeys.LOGGER);
      logger.error(
        `Error handling product attributes: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return products;
    }
  }
}
