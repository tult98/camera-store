import { z } from "zod";
import type { PriceFilter } from "../types/category-products.types";

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
      if (data.filters) {
        const filterCount = Object.keys(data.filters).length;
        if (filterCount > 20) return false;

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

        for (const [key, value] of Object.entries(data.filters)) {
          if (key === "price") continue;
          if (Array.isArray(value)) {
            if (value.length > 100) return false;
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

export class CategoryProductsValidator {
  static validateCategoryId(category_id: unknown): string {
    if (
      !category_id ||
      typeof category_id !== "string" ||
      category_id.trim() === ""
    ) {
      throw new Error("Valid category_id is required");
    }
    return category_id.trim();
  }

  static validateHeaders(headers: Record<string, unknown>): {
    region_id: string;
    currency_code: string;
  } {
    const region_id = headers["region_id"] as string;
    const currency_code = headers["currency_code"] as string;

    if (!region_id || !currency_code) {
      throw new Error("region_id and currency_code headers are required");
    }

    return { region_id, currency_code };
  }

  static validatePaginationParams(page: unknown, page_size: unknown): {
    currentPage: number;
    itemsPerPage: number;
    offset: number;
  } {
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(Math.max(1, Number(page_size) || 24), 100);
    const offset = (currentPage - 1) * itemsPerPage;

    return { currentPage, itemsPerPage, offset };
  }

  static validateCategoryIds(categoryIds: string[]): void {
    if (
      !categoryIds ||
      categoryIds.length === 0 ||
      categoryIds.some((id) => !id || typeof id !== "string")
    ) {
      throw new Error("Category not found or invalid");
    }
  }

  static sanitizeSearchQuery(searchQuery: string | undefined): string | undefined {
    if (!searchQuery || searchQuery.trim() === "") {
      return undefined;
    }

    const sanitized = searchQuery
      .toLowerCase()
      .trim()
      .replace(/[<>"'&]/g, '')
      .substring(0, 100);
    
    return sanitized.length === 0 ? undefined : sanitized;
  }
}