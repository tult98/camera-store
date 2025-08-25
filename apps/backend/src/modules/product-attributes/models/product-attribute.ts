import { model } from "@medusajs/framework/utils"

const ProductAttribute = model.define("product_attribute", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  template_id: model.text(),
  attribute_values: model.json(),
})

export default ProductAttribute