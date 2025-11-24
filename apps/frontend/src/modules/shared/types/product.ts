interface Image {
  id: string
  url: string
}

interface ProductVariant {
  id: string
  title: string
  calculated_price: {
    calculated_amount: number
    original_amount: number
    currency_code: string
  }
}

export interface Product {
  id: string
  title: string
  handle: string
  images: Image[]
  variants: ProductVariant[]
  thumbnail?: string
}

export interface ProductResponse {
  limit: number
  offset: number
  count: number
  products: Product[]
}
