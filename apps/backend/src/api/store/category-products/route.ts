import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";
import { z } from "zod";
import type { CategoryProductsRequest } from "@camera-store/shared-types";
import { toPaginatedResponse } from "src/utils/pagination";
import { getAllCategoryIds, resolveQueryInstance } from "src/utils/category-hierarchy";

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

    // Apply metadata filters
    if (filters.metadata) {
      Object.entries(filters.metadata).forEach(([key, values]) => {
        if (values && values.length > 0) {
          queryFilters[`metadata.${key}`] = values;
        }
      });
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

    // Query products with calculated prices
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
        skip: offset,
        take: itemsPerPage,
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

    const products = result.data || [];
    const totalCount = result.metadata?.count || 0;

    const paginatedResponse = toPaginatedResponse(
      products,
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