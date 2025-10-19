export interface Brand {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BrandSchemaType {
  name: string;
  image_url: string;
}
