import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/framework/http"
import { PRODUCT_ATTRIBUTES_MODULE } from "../../../modules/product-attributes"

export const GET = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)

  const limit = parseInt(req.query['limit'] as string) || 50
  const offset = parseInt(req.query['offset'] as string) || 0
  const group_code = req.query['group_code'] as string
  
  const filters = group_code ? { group_code } : {}
  
  const [options, count] = await productAttributesModuleService.listAndCountAttributeOptions(
    filters,
    {
      take: limit,
      skip: offset,
      order: { display_order: "ASC" },
    }
  )

  res.json({
    attribute_options: options,
    count,
    limit,
    offset,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)

  const { group_code, value, display_order, metadata, is_active } = req.body as {
    group_code: string
    value: string
    display_order?: number
    metadata?: Record<string, unknown>
    is_active?: boolean
  }

  const attributeOption = await productAttributesModuleService.createAttributeOptions({
    group_code,
    value,
    display_order: display_order ?? 0,
    metadata,
    is_active: is_active ?? true,
  })

  res.status(201).json({
    attribute_option: attributeOption,
  })
}