import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/framework/http"
import { PRODUCT_ATTRIBUTES_MODULE } from "../../../../modules/product-attributes"


export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)
  const { id } = req.params

  await productAttributesModuleService.softDeleteAttributeGroups([id])

  res.status(200).json({
    id,
    object: "attribute_group",
    deleted: true,
  })
}