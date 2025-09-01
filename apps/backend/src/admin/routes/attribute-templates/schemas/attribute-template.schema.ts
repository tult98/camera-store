import { z } from "zod"

// Validation schema for facet configuration
export const FacetConfigSchema = z.object({
  is_facet: z.boolean().default(false),
  display_priority: z.number().min(1, "Display priority must be at least 1").default(1),
  aggregation_type: z.enum(["term", "range", "histogram", "boolean"]).default("term"),
  display_type: z.enum(["checkbox", "radio", "slider", "dropdown", "toggle"]).default("checkbox"),
  
  range_config: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive("Step must be positive").optional(),
    buckets: z.array(z.object({
      min: z.number(),
      max: z.number().nullable(),
      label: z.string().min(1, "Bucket label is required"),
    })).optional(),
  }).optional(),
  
  show_count: z.boolean().default(true),
  collapsible: z.boolean().default(true),
  initial_collapsed: z.boolean().default(false),
  max_display_items: z.number().positive("Max display items must be positive").optional(),
  searchable: z.boolean().default(true),
  
  cache_ttl: z.number().positive("Cache TTL must be positive").optional(),
  depends_on: z.array(z.string()).optional(),
}).optional()

// Validation schema for tooltip content
export const TooltipSchema = z.object({
  attribute_tooltip: z.string().optional(),
  facet_tooltip: z.string().optional(),
}).optional()

// Validation schema for attribute definitions
export const AttributeDefinitionSchema = z.object({
  key: z.string().min(1, "Attribute key is required"),
  label: z.string().min(1, "Attribute label is required"),
  type: z.enum(["text", "number", "select", "boolean"], {
    message: "Attribute type is required",
  }).default("text"),
  options: z.array(z.string()).optional(),
  option_group: z.string().nullable().optional(),
  required: z.boolean().default(false),
  display_order: z.number().default(0),
  validation: z.object({
    rules: z.array(z.string()),
    min: z.number().optional(),
    max: z.number().optional(),
    regex: z.string().optional(),
  }).optional(),
  default_value: z.unknown().optional(),
  unit: z.string().optional(),
  
  // NEW: Facet configuration
  facet_config: FacetConfigSchema,
  
  // NEW: Tooltip content for admin UI
  tooltip: TooltipSchema,
}).refine((data) => {
  // For select types, require either options or option_group
  if (data.type === "select") {
    return (data.options && data.options.length > 0) || data.option_group;
  }
  return true;
}, {
  message: "Select attributes must have either custom options or an option group",
  path: ["options"],
})

// Main form schema
export const AttributeTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required").trim(),
  code: z.string().min(1, "Template code is required").trim(),
  description: z.string().optional(),
  attribute_definitions: z.array(AttributeDefinitionSchema),
  is_active: z.boolean(),
})

// TypeScript types derived from schemas
export type AttributeDefinitionFormData = z.infer<typeof AttributeDefinitionSchema>
export type AttributeTemplateFormData = z.infer<typeof AttributeTemplateSchema>

// Default values for new attribute definition
export const defaultAttributeDefinition: AttributeDefinitionFormData = {
  key: "",
  label: "",
  type: "text",
  required: false,
  display_order: 0,
  options: undefined,
  option_group: undefined,
  facet_config: {
    is_facet: false,
    display_priority: 1,
    aggregation_type: "term",
    display_type: "checkbox",
    show_count: true,
    collapsible: true,
    initial_collapsed: false,
    searchable: true,
  },
}

// Default values for new template
export const defaultAttributeTemplate: AttributeTemplateFormData = {
  name: "",
  code: "",
  description: "",
  attribute_definitions: [],
  is_active: true,
}