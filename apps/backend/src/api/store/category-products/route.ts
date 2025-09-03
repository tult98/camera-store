import type { CategoryProductsRequest } from "@camera-store/shared-types";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";
import { PRODUCT_ATTRIBUTES_MODULE } from "src/modules/product-attributes/index";
import {
  getAllCategoryIds,
  resolveQueryInstance,
} from "src/utils/category-hierarchy";
import { toPaginatedResponse } from "src/utils/pagination";
import { z } from "zod";

// Constants
const MAX_QUERY_LIMIT = 1000; // Prevent DoS attacks with large queries
const CENTS_TO_DOLLARS = 100;

// TypeScript Interfaces
interface ProductVariant {
  id: string;
  calculated_price?: {
    calculated_amount?: number | null;
  };
}

interface Product {
  id: string;
  title: string;
  created_at: string;
  variants?: ProductVariant[];
  categories?: Array<{ id: string }>;
  tags?: Array<{ value: string }>;
  images?: Array<{ url: string }>;
}

interface ProductAttributesService {
  listProductAttributes(params: { product_id: string[] }): Promise<Array<{
    product_id: string;
    attribute_values: Record<string, unknown>;
  }>>;
}

interface QueryFilters {
  categories?: {
    id: string[];
  };
  tags?: {
    value: string[];
  };
}

interface SortOrder {
  [key: string]: "asc" | "desc" | SortOrder;
}


interface PriceFilter {
  min?: number;
  max?: number;
}

/**
 * Filters products by price range
 */
function filterProductsByPrice(
  products: Product[],
  priceFilter: PriceFilter | undefined
): Product[] {
  if (
    !priceFilter ||
    (priceFilter.min === undefined && priceFilter.max === undefined)
  ) {
    return products;
  }

  const minPrice = priceFilter.min
    ? priceFilter.min * CENTS_TO_DOLLARS
    : undefined;
  const maxPrice = priceFilter.max
    ? priceFilter.max * CENTS_TO_DOLLARS
    : undefined;

  return products.filter((product: Product) => {
    if (!product.variants || product.variants.length === 0) return false;

    return product.variants.some((variant: ProductVariant) => {
      const price = variant.calculated_price?.calculated_amount;
      if (price === null || price === undefined) return false;

      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;

      return true;
    });
  });
}

/**
 * Sorts products by price
 */
function sortProductsByPrice(
  products: Product[],
  descending: boolean
): Product[] {
  return [...products].sort((a: Product, b: Product) => {
    const aPrice = Math.min(
      ...(a.variants || []).map(
        (v: ProductVariant) => v.calculated_price?.calculated_amount || Infinity
      )
    );
    const bPrice = Math.min(
      ...(b.variants || []).map(
        (v: ProductVariant) => v.calculated_price?.calculated_amount || Infinity
      )
    );

    if (aPrice === Infinity && bPrice === Infinity) return 0;
    if (aPrice === Infinity) return 1;
    if (bPrice === Infinity) return -1;

    return descending ? bPrice - aPrice : aPrice - bPrice;
  });
}

/**
 * Filters products by search query
 * Searches only in product titles for simplicity and performance
 */
function filterProductsBySearch(
  products: Product[],
  searchQuery: string | undefined
): Product[] {
  if (!searchQuery || searchQuery.trim() === "") {
    return products;
  }

  // Sanitize search query to prevent XSS and limit length
  const sanitizedQuery = searchQuery
    .toLowerCase()
    .trim()
    .replace(/[<>"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 100); // Limit length to prevent DoS
  
  if (sanitizedQuery.length === 0) {
    return products;
  }
  
  // Filter by product title only
  return products.filter((product: Product) => 
    product.title && product.title.toLowerCase().includes(sanitizedQuery)
  );
}


export const CategoryProductsSchema = z
  .object({
    category_id: z.string().min(1, "category_id is required").max(100),
    page: z.number().int().positive().default(1),
    page_size: z.number().int().positive().max(100).default(24),
    order_by: z.string().max(100).default("-created_at"),
    filters: z.record(z.string(), z.any()).optional().default({}),
    search_query: z.string().max(100).optional(),
  })
  .refine(
    (data) => {
      // Validate filter structure
      if (data.filters) {
        // Check for reasonable filter count to prevent DoS
        const filterCount = Object.keys(data.filters).length;
        if (filterCount > 20) return false;

        // Validate price filter if present
        if (data.filters["price"]) {
          if (typeof data.filters["price"] !== "object") return false;
          const price = data.filters["price"] as PriceFilter;
          if (
            price.min !== undefined &&
            (typeof price.min !== "number" || price.min < 0)
          )
            return false;
          if (
            price.max !== undefined &&
            (typeof price.max !== "number" || price.max < 0)
          )
            return false;
          if (
            price.min !== undefined &&
            price.max !== undefined &&
            price.min > price.max
          )
            return false;
        }

        // Validate array filters
        for (const [key, value] of Object.entries(data.filters)) {
          if (key === "price") continue;
          if (Array.isArray(value)) {
            // Limit array size to prevent DoS
            if (value.length > 100) return false;
            // Ensure all values are strings
            if (!value.every((v) => typeof v === "string" && v.length < 200))
              return false;
          }
        }
      }
      return true;
    },
    {
      message: "Invalid filter structure or values",
    }
  );

/**
 * Handles product listing by category with advanced filtering and sorting
 *
 * @route POST /store/category-products
 *
 * Features:
 * - Hierarchical category support (includes child categories)
 * - Dynamic attribute filtering (brand, sensor type, etc.)
 * - Price range filtering
 * - Multiple sort options (price, name, created_at, popularity)
 * - Pagination support
 *
 * Performance optimizations:
 * - Query limit capped at 1000 products
 * - In-memory filtering for computed fields (price)
 * - Efficient attribute matching using Set operations
 *
 * Security:
 * - Input validation via Zod schema
 * - Filter count limits to prevent DoS
 * - Sanitized category IDs
 * - Array size limits for filter values
 */
export async function POST(
  req: MedusaRequest<CategoryProductsRequest>,
  res: MedusaResponse
): Promise<void> {
  const requestData = req.validatedBody;

  const {
    category_id,
    page = 1,
    page_size = 24,
    order_by = "-created_at",
    filters = {},
    search_query,
  } = requestData as CategoryProductsRequest;

  if (
    !category_id ||
    typeof category_id !== "string" ||
    category_id.trim() === ""
  ) {
    res.status(400).json({
      error: "Valid category_id is required",
    });
    return;
  }

  // Sanitize category_id
  const sanitizedCategoryId = category_id.trim();

  try {
    // Get region_id and currency_code from request headers
    const region_id = req.headers["region_id"] as string;
    const currency_code = req.headers["currency_code"] as string;

    if (!region_id || !currency_code) {
      res.status(400).json({
        error: "region_id and currency_code headers are required",
      });
      return;
    }

    const query = resolveQueryInstance(req.scope);

    // Validate pagination parameters
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(Math.max(1, Number(page_size) || 24), 100); // Cap at 100 items per page
    const offset = (currentPage - 1) * itemsPerPage;

    // Get all child categories recursively
    const categoryIds = await getAllCategoryIds(query, sanitizedCategoryId);

    // Validate that we have at least one category ID and they are all valid strings
    if (
      !categoryIds ||
      categoryIds.length === 0 ||
      categoryIds.some((id) => !id || typeof id !== "string")
    ) {
      res.status(404).json({
        error: "Category not found or invalid",
      });
      return;
    }

    // Build query filters
    const queryFilters: QueryFilters = {
      categories: {
        id: categoryIds,
      },
    };

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      queryFilters["tags"] = {
        value: filters.tags,
      };
    }

    // Note: Price filtering will be done in-memory after fetching products
    // because calculated_price is not a database field but a computed field

    // Build sorting from order_by string (e.g., "-price,name,created_at")
    const orderBy: SortOrder = {};

    if (order_by) {
      // Split by comma to get individual fields
      const sortFields = order_by.split(",");

      sortFields.forEach((field) => {
        // Check if field starts with "-" for descending order
        const isDescending = field.startsWith("-");
        const fieldName = isDescending ? field.substring(1) : field;
        const direction = isDescending ? "desc" : "asc";

        switch (fieldName.trim()) {
          case "price":
            // Price sorting will be done in-memory after fetching
            // because calculated_price is not a database field
            break;
          case "name":
            orderBy["title"] = direction;
            break;
          case "created_at":
            orderBy["created_at"] = direction;
            break;
          case "rating":
            // Skip rating sorting as it's not supported
            break;
          default:
            // For any other field, use it directly
            orderBy[fieldName.trim()] = direction;
            break;
        }
      });
    }

    // Query products with calculated prices (without pagination initially)
    const result = await query.graph({
      entity: "product",
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
        take: MAX_QUERY_LIMIT, // Limit to prevent DoS attacks
        order: orderBy,
      },
      context: {
        variants: {
          calculated_price: QueryContext({
            region_id: region_id,
            currency_code: currency_code,
          }),
        },
      },
    });

    let products = (result.data || []) as Product[];
    let totalCount = products.length;

    // Apply search filter first (text search)
    products = filterProductsBySearch(products, search_query);
    totalCount = products.length;

    // Apply price filters in-memory (since calculated_price is a computed field)
    products = filterProductsByPrice(products, filters.price as PriceFilter);
    totalCount = products.length;

    // Apply product attribute filters (all facets come from product attributes)
    // Look for attribute filters in the root level of filters object
    const attributeFilters = Object.entries(filters).filter(
      ([key]) => key !== "tags" && key !== "availability" && key !== "price"
    );

    if (attributeFilters.length > 0) {
      try {
        const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
        const productAttributesService = req.scope.resolve(
          PRODUCT_ATTRIBUTES_MODULE
        ) as ProductAttributesService;

        const productIds = products.map((p: Product) => p.id);
        const productAttributes = await productAttributesService.listProductAttributes({
          product_id: productIds,
        });

        logger.debug(`Retrieved ${productAttributes.length} product attributes`);

        // Build a map of products that match each filter
        const filterMatches = new Map<string, Set<string>>();

        for (const [attributeKey, attributeValues] of attributeFilters) {
          if (
            !attributeValues ||
            !Array.isArray(attributeValues) ||
            attributeValues.length === 0
          ) {
            continue;
          }

          const matchingProducts = new Set<string>();

          for (const productAttribute of productAttributes) {
            const attributeData = productAttribute.attribute_values || {};
            const productValue = attributeData[attributeKey];

            if (productValue && attributeValues.includes(String(productValue))) {
              matchingProducts.add(productAttribute.product_id);
            }
          }

          filterMatches.set(attributeKey, matchingProducts);
        }

        // Find products that match ALL attribute filters (intersection)
        let filteredProductIds = new Set<string>();
        let isFirstFilter = true;

        for (const [, matchingProducts] of filterMatches) {
          if (isFirstFilter) {
            filteredProductIds = new Set(matchingProducts);
            isFirstFilter = false;
          } else {
            filteredProductIds = new Set(
              [...filteredProductIds].filter((id) => matchingProducts.has(id))
            );
          }
        }

        products = products.filter((p: Product) => filteredProductIds.has(p.id));
        totalCount = products.length;
      } catch (error) {
        const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
        logger.error(
          `Error filtering by product attributes: ${error instanceof Error ? error.message : String(error)}`
        );
        // Continue with original products if attribute filtering fails
      }
    }

    // Apply in-memory price sorting if requested
    if (order_by && order_by.includes("price")) {
      const isPriceDescending = order_by.includes("-price");
      products = sortProductsByPrice(products, isPriceDescending);
    }

    // Apply manual pagination after all filtering and sorting
    const paginatedProducts = products.slice(offset, offset + itemsPerPage);

    const paginatedResponse = toPaginatedResponse(
      paginatedProducts,
      totalCount,
      itemsPerPage,
      offset
    );

    res.status(200).json(paginatedResponse);
  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
    logger.error(
      `Error in POST /store/category-products for category ${sanitizedCategoryId}: ${error instanceof Error ? error.message : String(error)}`
    );
    res.status(500).json({
      error: "Internal server error",
    });
  }
}
