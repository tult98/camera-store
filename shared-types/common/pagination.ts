export interface PaginationRequest {
  page?: number
  page_size?: number
}

export interface PaginationResponse {
  total: number
  limit: number
  offset: number
  totalPages: number
  currentPage: number
}

export interface SortRequest {
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
}