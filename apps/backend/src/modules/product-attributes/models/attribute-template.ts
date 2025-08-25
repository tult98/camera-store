import { model } from "@medusajs/framework/utils"

export interface AttributeDefinition {
  key: string
  label: string
  type: "text" | "number" | "select" | "boolean"
  options?: string[]
  option_group?: string  // Reference to AttributeOption group_code
  required: boolean
  display_order: number
  help_text?: string
  validation?: {
    rules: string[]
    min?: number
    max?: number
    regex?: string
  }
  default_value?: any
  unit?: string
  placeholder?: string
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