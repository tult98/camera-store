import { Product } from ".medusa/types/query-entry-points";
import { RemoteQueryFunctionReturnPagination } from "@medusajs/types";

export interface ApiFilters {
  tags?: string[];
  availability?: string[];
  price?: { min?: number; max?: number };
  metadata?: Record<string, string[]>;
}

export interface CategoryProductsRequest {
  category_id: string;
  page?: number;
  page_size?: number;
  order_by?: string;
  filters?: ApiFilters;
}

export interface CategoryProductsResponse {
  data: Product[];
  metadata?: RemoteQueryFunctionReturnPagination;
}
