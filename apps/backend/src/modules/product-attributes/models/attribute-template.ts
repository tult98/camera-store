import { model } from "@medusajs/framework/utils"

export interface FacetConfig {
  // Core settings
  is_facet: boolean
  display_priority: number  // 1 = highest priority
  aggregation_type: "term" | "range" | "histogram" | "boolean"
  display_type: "checkbox" | "radio" | "slider" | "dropdown" | "toggle"
  
  // Range configuration (for numeric facets)
  range_config?: {
    min?: number
    max?: number
    step?: number
    buckets?: Array<{
      min: number
      max: number | null
      label: string
    }>
  }
  
  // UI configuration
  show_count?: boolean           // Show (X) next to each option
  collapsible?: boolean          // Can collapse/expand
  initial_collapsed?: boolean    // Start collapsed
  max_display_items?: number     // Show "See more" after X items
  searchable?: boolean           // Add search box for options
  
  // Advanced settings
  cache_ttl?: number             // Cache duration in seconds
  depends_on?: string[]          // Other facets this depends on
}

export interface AttributeDefinition {
  key: string
  label: string
  type: "text" | "number" | "select" | "boolean"
  options?: string[]
  option_group?: string  // Reference to AttributeOption group_code
  required: boolean
  display_order: number
  validation?: {
    rules: string[]
    min?: number
    max?: number
    regex?: string
  }
  default_value?: any
  unit?: string
  
  // NEW: Facet configuration
  facet_config?: FacetConfig
  
  // NEW: Tooltip content for admin UI
  tooltip?: {
    attribute_tooltip?: string  // Explains attribute field purpose
    facet_tooltip?: string      // Explains facet field purpose
  }
}

const AttributeTemplate = model.define("attribute_template", {
  id: model.id().primaryKey(),
  name: model.text().searchable(),
  code: model.text().searchable(),
  description: model.text().nullable(),
  attribute_definitions: model.json(),
  is_active: model.boolean().default(true),
})

export default AttributeTemplate