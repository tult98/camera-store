import { z } from "zod"

// Validation schema for facet configuration
export const FacetConfigSchema = z.object({
  is_facet: z.boolean(),
  display_priority: z.number().min(1, "Display priority must be at least 1"),
  aggregation_type: z.enum(["term", "range", "histogram", "boolean"]),
  display_type: z.enum(["checkbox", "radio", "slider", "dropdown", "toggle"]),
  
  range_config: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive("Step must be positive").optional(),
  }).optional(),
  
  show_count: z.boolean(),
  max_display_items: z.number().positive("Max display items must be positive"),
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
  }),
  options: z.array(z.string()).optional(),
  option_group: z.string().nullable().optional(),
  required: z.boolean(),
  display_order: z.number(),
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
    max_display_items: 5,
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