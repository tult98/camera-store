import { model } from "@medusajs/framework/utils"

const AttributeGroup = model.define("attribute_group", {
  id: model.id().primaryKey(),
  group_name: model.text(),
  options: model.json(),
})

export default AttributeGroup