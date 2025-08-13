import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { updateProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function fixThumbnails({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Fixing product thumbnails...')

  // Define the thumbnail updates - matching the same URLs we used for images
  const thumbnailUpdates = [
    {
      handle: 'fujifilm-instax-mini-12',
      newUrl: 'https://picsum.photos/800/600?random=1'
    },
    {
      handle: 'canon-rf-50mm-f1-2l-usm',
      newUrl: 'https://picsum.photos/800/600?random=2'
    },
    {
      handle: 'leica-m11',
      newUrl: 'https://picsum.photos/800/600?random=3'
    },
    {
      handle: 'gopro-hero-12-black',
      newUrl: 'https://picsum.photos/800/600?random=4'
    },
    {
      handle: 'sony-a7-iv',
      newUrl: 'https://picsum.photos/800/600?random=5'
    },
    {
      handle: 'sony-fe-24-70mm-f2-8-gm-ii',
      newUrl: 'https://picsum.photos/800/600?random=6'
    },
    {
      handle: 'canon-eos-r5',
      newUrl: 'https://picsum.photos/800/600?random=7'
    }
  ]

  // Get all products
  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'handle', 'title', 'thumbnail'],
  })

  for (const update of thumbnailUpdates) {
    const product = products.find(p => p.handle === update.handle)
    
    if (!product) {
      logger.info(`Product with handle ${update.handle} not found, skipping...`)
      continue
    }

    logger.info(`Updating thumbnail for: ${product.title} (${product.handle})`)
    logger.info(`  Old: ${product.thumbnail}`)
    logger.info(`  New: ${update.newUrl}`)

    try {
      await updateProductsWorkflow(container).run({
        input: {
          selector: { id: product.id },
          update: {
            thumbnail: update.newUrl
          }
        }
      })

      logger.info(`✅ Successfully updated thumbnail for ${product.title}`)
    } catch (error) {
      logger.error(`❌ Failed to update ${product.title}:`, error)
    }
  }

  logger.info('Finished fixing thumbnails.')
}