import { QueryContext } from "@medusajs/framework/utils";
import type { 
  QueryFilters, 
  SortOrder, 
  ApiFilters,
  ProductProcessingContext 
} from "../types/category-products.types";
import { TagFilter } from "../filters/tag-filter";

const MAX_QUERY_LIMIT = 1000;

export class ProductQueryBuilderService {
  static buildQueryFilters(
    categoryIds: string[], 
    filters: ApiFilters
  ): QueryFilters {
    const queryFilters: QueryFilters = {
      categories: {
        id: categoryIds,
      },
    };

    const tagFilter = TagFilter.buildQueryFilter(filters.tags);
    if (tagFilter) {
      queryFilters.tags = tagFilter;
    }

    return queryFilters;
  }

  static buildSortOrder(orderBy: string): SortOrder {
    const sortOrder: SortOrder = {};

    if (!orderBy) return sortOrder;

    const sortFields = orderBy.split(",");

    sortFields.forEach((field) => {
      const isDescending = field.startsWith("-");
      const fieldName = isDescending ? field.substring(1) : field;
      const direction = isDescending ? "desc" : "asc";

      switch (fieldName.trim()) {
        case "price":
          break;
        case "name":
          sortOrder["title"] = direction;
          break;
        case "created_at":
          sortOrder["created_at"] = direction;
          break;
        case "rating":
          break;
        default:
          sortOrder[fieldName.trim()] = direction;
          break;
      }
    });

    return sortOrder;
  }

  static buildGraphQuery(
    queryFilters: QueryFilters,
    sortOrder: SortOrder,
    context: ProductProcessingContext
  ) {
    return {
      entity: "product" as const,
      fields: [
        "*",
        "variants.*",
        "variants.calculated_price.*",
        "categories.*",
        "tags.*",
        "images.*",
      ],
      filters: queryFilters,
      pagination: {
        skip: 0,
        take: MAX_QUERY_LIMIT,
        order: sortOrder,
      },
      context: {
        variants: {
          calculated_price: QueryContext({
            region_id: context.region_id,
            currency_code: context.currency_code,
          }),
        },
      },
    };
  }
}