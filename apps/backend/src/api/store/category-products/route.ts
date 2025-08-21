import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import type { IProductModuleService } from "@medusajs/types";
import { Modules } from "@medusajs/framework/utils";

interface FilterRequest {
  category_id: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  filters?: {
    tags?: string[];
    availability?: string[];
    price?: {
      min?: number;
      max?: number;
    };
    metadata?: Record<string, string[]>;
  };
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      category_id,
      page = 1,
      page_size = 24,
      sort_by = "popularity",
      sort_direction = "asc",
      filters = {},
    }: FilterRequest = req.body as FilterRequest;

    if (!category_id) {
      return res.status(400).json({
        error: "category_id is required",
      });
    }

    const currentPage = Number(page);
    const itemsPerPage = Number(page_size);
    const offset = (currentPage - 1) * itemsPerPage;

    const productModuleService = req.scope.resolve(Modules.PRODUCT) as IProductModuleService;

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

    // Apply price filters (using variants.prices instead of calculated_price)
    if (filters.price?.min !== undefined || filters.price?.max !== undefined) {
      queryFilters.variants = {
        prices: {},
      };
      if (filters.price.min !== undefined) {
        queryFilters.variants.prices.amount = {
          $gte: filters.price.min * 100, // Convert to cents
        };
      }
      if (filters.price.max !== undefined) {
        if (!queryFilters.variants.prices.amount) {
          queryFilters.variants.prices.amount = {};
        }
        queryFilters.variants.prices.amount.$lte =
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

    // Build sorting
    let orderBy: any = {};
    switch (sort_by) {
      case "price":
        orderBy = {
          variants: { prices: { amount: sort_direction } },
        };
        break;
      case "name":
        orderBy = { title: sort_direction };
        break;
      case "created_at":
      case "newest":
        orderBy = { created_at: sort_direction === "asc" ? "desc" : "asc" };
        break;
      case "popularity":
      default:
        orderBy = { created_at: "desc" };
        break;
    }

    // Query products with relations
    const products = await productModuleService.listProducts(
      queryFilters,
      {
        skip: offset,
        take: itemsPerPage,
        order: orderBy,
        relations: [
          "variants",
          "categories",
          "tags",
          "images",
        ],
      }
    );

    // Get total count for pagination
    const count = await productModuleService.listProducts(queryFilters, {
      relations: [],
    }).then(result => result.length);

    // Transform products to match frontend expected structure
    const transformedProducts = products.map((product: any) => {
      const defaultVariant = product.variants?.[0];
      const price = defaultVariant?.prices?.[0];

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        thumbnail: product.thumbnail || product.images?.[0]?.url,
        price: price
          ? {
              amount: price.amount / 100, // Convert from cents
              currency_code: price.currency_code,
            }
          : { amount: 0, currency_code: "usd" },
        description: product.description,
        tags: product.tags?.map((tag: any) => tag.value) || [],
        categories:
          product.categories?.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            handle: cat.handle,
          })) || [],
        metadata: product.metadata || {},
        availability:
          defaultVariant?.inventory_quantity > 0 ? "in-stock" : "out-of-stock",
        images:
          product.images?.map((img: any) => ({
            id: img.id,
            url: img.url,
          })) || [],
      };
    });

    // Apply availability filter after transformation (since it's calculated)
    let finalProducts = transformedProducts;
    if (filters.availability && filters.availability.length > 0) {
      finalProducts = finalProducts.filter((product: any) =>
        filters.availability!.includes(product.availability)
      );
    }

    const totalProducts = count;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    res.status(200).json({
      pagination: {
        total: totalProducts,
        limit: itemsPerPage,
        offset,
        totalPages,
        currentPage,
      },
      products: finalProducts,
    });
  } catch (error) {
    console.error("Error in POST /store/category-products:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}
