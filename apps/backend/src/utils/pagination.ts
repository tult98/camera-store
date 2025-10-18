import type { PaginatedResponse } from "@medusajs/types";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 24;

export const DEFAULT_LIMIT = 24;
export const DEFAULT_OFFSET = 0;

/**
 * Converts query results to the standard PaginatedResponse format
 * @param data - The array of items to paginate
 * @param count - The total count of items
 * @param limit - The maximum number of items per page
 * @param offset - The number of items to skip
 * @param estimate_count - Optional estimated count from query planner
 * @returns PaginatedResponse with the provided data
 */
export function toPaginatedResponse<T>(
  data: T[],
  count: number,
  limit: number,
  offset: number,
  estimate_count?: number
): PaginatedResponse<{ items: T[] }> {
  return {
    items: data,
    count,
    limit,
    offset,
    ...(estimate_count !== undefined && { estimate_count }),
  };
}