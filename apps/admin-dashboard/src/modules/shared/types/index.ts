export interface ApiResponse<T> {
  data: T;
  count?: number;
  offset?: number;
  limit?: number;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
  order?: string;
}

export interface FilterParams {
  q?: string;
  [key: string]: any;
}

export type RequestParams = PaginationParams & FilterParams;