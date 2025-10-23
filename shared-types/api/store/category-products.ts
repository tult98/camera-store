import {
  HttpTypes,
  RemoteQueryFunctionReturnPagination,
} from "@medusajs/types";

export interface ApiFilters {
  tags?: string[];
  availability?: string[];
  price?: { min?: number; max?: number };
  metadata?: Record<string, string[]>;
  brand_id?: string;
}

export interface CategoryProductsRequest {
  category_id: string;
  page?: number;
  page_size?: number;
  order_by?: string;
  filters?: ApiFilters;
  search_query?: string;
  brand_id?: string;
}

export interface CategoryProductsResponse
  extends HttpTypes.PaginatedResponse<{ items: HttpTypes.StoreProduct[] }> {}
