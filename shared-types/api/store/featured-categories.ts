import { HttpTypes } from "@medusajs/types";

export interface FeaturedCategory {
  id: string;
  category_name: string;
  category_description?: string;
  category_handle: string;
  hero_image_url: string;
  display_order: number;
  products: HttpTypes.StoreProduct[];
}

export interface FeaturedCategoriesResponse {
  featured_categories: FeaturedCategory[];
  region_id: string;
  currency_code: string;
}
