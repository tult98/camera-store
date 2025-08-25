import { model } from "@medusajs/framework/utils"

const AttributeOption = model.define("attribute_option", {
  id: model.id().primaryKey(),
  group_code: model.text(),
  value: model.text(),
  display_order: model.number().default(0),
  metadata: model.json().nullable(),
  is_active: model.boolean().default(true),
})

export default AttributeOption