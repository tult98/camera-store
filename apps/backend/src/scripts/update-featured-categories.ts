import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'

export default async function updateFeaturedCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Starting to update categories as featured...')

  try {
    // Get all main categories (parent categories only)
    const categoriesResult = await query.graph({
      entity: "product_category",
      fields: [
        "id",
        "name", 
        "description",
        "handle",
        "metadata"
      ],
      filters: {
        is_active: true,
        parent_category_id: null
      }
    })

    logger.info(`Found ${categoriesResult.data.length} main categories`)

    // Sample hero banner URLs for demo
    const heroBanners = [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ]

    // Update the first few categories to be featured
    const categoriesToUpdate = categoriesResult.data.slice(0, 3) // Take first 3 categories

    for (let i = 0; i < categoriesToUpdate.length; i++) {
      const category = categoriesToUpdate[i]
      
      logger.info(`Updating category: ${category.name} (ID: ${category.id})`)

      const updatedMetadata = {
        ...category.metadata,
        hero_image_url: heroBanners[i] || heroBanners[0],
        is_featured: true,
        display_order: i
      }

      await productService.updateProductCategories(category.id, {
        metadata: updatedMetadata
      })

      logger.info(`✓ Updated ${category.name} as featured category`)
    }

    logger.info('Successfully updated categories as featured!')

    // Show the updated categories
    logger.info('Featured categories:')
    for (const category of categoriesToUpdate) {
      logger.info(`- ${category.name} (${category.handle})`)
    }

  } catch (error) {
    logger.error('Error updating featured categories:', error as Error)
    throw error as Error
  }
}