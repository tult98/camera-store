import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const {
    brand,
    sensor_size,
    use_case,
    mount_type,
    video_resolution,
    price_min,
    price_max,
    availability,
    sortBy = 'popularity',
    page = '1',
    limit = '24',
    q
  } = req.query as Record<string, string>

  const currentPage = parseInt(page, 10)
  const itemsPerPage = parseInt(limit, 10)
  const offset = (currentPage - 1) * itemsPerPage

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
      brand: "sony",
      sensor_size: "full-frame",
      use_cases: ["professional", "hybrid"],
      mount_type: "sony-e",
      video_resolution: "4k60"
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
      brand: "canon",
      sensor_size: "full-frame",
      use_cases: ["sports", "wildlife"],
      mount_type: "canon-rf",
      video_resolution: "4k60"
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
      brand: "nikon",
      sensor_size: "full-frame",
      use_cases: ["professional", "sports", "wildlife"],
      mount_type: "nikon-z",
      video_resolution: "8k30"
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
      brand: "fujifilm",
      sensor_size: "aps-c",
      use_cases: ["travel", "street", "vlogging"],
      mount_type: "fujifilm-x",
      video_resolution: "6k30"
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
      brand: "sony",
      sensor_size: "aps-c",
      use_cases: ["vlogging", "content-creation"],
      mount_type: "sony-e",
      video_resolution: "4k120"
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
      brand: "canon",
      sensor_size: "aps-c",
      use_cases: ["wildlife", "sports"],
      mount_type: "canon-rf",
      video_resolution: "4k60"
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
      brand: "panasonic",
      sensor_size: "full-frame",
      use_cases: ["video", "hybrid"],
      mount_type: "l-mount",
      video_resolution: "6k30"
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
      brand: "om-system",
      sensor_size: "micro-four-thirds",
      use_cases: ["wildlife", "adventure"],
      mount_type: "micro-four-thirds",
      video_resolution: "4k60"
    }
  ]

  let filteredProducts = [...mockProducts]

  if (brand) {
    const brands = brand.split(',')
    filteredProducts = filteredProducts.filter(p => brands.includes(p.brand))
  }

  if (sensor_size) {
    const sizes = sensor_size.split(',')
    filteredProducts = filteredProducts.filter(p => sizes.includes(p.sensor_size))
  }

  if (use_case) {
    const useCases = use_case.split(',')
    filteredProducts = filteredProducts.filter(p => 
      p.use_cases.some(uc => useCases.includes(uc))
    )
  }

  if (mount_type) {
    const mounts = mount_type.split(',')
    filteredProducts = filteredProducts.filter(p => mounts.includes(p.mount_type))
  }

  if (video_resolution) {
    const resolutions = video_resolution.split(',')
    filteredProducts = filteredProducts.filter(p => resolutions.includes(p.video_resolution))
  }

  if (price_min) {
    const minPrice = parseFloat(price_min)
    filteredProducts = filteredProducts.filter(p => p.price.amount >= minPrice)
  }

  if (price_max) {
    const maxPrice = parseFloat(price_max)
    filteredProducts = filteredProducts.filter(p => p.price.amount <= maxPrice)
  }

  if (availability) {
    const availabilities = availability.split(',')
    filteredProducts = filteredProducts.filter(p => availabilities.includes(p.availability))
  }

  if (q) {
    const query = q.toLowerCase()
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query)
    )
  }

  switch (sortBy) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.price.amount - b.price.amount)
      break
    case 'price_desc':
      filteredProducts.sort((a, b) => b.price.amount - a.price.amount)
      break
    case 'newest':
      filteredProducts.reverse()
      break
    case 'name_asc':
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'name_desc':
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating)
      break
  }

  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(offset, offset + itemsPerPage)

  res.json({
    pagination: {
      total: totalProducts,
      limit: itemsPerPage,
      offset,
      totalPages,
      currentPage
    },
    products: paginatedProducts
  })
}