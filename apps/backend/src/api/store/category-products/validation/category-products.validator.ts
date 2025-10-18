import { z } from 'zod';
import type { PriceFilter } from '../types/category-products.types';

export const CategoryProductsSchema = z
  .object({
    category_id: z.string().min(1, 'category_id is required').max(100),
    page: z.number().int().positive().default(1),
    page_size: z.number().int().positive().max(100).default(24),
    order_by: z.string().max(100).default('-created_at'),
    filters: z.record(z.string(), z.any()).optional().default({}),
    search_query: z.string().max(100).optional(),
  })
  .refine(
    (data) => {
      if (data.filters) {
        const filterCount = Object.keys(data.filters).length;
        if (filterCount > 20) return false;

        if (data.filters['price']) {
          if (typeof data.filters['price'] !== 'object') return false;
          const price = data.filters['price'] as PriceFilter;
          if (
            price.min !== undefined &&
            (typeof price.min !== 'number' || price.min < 0)
          )
            return false;
          if (
            price.max !== undefined &&
            (typeof price.max !== 'number' || price.max < 0)
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
          if (key === 'price') continue;
          if (Array.isArray(value)) {
            if (value.length > 100) return false;
            if (!value.every((v) => typeof v === 'string' && v.length < 200))
              return false;
          }
        }
      }
      return true;
    },
    {
      message: 'Invalid filter structure or values',
    }
  );

export class CategoryProductsValidator {
  static sanitizeSearchQuery(
    searchQuery: string | undefined
  ): string | undefined {
    if (!searchQuery || searchQuery.trim() === '') {
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
