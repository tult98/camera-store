import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

interface FilterRequest {
  category_id: string
  page?: number
  page_size?: number
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
  filters?: {
    tags?: string[]
    availability?: string[]
    price?: {
      min?: number
      max?: number
    }
    metadata?: Record<string, string[]>
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const {
      category_id,
      page = 1,
      page_size = 24,
      sort_by = 'popularity',
      sort_direction = 'asc',
      filters = {}
    }: FilterRequest = req.body

    if (!category_id) {
      return res.status(400).json({
        error: "category_id is required"
      })
    }

    const currentPage = Number(page)
    const itemsPerPage = Number(page_size)
    const offset = (currentPage - 1) * itemsPerPage

    // Mock product data - matches existing structure
    const mockProducts = [
      {
        id: "prod_001",
        title: "Sony Alpha a7 IV",
        handle: "sony-alpha-a7-iv",
        thumbnail: "/images/sony-a7iv.webp",
        price: { amount: 2499.99, currency_code: "usd" },
        rating: 4.8,
        review_count: 152,
        key_specs: [
          { label: "Sensor", value: "33MP Full-Frame" },
          { label: "Video", value: "4K 60p" },
          { label: "Mount", value: "Sony E" },
          { label: "Stabilization", value: "5-axis IBIS" }
        ],
        availability: "in-stock",
        tags: ["professional", "hybrid"],
        metadata: {
          brand: "sony",
          sensor_size: "full-frame",
          mount_type: "sony-e",
          video_resolution: "4k60"
        }
      },
      {
        id: "prod_002",
        title: "Canon EOS R6 Mark II",
        handle: "canon-eos-r6-mark-ii",
        thumbnail: "/images/canon-r6ii.webp",
        price: { amount: 2499.00, currency_code: "usd" },
        rating: 4.7,
        review_count: 98,
        key_specs: [
          { label: "Sensor", value: "24MP Full-Frame" },
          { label: "Video", value: "4K 60p" },
          { label: "Mount", value: "Canon RF" },
          { label: "Burst", value: "40fps" }
        ],
        availability: "in-stock",
        tags: ["sports", "wildlife"],
        metadata: {
          brand: "canon",
          sensor_size: "full-frame",
          mount_type: "canon-rf",
          video_resolution: "4k60"
        }
      },
      {
        id: "prod_003",
        title: "Nikon Z9",
        handle: "nikon-z9",
        thumbnail: "/images/nikon-z9.webp",
        price: { amount: 5499.95, currency_code: "usd" },
        rating: 4.9,
        review_count: 87,
        key_specs: [
          { label: "Sensor", value: "45.7MP Full-Frame" },
          { label: "Video", value: "8K 30p" },
          { label: "Mount", value: "Nikon Z" },
          { label: "Burst", value: "120fps" }
        ],
        availability: "in-stock",
        tags: ["professional", "sports", "wildlife"],
        metadata: {
          brand: "nikon",
          sensor_size: "full-frame",
          mount_type: "nikon-z",
          video_resolution: "8k30"
        }
      },
      {
        id: "prod_004",
        title: "Fujifilm X-T5",
        handle: "fujifilm-x-t5",
        thumbnail: "/images/fuji-xt5.webp",
        price: { amount: 1699.00, currency_code: "usd" },
        rating: 4.7,
        review_count: 124,
        key_specs: [
          { label: "Sensor", value: "40MP APS-C" },
          { label: "Video", value: "6.2K 30p" },
          { label: "Mount", value: "Fujifilm X" },
          { label: "Style", value: "Retro Design" }
        ],
        availability: "in-stock",
        tags: ["travel", "street", "vlogging"],
        metadata: {
          brand: "fujifilm",
          sensor_size: "aps-c",
          mount_type: "fujifilm-x",
          video_resolution: "6k30"
        }
      },
      {
        id: "prod_005",
        title: "Sony a6700",
        handle: "sony-a6700",
        thumbnail: "/images/sony-a6700.webp",
        price: { amount: 1399.99, currency_code: "usd" },
        rating: 4.6,
        review_count: 76,
        key_specs: [
          { label: "Sensor", value: "26MP APS-C" },
          { label: "Video", value: "4K 120p" },
          { label: "Mount", value: "Sony E" },
          { label: "AI", value: "AI Processing" }
        ],
        availability: "in-stock",
        tags: ["vlogging", "content-creation"],
        metadata: {
          brand: "sony",
          sensor_size: "aps-c",
          mount_type: "sony-e",
          video_resolution: "4k120"
        }
      },
      {
        id: "prod_006",
        title: "Canon EOS R7",
        handle: "canon-eos-r7",
        thumbnail: "/images/canon-r7.webp",
        price: { amount: 1499.00, currency_code: "usd" },
        rating: 4.5,
        review_count: 93,
        key_specs: [
          { label: "Sensor", value: "32.5MP APS-C" },
          { label: "Video", value: "4K 60p" },
          { label: "Mount", value: "Canon RF" },
          { label: "Burst", value: "30fps" }
        ],
        availability: "in-stock",
        tags: ["wildlife", "sports"],
        metadata: {
          brand: "canon",
          sensor_size: "aps-c",
          mount_type: "canon-rf",
          video_resolution: "4k60"
        }
      },
      {
        id: "prod_007",
        title: "Panasonic Lumix S5 II",
        handle: "panasonic-lumix-s5-ii",
        thumbnail: "/images/lumix-s5ii.webp",
        price: { amount: 1999.99, currency_code: "usd" },
        rating: 4.8,
        review_count: 64,
        key_specs: [
          { label: "Sensor", value: "24MP Full-Frame" },
          { label: "Video", value: "6K 30p" },
          { label: "Mount", value: "L-Mount" },
          { label: "AF", value: "Phase Detection" }
        ],
        availability: "in-stock",
        tags: ["video", "hybrid"],
        metadata: {
          brand: "panasonic",
          sensor_size: "full-frame",
          mount_type: "l-mount",
          video_resolution: "6k30"
        }
      },
      {
        id: "prod_008",
        title: "OM System OM-1",
        handle: "om-system-om-1",
        thumbnail: "/images/om-1.webp",
        price: { amount: 2199.99, currency_code: "usd" },
        rating: 4.6,
        review_count: 58,
        key_specs: [
          { label: "Sensor", value: "20MP Micro 4/3" },
          { label: "Video", value: "4K 60p" },
          { label: "Mount", value: "Micro 4/3" },
          { label: "Weather", value: "IP53 Rated" }
        ],
        availability: "in-stock",
        tags: ["wildlife", "adventure"],
        metadata: {
          brand: "om-system",
          sensor_size: "micro-four-thirds",
          mount_type: "micro-four-thirds",
          video_resolution: "4k60"
        }
      },
      {
        id: "prod_009",
        title: "Sony Alpha a7R V",
        handle: "sony-alpha-a7r-v",
        thumbnail: "/images/sony-a7rv.webp",
        price: { amount: 3899.99, currency_code: "usd" },
        rating: 4.9,
        review_count: 67,
        key_specs: [
          { label: "Sensor", value: "61MP Full-Frame" },
          { label: "Video", value: "8K 24p" },
          { label: "Mount", value: "Sony E" },
          { label: "Resolution", value: "Ultra High-Res" }
        ],
        availability: "in-stock",
        tags: ["professional", "landscape", "studio"],
        metadata: {
          brand: "sony",
          sensor_size: "full-frame",
          mount_type: "sony-e",
          video_resolution: "8k24"
        }
      },
      {
        id: "prod_010",
        title: "Canon EOS R5",
        handle: "canon-eos-r5",
        thumbnail: "/images/canon-r5.webp",
        price: { amount: 3899.00, currency_code: "usd" },
        rating: 4.8,
        review_count: 142,
        key_specs: [
          { label: "Sensor", value: "45MP Full-Frame" },
          { label: "Video", value: "8K 30p" },
          { label: "Mount", value: "Canon RF" },
          { label: "IS", value: "8-stop IBIS" }
        ],
        availability: "in-stock",
        tags: ["professional", "wedding", "portrait"],
        metadata: {
          brand: "canon",
          sensor_size: "full-frame",
          mount_type: "canon-rf",
          video_resolution: "8k30"
        }
      },
      {
        id: "prod_011",
        title: "Nikon Z6 III",
        handle: "nikon-z6-iii",
        thumbnail: "/images/nikon-z6iii.webp",
        price: { amount: 2499.95, currency_code: "usd" },
        rating: 4.7,
        review_count: 89,
        key_specs: [
          { label: "Sensor", value: "24MP Full-Frame" },
          { label: "Video", value: "6K 60p" },
          { label: "Mount", value: "Nikon Z" },
          { label: "Speed", value: "14fps" }
        ],
        availability: "pre-order",
        tags: ["hybrid", "event", "travel"],
        metadata: {
          brand: "nikon",
          sensor_size: "full-frame",
          mount_type: "nikon-z",
          video_resolution: "6k60"
        }
      },
      {
        id: "prod_012",
        title: "Fujifilm X-H2S",
        handle: "fujifilm-x-h2s",
        thumbnail: "/images/fuji-xh2s.webp",
        price: { amount: 2499.00, currency_code: "usd" },
        rating: 4.8,
        review_count: 73,
        key_specs: [
          { label: "Sensor", value: "26MP APS-C" },
          { label: "Video", value: "6.2K 30p" },
          { label: "Mount", value: "Fujifilm X" },
          { label: "Speed", value: "40fps" }
        ],
        availability: "in-stock",
        tags: ["sports", "action", "video"],
        metadata: {
          brand: "fujifilm",
          sensor_size: "aps-c",
          mount_type: "fujifilm-x",
          video_resolution: "6k30"
        }
      }
    ]

    let filteredProducts = [...mockProducts]

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.tags.some(tag => filters.tags!.includes(tag))
      )
    }

    // Apply availability filters
    if (filters.availability && filters.availability.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.availability!.includes(product.availability)
      )
    }

    // Apply price range filters
    if (filters.price) {
      if (filters.price.min !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          product.price.amount >= filters.price!.min!
        )
      }
      if (filters.price.max !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          product.price.amount <= filters.price!.max!
        )
      }
    }

    // Apply metadata filters
    if (filters.metadata) {
      Object.entries(filters.metadata).forEach(([key, values]) => {
        if (values && values.length > 0) {
          filteredProducts = filteredProducts.filter(product =>
            values.includes(product.metadata[key])
          )
        }
      })
    }

    // Apply sorting
    const sortField = sort_by || 'popularity'
    const sortDir = sort_direction || 'asc'

    switch (sortField) {
      case 'price':
        filteredProducts.sort((a, b) => 
          sortDir === 'asc' 
            ? a.price.amount - b.price.amount 
            : b.price.amount - a.price.amount
        )
        break
      case 'name':
        filteredProducts.sort((a, b) => 
          sortDir === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        )
        break
      case 'rating':
        filteredProducts.sort((a, b) => 
          sortDir === 'asc' 
            ? a.rating - b.rating 
            : b.rating - a.rating
        )
        break
      case 'newest':
        filteredProducts.reverse()
        break
      case 'popularity':
      default:
        // Sort by rating and review count for popularity
        filteredProducts.sort((a, b) => {
          const aScore = a.rating * Math.log(a.review_count + 1)
          const bScore = b.rating * Math.log(b.review_count + 1)
          return sortDir === 'asc' ? aScore - bScore : bScore - aScore
        })
        break
    }

    // Apply pagination
    const totalProducts = filteredProducts.length
    const totalPages = Math.ceil(totalProducts / itemsPerPage)
    const paginatedProducts = filteredProducts.slice(offset, offset + itemsPerPage)

    // Response matches PRD specification
    res.status(200).json({
      pagination: {
        total: totalProducts,
        limit: itemsPerPage,
        offset,
        totalPages,
        currentPage
      },
      products: paginatedProducts
    })

  } catch (error) {
    console.error('Error in POST /store/category-products:', error)
    res.status(500).json({
      error: "Internal server error"
    })
  }
}