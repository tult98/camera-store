import { PaginatedResponse } from '../types/pagination.types';

export function createPaginatedResponse<T>(
  resourceKey: string,
  data: T[],
  count: number,
  offset: number,
  limit: number
): PaginatedResponse<T> {
  return {
    limit,
    offset,
    count,
    [resourceKey]: data,
  } as PaginatedResponse<T>;
}
