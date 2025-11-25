export interface Category {
  id: string
  name: string
  description: string
  handle: string
  is_active: boolean
  rank: number
  metadata: any
  created_at: Date
  updated_at: Date
  children?: Category[]
}

export interface CategoryResponse {
  limit: number
  offset: number
  count: number
  categories: Category[]
}

export interface CategoryTreeResponse {
  categories: Category[]
}
