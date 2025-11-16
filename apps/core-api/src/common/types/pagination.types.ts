export interface PaginatedResponse<T> {
  limit: number;
  offset: number;
  count: number;
  [key: string]: T[] | number;
}

export interface PaginationParams {
  offset: number;
  limit: number;
}

export interface PaginatedData<T> {
  data: T[];
  count: number;
}
