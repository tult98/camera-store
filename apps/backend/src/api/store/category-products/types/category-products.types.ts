export interface ProductVariant {
  id: string;
  calculated_price?: {
    calculated_amount?: number | null;
  };
}

export interface Product {
  id: string;
  title: string;
  created_at: string;
  variants?: ProductVariant[];
  categories?: Array<{ id: string }>;
  tags?: Array<{ value: string }>;
  images?: Array<{ url: string }>;
  metadata?: Record<string, unknown>;
  product_attributes?: Record<string, unknown>;
  brands?: Array<{ id: string; name: string }>;
}

export interface ProductAttributesService {
  listProductAttributes(params: { product_id: string[] }): Promise<Array<{
    product_id: string;
    attribute_values: Record<string, unknown>;
  }>>;
}

export interface QueryFilters {
  categories?: {
    id: string[];
  };
  tags?: {
    value: string[];
  };
  id?: string[];
  status?: string;
}

export interface SortOrder {
  [key: string]: "asc" | "desc" | SortOrder;
}

export interface PriceFilter {
  min?: number;
  max?: number;
}

import type { ApiFilters } from "@camera-store/shared-types";

export type { ApiFilters };

export interface CategoryProductsParams {
  category_id: string;
  page: number;
  page_size: number;
  order_by: string;
  filters: ApiFilters;
  search_query?: string;
  region_id: string;
  currency_code: string;
  brand_id?: string;
}

export interface ProductProcessingContext {
  region_id: string;
  currency_code: string;
  categoryIds: string[];
}

export interface FilterResult {
  products: Product[];
  totalCount: number;
}