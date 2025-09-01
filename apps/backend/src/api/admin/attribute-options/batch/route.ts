import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/framework/http"
import { PRODUCT_ATTRIBUTES_MODULE } from "../../../../modules/product-attributes"

type AttributeGroupData = {
  id?: string
  group_name: string
  options: string[]
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)

  const { attributes } = req.body as {
    attributes: AttributeGroupData[]
  }

  const updatedGroups = []
  const createdGroups = []

  // First, get all existing groups to check for duplicates by name
  const [existingGroups] = await productAttributesModuleService.listAndCountAttributeGroups({})
  const existingGroupsByName = new Map(
    existingGroups.map(g => [g.group_name.toLowerCase(), g])
  )

  for (const attribute of attributes) {
    const existingGroup = existingGroupsByName.get(attribute.group_name.toLowerCase())
    
    if (existingGroup) {
      // Update existing group
      const updated = await productAttributesModuleService.updateAttributeGroups(
        { id: existingGroup.id },
        {
          options: attribute.options as unknown as Record<string, unknown>,
        }
      )
      updatedGroups.push(Array.isArray(updated) ? updated[0] : updated)
    } else {
      // Create new group
      const group = await productAttributesModuleService.createAttributeGroups({
        group_name: attribute.group_name,
        options: attribute.options as unknown as Record<string, unknown>,
      })
      createdGroups.push(group)
    }
  }

  res.status(201).json({
    attribute_groups: [...updatedGroups, ...createdGroups],
    updated_count: updatedGroups.length,
    created_count: createdGroups.length,
    total_count: updatedGroups.length + createdGroups.length,
  })
}