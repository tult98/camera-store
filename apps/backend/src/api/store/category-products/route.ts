import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";
import { z } from "zod";
import type { CategoryProductsRequest } from "@camera-store/shared-types";
import { toPaginatedResponse } from "src/utils/pagination";
import { getAllCategoryIds, resolveQueryInstance } from "src/utils/category-hierarchy";
import { PRODUCT_ATTRIBUTES_MODULE } from "src/modules/product-attributes/index";

export const CategoryProductsSchema = z.object({
  category_id: z.string().min(1, "category_id is required"),
  page: z.number().int().positive().default(1),
  page_size: z.number().int().positive().max(100).default(24),
  order_by: z.string().default("-created_at"),
  filters: z
    .object({
      tags: z.array(z.string()).optional(),
      availability: z.array(z.enum(["in-stock", "out-of-stock"])).optional(),
      price: z
        .object({
          min: z.number().min(0).optional(),
          max: z.number().min(0).optional(),
        })
        .optional(),
      metadata: z.record(z.string(), z.array(z.string())).optional(),
    })
    .optional()
    .default({}),
});

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
    const queryFilters: Record<string, any> = {
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

    // Apply price filters on calculated_price
    if (filters.price?.min !== undefined || filters.price?.max !== undefined) {
      queryFilters["variants"] = queryFilters["variants"] || {};
      queryFilters["variants"]["calculated_price"] = {};

      if (filters.price.min !== undefined) {
        queryFilters["variants"]["calculated_price"]["calculated_amount"] = {
          $gte: filters.price.min * 100, // Convert to cents
        };
      }
      if (filters.price.max !== undefined) {
        if (
          !queryFilters["variants"]["calculated_price"]["calculated_amount"]
        ) {
          queryFilters["variants"]["calculated_price"]["calculated_amount"] =
            {};
        }
        queryFilters["variants"]["calculated_price"]["calculated_amount"].$lte =
          filters.price.max * 100; // Convert to cents
      }
    }

    // Build sorting from order_by string (e.g., "-price,name,created_at")
    const orderBy: Record<string, any> = {};

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
            // For nested price sorting
            if (!orderBy["variants"]) orderBy["variants"] = {};
            if (!orderBy["variants"]["calculated_price"])
              orderBy["variants"]["calculated_price"] = {};
            orderBy["variants"]["calculated_price"]["calculated_amount"] =
              direction;
            break;
          case "name":
            orderBy["title"] = direction;
            break;
          case "created_at":
            orderBy["created_at"] = direction;
            break;
          case "popularity":
            // Popularity maps to created_at desc (newest/most recent)
            orderBy["created_at"] = "desc";
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
        take: 10000, // Get all products for attribute filtering
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

    let products = result.data || [];
    let totalCount = products.length;

    // Apply product attribute filters (all facets come from product attributes)
    // Look for attribute filters in the root level of filters object
    const attributeFilters = Object.entries(filters).filter(([key]) => 
      key !== 'tags' && key !== 'availability' && key !== 'price'
    );

    if (attributeFilters.length > 0) {
      try {
        const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
        logger.debug(`Found ${attributeFilters.length} attribute filters: ${JSON.stringify(attributeFilters)}`);
        
        const productAttributesService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE);
        const productIds = products.map((p: any) => p.id);

        if (productIds.length > 0) {
          // Get product attributes for all products
          const productAttributes = await productAttributesService.listProductAttributes({
            product_id: productIds,
          });
          
          logger.debug(`Retrieved ${productAttributes.length} product attributes`);
          logger.debug(`Product attributes sample: ${JSON.stringify(productAttributes.slice(0, 2))}`);

          // Filter products based on attribute values
          // Build a map of products that match each filter
          const filterMatches = new Map<string, Set<string>>();
          
          for (const [attributeKey, attributeValues] of attributeFilters) {
            if (!attributeValues || !Array.isArray(attributeValues) || attributeValues.length === 0) continue;

            const matchingProducts = new Set<string>();
            
            // Find products that have any of the specified attribute values for this key
            for (const productAttribute of productAttributes) {
              const attributeData = productAttribute.attribute_values || {};
              const productValue = attributeData[attributeKey];
              
              if (productValue && attributeValues.includes(String(productValue))) {
                matchingProducts.add(productAttribute.product_id);
              }
            }
            
            filterMatches.set(attributeKey, matchingProducts);
          }

          // Find products that match ALL attribute filters
          let filteredProductIds = new Set<string>();
          let isFirstFilter = true;

          for (const [, matchingProducts] of filterMatches) {
            if (isFirstFilter) {
              filteredProductIds = new Set(matchingProducts);
              isFirstFilter = false;
            } else {
              // Intersection: keep only products that match this filter AND previous filters
              filteredProductIds = new Set([...filteredProductIds].filter(id => matchingProducts.has(id)));
            }
          }

          // Filter products to only include those matching the attributes
          logger.debug(`Filtered to ${filteredProductIds.size} matching products: ${Array.from(filteredProductIds).join(', ')}`);
          products = products.filter((p: any) => filteredProductIds.has(p.id));
          totalCount = products.length;
          logger.debug(`Final filtered product count: ${totalCount}`);
        }
      } catch (error) {
        const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
        logger.error("Error filtering by product attributes:", error instanceof Error ? error : new Error(String(error)));
        // Continue with original products if attribute filtering fails
      }
    }

    // Apply manual pagination after attribute filtering
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
    logger.error("Error in POST /store/category-products for category " + sanitizedCategoryId + ":", error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      error: "Internal server error",
    });
  }
}