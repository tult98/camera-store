import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

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
    }: FacetsRequest = req.body as FacetsRequest

    if (!category_id) {
      return res.status(400).json({
        error: "category_id is required"
      })
    }

    const productModuleService = req.scope.resolve(Modules.PRODUCT) as any
    const productCategoryService = req.scope.resolve(Modules.PRODUCT) as any

    // Verify category exists
    try {
      await productCategoryService.retrieveProductCategory(category_id)
    } catch (error) {
      return res.status(404).json({
        error: "Category not found"
      })
    }

    // Build base product query for category
    const baseProductQuery: any = {
      categories: {
        id: category_id
      }
    }

    // Get all products in category with necessary relations
    const { products: allCategoryProducts } = await productModuleService.listProducts(
      baseProductQuery,
      {
        relations: [
          "variants",
          "categories",
          "tags"
        ],
        take: 1000 // Reasonable limit for facet calculation
      }
    )

    if (!allCategoryProducts || allCategoryProducts.length === 0) {
      return res.status(200).json({
        facets: []
      })
    }

    // Transform products to our working format
    const transformedProducts = allCategoryProducts.map((product: any) => {
      const defaultVariant = product.variants?.[0]
      
      // Use a default price structure since we can't easily get calculated prices here
      // In a real implementation, you'd use the pricing module to calculate actual prices
      const estimatedPrice = defaultVariant ? 
        (product.metadata?.base_price ? parseInt(product.metadata.base_price as string) : 50000) : 50000
      
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        thumbnail: product.thumbnail,
        price: {
          amount: estimatedPrice,
          currency_code: "usd"
        },
        rating: product.metadata?.rating ? parseFloat(product.metadata.rating as string) : 4.5,
        review_count: product.metadata?.review_count ? parseInt(product.metadata.review_count as string) : 0,
        availability: product.status === "published" ? "in-stock" : "out-of-stock",
        tags: product.tags?.map((tag: any) => tag.value) || [],
        metadata: product.metadata || {}
      }
    })

    // Apply the current filters to get the filtered dataset
    let filteredProducts = [...transformedProducts]

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.tags.some((tag: any) => filters.tags!.includes(tag))
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
            values.includes(product.metadata[key] as string)
          )
        }
      })
    }

    // Helper function to calculate counts for each facet option
    const getCountForFacet = (facetKey: string, facetValue: string, isTag: boolean = false, isMetadata: boolean = false): number => {
      // Create a temporary filter context excluding the current facet
      let tempFiltered = [...transformedProducts]

      // Apply all filters EXCEPT the current facet being calculated
      if (filters.tags && filters.tags.length > 0 && (!isTag || facetKey !== 'tags')) {
        tempFiltered = tempFiltered.filter(product =>
          product.tags.some((tag: any) => filters.tags!.includes(tag))
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
              values.includes(product.metadata[key] as string)
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

    // Extract unique values and build facets dynamically from actual product data
    const allTags = new Set<string>()
    const allAvailability = new Set<string>()
    const metadataFields = new Map<string, Set<string>>()

    // Collect all unique values from the full dataset (not filtered)
    transformedProducts.forEach((product: any) => {
      product.tags.forEach((tag: any) => allTags.add(tag))
      allAvailability.add(product.availability)
      
      // Dynamically collect metadata fields
      Object.entries(product.metadata).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          if (!metadataFields.has(key)) {
            metadataFields.set(key, new Set())
          }
          metadataFields.get(key)!.add(value)
        }
      })
    })

    // Helper function to format labels nicely
    const formatLabel = (value: string): string => {
      const labelMap: Record<string, string> = {
        'full-frame': 'Full-Frame',
        'aps-c': 'APS-C',
        'micro-four-thirds': 'Micro Four Thirds',
        'medium-format': 'Medium Format',
        'sony-e': 'Sony E',
        'canon-rf': 'Canon RF',
        'nikon-z': 'Nikon Z',
        'fujifilm-x': 'Fujifilm X',
        'fujifilm-gfx': 'Fujifilm GFX',
        'l-mount': 'L-Mount',
        'in-stock': 'In Stock',
        'pre-order': 'Pre-Order',
        'limited': 'Limited Availability',
        '8k30': '8K 30p',
        '8k24': '8K 24p',
        '6k60': '6K 60p',
        '6k30': '6K 30p',
        '4k120': '4K 120p',
        '4k60': '4K 60p',
        '4k30': '4K 30p'
      }
      
      return labelMap[value] || value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')
    }

    // Build facets dynamically
    const facets: Facet[] = []

    // Tags facet (use case)
    if (allTags.size > 0) {
      facets.push({
        id: "use_case",
        label: "Use Case",
        type: "checkbox",
        options: Array.from(allTags).map(tag => ({
          value: tag,
          label: formatLabel(tag),
          count: getCountForFacet('tags', tag, true)
        })).filter(opt => opt.count > 0).sort((a, b) => b.count - a.count)
      })
    }

    // Common metadata facets with nice labels
    const commonFacets = [
      { key: 'brand', label: 'Brand' },
      { key: 'sensor_size', label: 'Sensor Size' },
      { key: 'mount_type', label: 'Mount Type' },
      { key: 'video_resolution', label: 'Video Resolution' }
    ]

    commonFacets.forEach(({ key, label }) => {
      const fieldValues = metadataFields.get(key)
      if (fieldValues && fieldValues.size > 0) {
        const options = Array.from(fieldValues).map(value => ({
          value,
          label: formatLabel(value),
          count: getCountForFacet(key, value, false, true)
        })).filter(opt => opt.count > 0)

        if (options.length > 0) {
          // Sort brands alphabetically, others by count
          if (key === 'brand') {
            options.sort((a, b) => a.label.localeCompare(b.label))
          } else if (key === 'video_resolution') {
            // Sort by video quality
            const order = ['8k30', '8k24', '6k60', '6k30', '4k120', '4k60', '4k30']
            options.sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value))
          } else {
            options.sort((a, b) => b.count - a.count)
          }

          facets.push({
            id: key,
            label,
            type: "checkbox",
            options
          })
        }
      }
    })

    // Availability facet
    if (allAvailability.size > 0) {
      facets.push({
        id: "availability",
        label: "Availability",
        type: "checkbox",
        options: Array.from(allAvailability).map(availability => ({
          value: availability,
          label: formatLabel(availability),
          count: getCountForFacet('availability', availability)
        })).filter(opt => opt.count > 0).sort((a, b) => b.count - a.count)
      })
    }

    // Price range facet
    if (filteredProducts.length > 0) {
      const prices = filteredProducts.map(p => p.price.amount)
      facets.push({
        id: "price",
        label: "Price",
        type: "range",
        options: {
          min: Math.min(...prices),
          max: Math.max(...prices)
        }
      })
    }

    // Response matches PRD specification
    return res.status(200).json({
      facets: facets.filter(facet => {
        // Always include price range
        if (facet.type === 'range') return true
        // Only include checkbox facets that have options
        return Array.isArray(facet.options) && facet.options.length > 0
      })
    })

  } catch (error) {
    console.error('Error in POST /store/category-facets:', error)
    return res.status(500).json({
      error: "Internal server error"
    })
  }
}