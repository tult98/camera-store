import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, QueryContext } from "@medusajs/framework/utils";
import { z } from "zod";

export const CategoryProductsSchema = z.object({
  category_id: z.string().min(1, "category_id is required"),
  page: z.number().int().positive().default(1),
  page_size: z.number().int().positive().max(100).default(24),
  order_by: z.string().default("-created_at"),
  filters: z.object({
    tags: z.array(z.string()).optional(),
    availability: z.array(z.enum(["in-stock", "out-of-stock"])).optional(),
    price: z.object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    }).optional(),
    metadata: z.record(z.string(), z.array(z.string())).optional(),
  }).optional().default({}),
});

export type CategoryProductsRequest = z.infer<typeof CategoryProductsSchema>;

export async function POST(
  req: MedusaRequest<CategoryProductsRequest>,
  res: MedusaResponse
): Promise<void> {
  try {
    const requestData = req.validatedBody;

    const {
      category_id,
      page = 1,
      page_size = 24,
      order_by = "-created_at",
      filters = {},
    } = requestData as CategoryProductsRequest;

    if (!category_id) {
      res.status(400).json({
        error: "category_id is required",
      });
      return;
    }

    // Get region_id and currency_code from request headers
    const region_id = req.headers['region_id'] as string;
    const currency_code = req.headers['currency_code'] as string;

    if (!region_id || !currency_code) {
      res.status(400).json({
        error: "region_id and currency_code headers are required",
      });
      return;
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const currentPage = Number(page);
    const itemsPerPage = Number(page_size);
    const offset = (currentPage - 1) * itemsPerPage;

    // Build query filters
    const queryFilters: any = {
      categories: {
        id: category_id,
      },
    };

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      queryFilters.tags = {
        value: filters.tags,
      };
    }

    // Apply price filters on calculated_price
    if (filters.price?.min !== undefined || filters.price?.max !== undefined) {
      queryFilters.variants = queryFilters.variants || {};
      queryFilters.variants.calculated_price = {};
      
      if (filters.price.min !== undefined) {
        queryFilters.variants.calculated_price.calculated_amount = {
          $gte: filters.price.min * 100, // Convert to cents
        };
      }
      if (filters.price.max !== undefined) {
        if (!queryFilters.variants.calculated_price.calculated_amount) {
          queryFilters.variants.calculated_price.calculated_amount = {};
        }
        queryFilters.variants.calculated_price.calculated_amount.$lte = filters.price.max * 100; // Convert to cents
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
    let orderBy: any = {};
    
    if (order_by) {
      // Split by comma to get individual fields
      const sortFields = order_by.split(",");
      
      sortFields.forEach(field => {
        // Check if field starts with "-" for descending order
        const isDescending = field.startsWith("-");
        const fieldName = isDescending ? field.substring(1) : field;
        const direction = isDescending ? "desc" : "asc";
        
        switch (fieldName.trim()) {
          case "price":
            // For nested price sorting
            if (!orderBy.variants) orderBy.variants = {};
            if (!orderBy.variants.calculated_price) orderBy.variants.calculated_price = {};
            orderBy.variants.calculated_price.calculated_amount = direction;
            break;
          case "name":
            orderBy.title = direction;
            break;
          case "created_at":
            orderBy.created_at = direction;
            break;
          case "popularity":
            // Popularity maps to created_at desc (newest/most recent)
            orderBy.created_at = "desc";
            break;
          default:
            // For any other field, use it directly
            orderBy[fieldName.trim()] = direction;
            break;
        }
      });
    }

    // Query products with calculated prices
    const data = await query.graph({
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

    res.status(200).json(data)

    // Get total count for pagination
    // const { data: countData } = await query.graph({
    //   entity: "product",
    //   fields: ["id"],
    //   filters: queryFilters,
    // });

    // const totalProducts = countData.length;
    // const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // Apply availability filter after fetching (since it's calculated)
    // let finalProducts = products;
    // if (filters.availability && filters.availability.length > 0) {
    //   finalProducts = finalProducts.filter((product: any) => {
    //     // Calculate availability based on inventory
    //     const hasInventory = product.variants?.some((v: any) => 
    //       v.inventory_quantity > 0
    //     );
    //     const availability = hasInventory ? "in-stock" : "out-of-stock";
    //     return filters.availability!.includes(availability);
    //   });
    // }

    // res.status(200).json({
    //   pagination: {
    //     total: totalProducts,
    //     limit: itemsPerPage,
    //     offset,
    //     totalPages,
    //     currentPage,
    //   },
    //   products: finalProducts,
    // });
  } catch (error) {
    console.error("Error in POST /store/category-products:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}
