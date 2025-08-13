import { CreateInventoryLevelInput, ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { createInventoryLevelsWorkflow } from '@medusajs/medusa/core-flows'

export default async function addInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Adding inventory levels for new products...')

  // Get stock locations
  const { data: stockLocations } = await query.graph({
    entity: 'stock_location',
    fields: ['id', 'name'],
  })

  // Get all inventory items
  const { data: inventoryItems } = await query.graph({
    entity: 'inventory_item',
    fields: ['id'],
  })

  // Get existing inventory levels to avoid duplicates
  const { data: existingLevels } = await query.graph({
    entity: 'inventory_level',
    fields: ['inventory_item_id', 'location_id'],
  })

  const stockLocation = stockLocations[0]
  if (!stockLocation) {
    logger.error('No stock location found')
    return
  }

  const inventoryLevels: CreateInventoryLevelInput[] = []
  for (const inventoryItem of inventoryItems) {
    // Check if inventory level already exists for this item and location
    const exists = existingLevels.some(
      (level) => 
        level.inventory_item_id === inventoryItem.id && 
        level.location_id === stockLocation.id
    )
    
    if (!exists) {
      const inventoryLevel = {
        location_id: stockLocation.id,
        stocked_quantity: 100,
        inventory_item_id: inventoryItem.id,
      }
      inventoryLevels.push(inventoryLevel)
    }
  }

  if (inventoryLevels.length > 0) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryLevels,
      },
    })

    logger.info(`Successfully created ${inventoryLevels.length} inventory levels`)
  } else {
    logger.info('All inventory items already have inventory levels')
  }
}