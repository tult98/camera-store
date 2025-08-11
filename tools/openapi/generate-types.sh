#!/bin/bash

# Generate TypeScript types from OpenAPI schema
# This script generates types and places them in the shared-types library

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Generating TypeScript types from OpenAPI schema...${NC}"

# Check if OpenAPI schema exists
if [ ! -f "tools/openapi/schema.json" ]; then
    echo -e "${RED}❌ OpenAPI schema not found at tools/openapi/schema.json${NC}"
    exit 1
fi

# Create output directory
mkdir -p "libs/shared-types/src/generated"

# Generate TypeScript types using openapi-generator-cli
echo -e "${YELLOW}📝 Running openapi-generator-cli...${NC}"

npx @openapitools/openapi-generator-cli generate \
    -i tools/openapi/schema.json \
    -g typescript-fetch \
    -o libs/shared-types/src/generated \
    --additional-properties=typescriptThreePlus=true,supportsES6=true,modelPackage=models,apiPackage=api,withInterfaces=true,enumPropertyNaming=PascalCase

# Create a barrel export file for generated types
echo -e "${YELLOW}📦 Creating barrel exports...${NC}"

cat > libs/shared-types/src/generated/index.ts << 'EOF'
// Generated API types and clients
// This file is auto-generated from the OpenAPI specification

export * from './models';
export * from './api';
export * from './runtime';
EOF

# Update the main shared-types index to include generated types
echo -e "${YELLOW}🔄 Updating shared-types index...${NC}"

# Create a backup of the original index
if [ ! -f "libs/shared-types/src/index.ts.backup" ]; then
    cp libs/shared-types/src/index.ts libs/shared-types/src/index.ts.backup
fi

# Update the index to export generated types
cat > libs/shared-types/src/index.ts << 'EOF'
// Shared types for Camera Store API

// Basic types from existing API structure
export interface FeaturedCategory {
  id: string;
  category_name: string;
  category_description: string;
  category_handle: string;
  hero_image_url: string;
  display_order: number;
  products: Product[];
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail: string;
  images: ProductImage[];
  variants: ProductVariant[];
  status: 'published' | 'draft';
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  prices: ProductPrice[];
  inventory_quantity?: number;
}

export interface ProductPrice {
  id: string;
  currency_code: string;
  amount: number;
  price_type: 'default' | 'sale';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  handle: string;
  is_active: boolean;
  parent_category_id?: string;
  metadata?: Record<string, any>;
}

export interface FeaturedCategoryRequest {
  is_featured: boolean;
  hero_image_url?: string;
  display_order?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface FeaturedCategoriesResponse {
  featured_categories: FeaturedCategory[];
}

export interface CategoryFeaturedResponse {
  category: Category;
  message: string;
}

// Re-export generated types
export * from './generated';
EOF

echo -e "${GREEN}✅ TypeScript types generated successfully!${NC}"
echo -e "${GREEN}📁 Generated files location: libs/shared-types/src/generated/${NC}"
echo -e "${YELLOW}💡 You can now build the shared-types library: nx build shared-types${NC}"