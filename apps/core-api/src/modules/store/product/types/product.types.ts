import { JsonValue } from '@prisma/client/runtime/library';

export interface ProductCategory {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  rank: number;
  parent_category_id: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  metadata: JsonValue;
}

export interface ProductType {
  id: string;
  value: string;
  metadata: JsonValue;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface ProductCollection {
  id: string;
  title: string;
  handle: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  metadata: JsonValue;
}

export interface ProductTag {
  id: string;
  value: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  metadata: JsonValue;
}

export interface ProductImage {
  id: string;
  url: string;
  rank: number;
  metadata: JsonValue;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface ProductOptionValue {
  id: string;
  value: string;
  option_id: string;
  metadata: JsonValue;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface ProductOption {
  id: string;
  title: string;
  product_id: string;
  values: ProductOptionValue[];
  metadata: JsonValue;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface VariantPrice {
  currency_code: string;
  amount: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  ean: string | null;
  upc: string | null;
  product_id: string;
  variant_rank: number | null;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  length: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
  origin_country: string | null;
  hs_code: string | null;
  mid_code: string | null;
  material: string | null;
  metadata: JsonValue;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  options: ProductOptionValue[];
  price?: VariantPrice | null;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  handle: string;
  is_giftcard: boolean;
  status: string;
  thumbnail: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
  origin_country: string | null;
  hs_code: string | null;
  mid_code: string | null;
  material: string | null;
  collection_id: string | null;
  type_id: string | null;
  discountable: boolean;
  external_id: string | null;
  metadata: JsonValue;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  categories: ProductCategory[];
  type: ProductType | null;
  collection: ProductCollection | null;
  tags: ProductTag[];
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  product_attributes: JsonValue;
}
