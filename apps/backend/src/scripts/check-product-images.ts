import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkProductImages({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Checking current product images...')

  // Get all products with their images
  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'handle', 'title', 'images.id', 'images.url'],
  })

  logger.info(`Found ${products.length} products:`)
  
  products.forEach(product => {
    logger.info(`\n📦 ${product.title} (${product.handle})`)
    if (product.images && product.images.length > 0) {
      product.images.forEach((image, index) => {
        logger.info(`  🖼️  Image ${index + 1}: ${image.url}`)
        logger.info(`     ID: ${image.id}`)
      })
    } else {
      logger.info(`  ❌ No images found`)
    }
  })
}