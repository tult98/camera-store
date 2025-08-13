import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkThumbnails({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Checking current product thumbnails...')

  // Get all products with their thumbnail field
  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'handle', 'title', 'thumbnail', 'images.id', 'images.url'],
  })

  logger.info(`Found ${products.length} products:`)
  
  products.forEach(product => {
    logger.info(`\n📦 ${product.title} (${product.handle})`)
    logger.info(`  🖼️  Thumbnail: ${product.thumbnail || 'NULL'}`)
    if (product.images && product.images.length > 0) {
      product.images.forEach((image, index) => {
        logger.info(`  🖼️  Image ${index + 1}: ${image.url}`)
      })
    }
  })
}