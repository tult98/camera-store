export interface Brand {
  id: string
  name: string
  image_url: string
}

export interface BrandResponse {
  limit: number
  offset: number
  count: number
  brands: Brand[]
}
