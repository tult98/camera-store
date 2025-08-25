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
  
  const [options] = await productAttributesModuleService.listAndCountAttributeOptions(
    { is_active: true },
    {
      order: { group_code: "ASC", display_order: "ASC" },
    }
  )
  
  // Group options by group_code
  const groups = options.reduce((acc: any, option: any) => {
    if (!acc[option.group_code]) {
      acc[option.group_code] = {
        group_code: option.group_code,
        options: []
      }
    }
    acc[option.group_code].options.push({
      value: option.value,
      display_order: option.display_order
    })
    return acc
  }, {})
  
  // Convert to array and format
  const groupList = Object.values(groups).map((group: any) => ({
    ...group,
    display_name: group.group_code.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
  }))
  
  res.json({
    option_groups: groupList,
  })
}