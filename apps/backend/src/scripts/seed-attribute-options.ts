import { ExecArgs } from "@medusajs/framework/types"
import { PRODUCT_ATTRIBUTES_MODULE } from "../modules/product-attributes"

export default async function seedAttributeOptions({ container }: ExecArgs) {
  const productAttributesService = container.resolve(PRODUCT_ATTRIBUTES_MODULE)
  
  console.log("Checking existing attribute options...")
  
  const [existingOptions] = await productAttributesService.listAndCountAttributeGroups()
  console.log(`Found ${existingOptions.length} existing options`)
  
  if (existingOptions.length === 0) {
    console.log("Seeding attribute options...")
    
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
  } else {
    console.log("Attribute options already exist, skipping seed")
    console.log("\nExisting options by group:")
    
    const groups = existingOptions.reduce((acc: any, group: any) => {
      acc[group.group_name] = group.options
      return acc
    }, {})
    
    for (const [group, options] of Object.entries(groups)) {
      console.log(`  ${group}: ${(options as string[]).join(", ")}`)
    }
  }
}