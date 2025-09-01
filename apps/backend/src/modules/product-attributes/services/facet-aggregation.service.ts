import { Modules } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import type { AttributeDefinition, FacetConfig } from "../models/attribute-template"
import { PRODUCT_ATTRIBUTES_MODULE } from "../index"

interface FacetResponse {
  key: string
  label: string
  type: string
  display_priority: number
  config: FacetConfig
}

interface SystemFacet {
  key: string
  type: "price" | "availability" | "rating"
  aggregation_source: string
  config: {
    display_priority: number
    display_type: "slider" | "checkbox" | "range"
    show_count: boolean
    aggregation_type: "range" | "term"
  }
}

const SYSTEM_FACETS: SystemFacet[] = [
  {
    key: "price",
    type: "price",
    aggregation_source: "variant.calculated_price",
    config: {
      display_priority: 0, // Always show first
      display_type: "slider",
      show_count: true,
      aggregation_type: "range"
    }
  }
]

class FacetAggregationService {
  protected logger_: Logger
  private container_: any

  constructor(container: any, _options?: any) {
    this.container_ = container
    this.logger_ = container.logger || console
  }

  async getFacetsForCategory(categoryId: string, container?: any): Promise<FacetResponse[]> {
    const activeContainer = container || this.container_
    try {
      // Get all products in the category using container resolve
      const productModule = activeContainer.resolve(Modules.PRODUCT)
      const products = await productModule.listProducts({
        categories: { id: [categoryId] }
      })

      if (!products || products.length === 0) {
        console.log(`No products found for category ${categoryId}`)
        return this.getSystemFacets()
      }

      const productIds = products.map((p: { id: string }) => p.id)

      // Get all ProductAttribute records for these products through the module service
      const productAttributesService = activeContainer.resolve(PRODUCT_ATTRIBUTES_MODULE)
      const productAttributes = await productAttributesService.listProductAttributes({
        product_id: productIds
      })

      if (!productAttributes || productAttributes.length === 0) {
        console.log(`No product attributes found for products in category ${categoryId}`)
        return this.getSystemFacets()
      }

      // Get unique template IDs
      const templateIds = [...new Set(productAttributes.map((pa: any) => pa.template_id))]

      // Get all AttributeTemplates through the module service
      const templates = await productAttributesService.listAttributeTemplates({
        id: templateIds,
        is_active: true
      })

      // Extract facet-enabled attributes from all templates
      const attributeFacets = this.extractFacetsFromTemplates(templates)

      // Combine with system facets
      const systemFacets = this.getSystemFacets()
      
      // Merge and sort by display_priority
      const allFacets = [...systemFacets, ...attributeFacets]
      return allFacets.sort((a, b) => a.display_priority - b.display_priority)

    } catch (error) {
      console.error(`Error getting facets for category ${categoryId}:`, error as Error)
      // Return system facets as fallback
      return this.getSystemFacets()
    }
  }

  private extractFacetsFromTemplates(templates: any[]): FacetResponse[] {
    const facets: FacetResponse[] = []

    for (const template of templates) {
      if (!template.attribute_definitions || !Array.isArray(template.attribute_definitions)) {
        continue
      }

      for (const attrDef of template.attribute_definitions as AttributeDefinition[]) {
        // Check if this attribute is configured as a facet
        if (attrDef.facet_config?.is_facet) {
          facets.push({
            key: attrDef.key,
            label: attrDef.label,
            type: attrDef.type,
            display_priority: attrDef.facet_config.display_priority,
            config: attrDef.facet_config
          })
        }
      }
    }

    return facets
  }

  private getSystemFacets(): FacetResponse[] {
    return SYSTEM_FACETS.map(sf => ({
      key: sf.key,
      label: this.getSystemFacetLabel(sf.key),
      type: sf.type,
      display_priority: sf.config.display_priority,
      config: {
        is_facet: true,
        display_priority: sf.config.display_priority,
        aggregation_type: sf.config.aggregation_type,
        display_type: "slider" as const,
        show_count: sf.config.show_count
      }
    }))
  }

  private getSystemFacetLabel(key: string): string {
    switch (key) {
      case "price":
        return "Price"
      case "availability":
        return "Availability"
      case "rating":
        return "Customer Rating"
      default:
        return key.charAt(0).toUpperCase() + key.slice(1)
    }
  }

  async aggregateSystemFacets(_categoryId: string) {
    // Future implementation for POST /store/facets/aggregate
    // Will aggregate min/max prices, availability counts, etc.
    throw new Error("Not implemented yet")
  }

  async aggregateAttributeFacets(_categoryId: string, _appliedFilters?: Record<string, unknown>) {
    // Future implementation for POST /store/facets/aggregate  
    // Will aggregate attribute values with counts
    throw new Error("Not implemented yet")
  }
}

export default FacetAggregationService