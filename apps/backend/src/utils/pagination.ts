import type { PaginatedResponse } from '@medusajs/types';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 24;

export const DEFAULT_LIMIT = 24;
export const DEFAULT_OFFSET = 0;

/**
 * Converts query results to the standard PaginatedResponse format
 * @param params - Pagination parameters
 * @param params.data - The array of items to paginate
 * @param params.count - The total count of items
 * @param params.limit - The maximum number of items per page
 * @param params.offset - The number of items to skip
 * @param params.dataKey - The key name for the data array (defaults to 'items')
 * @param params.estimate_count - Optional estimated count from query planner
 * @returns PaginatedResponse with the provided data
 */
export function toPaginatedResponse<T>(params: {
  data: T[];
  count: number;
  limit: number;
  offset: number;
  dataKey?: string;
  estimate_count?: number;
}): PaginatedResponse<Record<string, T[]>> {
  const {
    data,
    count,
    limit,
    offset,
    dataKey = 'items',
    estimate_count,
  } = params;

  return {
    [dataKey]: data,
    count,
    limit,
    offset,
    ...(estimate_count !== undefined && { estimate_count }),
  } as PaginatedResponse<Record<string, T[]>>;
}
