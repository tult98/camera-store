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

  const limit = parseInt(req.query['limit'] as string) || 20
  const offset = parseInt(req.query['offset'] as string) || 0
  const product_id = req.query['product_id'] as string
  const template_id = req.query['template_id'] as string
  
  const filters: any = {}
  if (product_id) filters.product_id = product_id
  if (template_id) filters.template_id = template_id
  
  const [productAttributes, count] = await productAttributesModuleService.listAndCountProductAttributes(
    filters,
    {
      take: limit,
      skip: offset,
    }
  )

  res.json({
    product_attributes: productAttributes,
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

  const { product_id, template_id, attribute_values } = req.body as {
    product_id: string
    template_id: string
    attribute_values: Record<string, unknown>
  }

  const productAttribute = await productAttributesModuleService.createProductAttributes({
    product_id,
    template_id,
    attribute_values,
  })

  res.status(201).json({
    product_attribute: productAttribute,
  })
}