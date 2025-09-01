import { ExecArgs } from "@medusajs/framework/types"
import { PRODUCT_ATTRIBUTES_MODULE } from "../modules/product-attributes"

export default async function resetAttributeOptions({ container }: ExecArgs) {
  const productAttributesService = container.resolve(PRODUCT_ATTRIBUTES_MODULE)
  
  console.log("Deleting all existing attribute options...")
  
  const [existingOptions] = await productAttributesService.listAndCountAttributeGroups()
  
  for (const option of existingOptions) {
    await productAttributesService.deleteAttributeGroups(option.id)
  }
  
  console.log(`Deleted ${existingOptions.length} options`)
  
  console.log("Creating new attribute options...")
  
  const attributeGroups = [
    {
      group_name: "Sensor Type",
      options: ["Full Frame", "APS-C", "Micro Four Thirds", "Medium Format", "1-inch"]
    },
    {
      group_name: "Video Resolution", 
      options: ["8K", "6K", "4K", "Full HD (1080p)", "HD (720p)"]
    },
    {
      group_name: "Autofocus Type",
      options: ["Phase Detection", "Contrast Detection", "Hybrid (Phase + Contrast)", "Dual Pixel"]
    },
    {
      group_name: "Battery Type",
      options: ["NP-FW50", "NP-FZ100", "LP-E6NH", "EN-EL15c", "NP-W235", "BLX-1"]
    }
  ]
  
  for (const group of attributeGroups) {
    await productAttributesService.createAttributeGroups({
      group_name: group.group_name,
      options: group.options as unknown as Record<string, unknown>
    })
  }
  
  console.log(`Created ${attributeGroups.length} attribute groups`)
  
  console.log("\nCreated options by group:")
  
  const [newOptions] = await productAttributesService.listAndCountAttributeGroups()
  const groups = newOptions.reduce((acc: any, group: any) => {
    acc[group.group_name] = group.options
    return acc
  }, {})
  
  for (const [group, options] of Object.entries(groups)) {
    console.log(`  ${group}: ${(options as string[]).join(", ")}`)
  }
}