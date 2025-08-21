import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

interface FacetsRequest {
  category_id: string
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

interface FacetOption {
  value: string
  label: string
  count: number
}

interface FacetRangeOptions {
  min: number
  max: number
}

interface Facet {
  id: string
  label: string
  type: 'checkbox' | 'range'
  options: FacetOption[] | FacetRangeOptions
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const {
      category_id,
      filters = {}
    }: FacetsRequest = req.body

    if (!category_id) {
      return res.status(400).json({
        error: "category_id is required"
      })
    }

    // Mock product data - same as category-products for consistency
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

    // Apply the current filters to get the filtered dataset
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

    // Helper function to calculate counts for each facet option
    const getCountForFacet = (facetKey: string, facetValue: string, isTag: boolean = false, isMetadata: boolean = false): number => {
      // Create a temporary filter context excluding the current facet
      let tempFiltered = [...mockProducts]

      // Apply all filters EXCEPT the current facet being calculated
      if (filters.tags && filters.tags.length > 0 && (!isTag || facetKey !== 'tags')) {
        tempFiltered = tempFiltered.filter(product =>
          product.tags.some(tag => filters.tags!.includes(tag))
        )
      }

      if (filters.availability && filters.availability.length > 0 && facetKey !== 'availability') {
        tempFiltered = tempFiltered.filter(product =>
          filters.availability!.includes(product.availability)
        )
      }

      if (filters.price && facetKey !== 'price') {
        if (filters.price.min !== undefined) {
          tempFiltered = tempFiltered.filter(product =>
            product.price.amount >= filters.price!.min!
          )
        }
        if (filters.price.max !== undefined) {
          tempFiltered = tempFiltered.filter(product =>
            product.price.amount <= filters.price!.max!
          )
        }
      }

      if (filters.metadata && (!isMetadata || facetKey !== facetKey)) {
        Object.entries(filters.metadata).forEach(([key, values]) => {
          if (values && values.length > 0 && (!isMetadata || key !== facetKey)) {
            tempFiltered = tempFiltered.filter(product =>
              values.includes(product.metadata[key])
            )
          }
        })
      }

      // Now count how many products match this specific facet value
      if (isTag) {
        return tempFiltered.filter(product => product.tags.includes(facetValue)).length
      } else if (isMetadata) {
        return tempFiltered.filter(product => product.metadata[facetKey] === facetValue).length
      } else if (facetKey === 'availability') {
        return tempFiltered.filter(product => product.availability === facetValue).length
      }

      return 0
    }

    // Extract unique values and build facets
    const allTags = new Set<string>()
    const allBrands = new Set<string>()
    const allSensorSizes = new Set<string>()
    const allMountTypes = new Set<string>()
    const allVideoResolutions = new Set<string>()
    const allAvailability = new Set<string>()

    // Collect all unique values from the full dataset (not filtered)
    mockProducts.forEach(product => {
      product.tags.forEach(tag => allTags.add(tag))
      allBrands.add(product.metadata.brand)
      allSensorSizes.add(product.metadata.sensor_size)
      allMountTypes.add(product.metadata.mount_type)
      allVideoResolutions.add(product.metadata.video_resolution)
      allAvailability.add(product.availability)
    })

    // Build facets with dynamic counts
    const facets: Facet[] = [
      {
        id: "use_case",
        label: "Use Case",
        type: "checkbox",
        options: Array.from(allTags).map(tag => ({
          value: tag,
          label: tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' '),
          count: getCountForFacet('tags', tag, true)
        })).filter(opt => opt.count > 0).sort((a, b) => b.count - a.count)
      },
      {
        id: "brand",
        label: "Brand",
        type: "checkbox",
        options: Array.from(allBrands).map(brand => ({
          value: brand,
          label: brand.charAt(0).toUpperCase() + brand.slice(1).replace('-', ' '),
          count: getCountForFacet('brand', brand, false, true)
        })).filter(opt => opt.count > 0).sort((a, b) => a.label.localeCompare(b.label))
      },
      {
        id: "sensor_size",
        label: "Sensor Size",
        type: "checkbox",
        options: Array.from(allSensorSizes).map(size => ({
          value: size,
          label: size === 'full-frame' ? 'Full-Frame' :
                 size === 'aps-c' ? 'APS-C' :
                 size === 'micro-four-thirds' ? 'Micro Four Thirds' :
                 size === 'medium-format' ? 'Medium Format' :
                 size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' '),
          count: getCountForFacet('sensor_size', size, false, true)
        })).filter(opt => opt.count > 0).sort((a, b) => b.count - a.count)
      },
      {
        id: "mount_type",
        label: "Mount Type",
        type: "checkbox",
        options: Array.from(allMountTypes).map(mount => ({
          value: mount,
          label: mount === 'sony-e' ? 'Sony E' :
                 mount === 'canon-rf' ? 'Canon RF' :
                 mount === 'nikon-z' ? 'Nikon Z' :
                 mount === 'fujifilm-x' ? 'Fujifilm X' :
                 mount === 'fujifilm-gfx' ? 'Fujifilm GFX' :
                 mount === 'l-mount' ? 'L-Mount' :
                 mount === 'micro-four-thirds' ? 'Micro 4/3' :
                 mount.charAt(0).toUpperCase() + mount.slice(1).replace('-', ' '),
          count: getCountForFacet('mount_type', mount, false, true)
        })).filter(opt => opt.count > 0).sort((a, b) => a.label.localeCompare(b.label))
      },
      {
        id: "video_resolution",
        label: "Video Resolution",
        type: "checkbox",
        options: Array.from(allVideoResolutions).map(resolution => ({
          value: resolution,
          label: resolution === '8k30' ? '8K 30p' :
                 resolution === '8k24' ? '8K 24p' :
                 resolution === '6k60' ? '6K 60p' :
                 resolution === '6k30' ? '6K 30p' :
                 resolution === '4k120' ? '4K 120p' :
                 resolution === '4k60' ? '4K 60p' :
                 resolution === '4k30' ? '4K 30p' :
                 resolution.toUpperCase(),
          count: getCountForFacet('video_resolution', resolution, false, true)
        })).filter(opt => opt.count > 0).sort((a, b) => {
          // Sort by video quality/capability
          const order = ['8k30', '8k24', '6k60', '6k30', '4k120', '4k60', '4k30']
          return order.indexOf(a.value) - order.indexOf(b.value)
        })
      },
      {
        id: "availability",
        label: "Availability",
        type: "checkbox",
        options: Array.from(allAvailability).map(availability => ({
          value: availability,
          label: availability === 'in-stock' ? 'In Stock' :
                 availability === 'pre-order' ? 'Pre-Order' :
                 availability === 'limited' ? 'Limited Availability' :
                 availability.charAt(0).toUpperCase() + availability.slice(1).replace('-', ' '),
          count: getCountForFacet('availability', availability)
        })).filter(opt => opt.count > 0).sort((a, b) => b.count - a.count)
      },
      {
        id: "price",
        label: "Price",
        type: "range",
        options: {
          min: Math.min(...filteredProducts.map(p => p.price.amount)),
          max: Math.max(...filteredProducts.map(p => p.price.amount))
        }
      }
    ]

    // Response matches PRD specification
    res.status(200).json({
      facets: facets.filter(facet => {
        // Always include price range
        if (facet.type === 'range') return true
        // Only include checkbox facets that have options
        return Array.isArray(facet.options) && facet.options.length > 0
      })
    })

  } catch (error) {
    console.error('Error in POST /store/category-facets:', error)
    res.status(500).json({
      error: "Internal server error"
    })
  }
}