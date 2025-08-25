import { ExecArgs } from "@medusajs/framework/types"
import { PRODUCT_ATTRIBUTES_MODULE } from "../modules/product-attributes"

export default async function seedAttributeOptions({ container }: ExecArgs) {
  const productAttributesService = container.resolve(PRODUCT_ATTRIBUTES_MODULE)
  
  console.log("Checking existing attribute options...")
  
  const [existingOptions] = await productAttributesService.listAndCountAttributeOptions()
  console.log(`Found ${existingOptions.length} existing options`)
  
  if (existingOptions.length === 0) {
    console.log("Seeding attribute options...")
    
    const sensorTypeOptions = [
      { group_code: "sensor_type", value: "full_frame", label: "Full Frame", display_order: 1, is_active: true },
      { group_code: "sensor_type", value: "aps_c", label: "APS-C", display_order: 2, is_active: true },
      { group_code: "sensor_type", value: "micro_four_thirds", label: "Micro Four Thirds", display_order: 3, is_active: true },
      { group_code: "sensor_type", value: "medium_format", label: "Medium Format", display_order: 4, is_active: true },
      { group_code: "sensor_type", value: "1_inch", label: "1-inch", display_order: 5, is_active: true },
    ]
    
    const videoResolutionOptions = [
      { group_code: "video_resolution", value: "8k", label: "8K", display_order: 1, is_active: true },
      { group_code: "video_resolution", value: "6k", label: "6K", display_order: 2, is_active: true },
      { group_code: "video_resolution", value: "4k", label: "4K", display_order: 3, is_active: true },
      { group_code: "video_resolution", value: "1080p", label: "Full HD (1080p)", display_order: 4, is_active: true },
      { group_code: "video_resolution", value: "720p", label: "HD (720p)", display_order: 5, is_active: true },
    ]
    
    const autofocusTypeOptions = [
      { group_code: "autofocus_type", value: "phase_detection", label: "Phase Detection", display_order: 1, is_active: true },
      { group_code: "autofocus_type", value: "contrast_detection", label: "Contrast Detection", display_order: 2, is_active: true },
      { group_code: "autofocus_type", value: "hybrid", label: "Hybrid (Phase + Contrast)", display_order: 3, is_active: true },
      { group_code: "autofocus_type", value: "dual_pixel", label: "Dual Pixel", display_order: 4, is_active: true },
    ]
    
    const batteryTypeOptions = [
      { group_code: "battery_type", value: "np_fw50", label: "NP-FW50", display_order: 1, is_active: true },
      { group_code: "battery_type", value: "np_fz100", label: "NP-FZ100", display_order: 2, is_active: true },
      { group_code: "battery_type", value: "lp_e6nh", label: "LP-E6NH", display_order: 3, is_active: true },
      { group_code: "battery_type", value: "en_el15c", label: "EN-EL15c", display_order: 4, is_active: true },
      { group_code: "battery_type", value: "np_w235", label: "NP-W235", display_order: 5, is_active: true },
      { group_code: "battery_type", value: "blx_1", label: "BLX-1", display_order: 6, is_active: true },
    ]
    
    const allOptions = [
      ...sensorTypeOptions,
      ...videoResolutionOptions,
      ...autofocusTypeOptions,
      ...batteryTypeOptions,
    ]
    
    for (const option of allOptions) {
      await productAttributesService.createAttributeOptions(option)
    }
    
    console.log(`Created ${allOptions.length} attribute options`)
  } else {
    console.log("Attribute options already exist, skipping seed")
    console.log("\nExisting options by group:")
    
    const groups = existingOptions.reduce((acc: any, option: any) => {
      if (!acc[option.group_code]) {
        acc[option.group_code] = []
      }
      acc[option.group_code].push(option.label)
      return acc
    }, {})
    
    for (const [group, options] of Object.entries(groups)) {
      console.log(`  ${group}: ${(options as string[]).join(", ")}`)
    }
  }
}