export interface Category {
  id: string
  name: string
  description: string
  metadata: {
    hero_image_url: string
  }
}

export interface CategoryResponse {
  limit: number
  offset: number
  count: number
  categories: Category[]
}
