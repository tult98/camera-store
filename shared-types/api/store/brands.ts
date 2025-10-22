export interface Brand {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface GetCategoryBrandsResponse {
  brands: Brand[];
}
