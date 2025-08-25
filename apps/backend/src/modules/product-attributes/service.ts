import { MedusaService } from "@medusajs/framework/utils"
import { AttributeTemplate, ProductAttribute, AttributeOption } from "./models"

class ProductAttributesModuleService extends MedusaService({
  AttributeTemplate,
  ProductAttribute, 
  AttributeOption,
}) {}

export default ProductAttributesModuleService