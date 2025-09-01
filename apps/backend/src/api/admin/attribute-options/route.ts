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

  const [groups, count] = await productAttributesModuleService.listAndCountAttributeGroups(
    {},
    {
      order: { group_name: "ASC" },
    }
  )

  res.json({
    attribute_groups: groups,
    count,
  })
}

