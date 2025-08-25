import { z } from "zod"

// Validation schema for attribute definitions
export const AttributeDefinitionSchema = z.object({
  key: z.string().min(1, "Attribute key is required"),
  label: z.string().min(1, "Attribute label is required"),
  type: z.enum(["text", "number", "select", "boolean"], {
    message: "Attribute type is required",
  }).default("text"),
  options: z.array(z.string()).optional(),
  option_group: z.string().optional(),
  required: z.boolean().default(false),
  display_order: z.number().default(0),
  help_text: z.string().optional(),
  validation: z.object({
    rules: z.array(z.string()),
    min: z.number().optional(),
    max: z.number().optional(),
    regex: z.string().optional(),
  }).optional(),
  default_value: z.unknown().optional(),
  unit: z.string().optional(),
  placeholder: z.string().optional(),
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
}

// Default values for new template
export const defaultAttributeTemplate: AttributeTemplateFormData = {
  name: "",
  code: "",
  description: "",
  attribute_definitions: [],
  is_active: true,
}