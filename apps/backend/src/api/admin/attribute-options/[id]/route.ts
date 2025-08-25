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

  const attributeOption = await productAttributesModuleService.retrieveAttributeOption(id, {
    relations: []
  })

  res.json({
    attribute_option: attributeOption,
  })
}

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)
    const { id } = req.params

    const { value, display_order, metadata, is_active } = req.body as {
      value?: string
      display_order?: number
      metadata?: Record<string, unknown>
      is_active?: boolean
    }

    const updateData: Record<string, any> = {}
    
    if (value !== undefined) {
      updateData["value"] = value
    }
    
    if (display_order !== undefined) {
      updateData["display_order"] = display_order
    }
    
    if (metadata !== undefined) {
      updateData["metadata"] = metadata
    }
    
    if (is_active !== undefined) {
      updateData["is_active"] = is_active
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid fields to update"
      })
    }
    
    await productAttributesModuleService.updateAttributeOptions({
      selector: { id },
      data: updateData
    })
    
    const attributeOption = await productAttributesModuleService.retrieveAttributeOption(id, {
      relations: []
    })

    return res.json({
      attribute_option: attributeOption,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return res.status(500).json({
      message: "Failed to update attribute option",
      error: errorMessage
    })
  }
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)
  const { id } = req.params

  await productAttributesModuleService.softDeleteAttributeOptions([id])

  res.status(200).json({
    id,
    object: "attribute_option",
    deleted: true,
  })
}