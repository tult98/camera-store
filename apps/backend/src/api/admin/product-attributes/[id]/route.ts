import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/framework/http"
import { PRODUCT_ATTRIBUTES_MODULE } from "../../../../modules/product-attributes"

export const GET = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)
  const { id } = req.params

  const productAttribute = await productAttributesModuleService.retrieveProductAttribute(id)

  res.json({
    product_attribute: productAttribute,
  })
}

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)
  const { id } = req.params

  const updateData = req.body as {
    product_id?: string
    template_id?: string
    attribute_values?: Record<string, unknown>
  }
  
  const [productAttribute] = await productAttributesModuleService.updateProductAttributes([{
    id,
    ...updateData
  }])

  res.json({
    product_attribute: productAttribute,
  })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)
  const { id } = req.params

  await productAttributesModuleService.softDeleteProductAttributes([id])

  res.status(200).json({
    id,
    object: "product_attribute",
    deleted: true,
  })
}