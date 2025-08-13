import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { updateProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function updateProductImages({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Updating product images with working URLs...')

  // Get all products that need image updates
  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'handle', 'title', 'images.id', 'images.url'],
  })

  logger.info(`Found ${products.length} products`)

  // Define the broken URLs and their replacements
  const imageUpdates = [
    {
      handle: 'fujifilm-instax-mini-12',
      oldUrl: 'https://i.postimg.cc/rF8Z9QmG/instax-mini-12.webp',
      newUrl: 'https://picsum.photos/800/600?random=1'
    },
    {
      handle: 'canon-rf-50mm-f1-2l-usm',
      oldUrl: 'https://i.postimg.cc/3N0VdpYT/canon-rf-50mm-f1-2l.webp',
      newUrl: 'https://picsum.photos/800/600?random=2'
    },
    {
      handle: 'leica-m11',
      oldUrl: 'https://i.postimg.cc/SNHC8bXk/leica-m11.webp',
      newUrl: 'https://picsum.photos/800/600?random=3'
    },
    {
      handle: 'gopro-hero-12-black',
      oldUrl: 'https://i.postimg.cc/CxJdXmYx/gopro-hero-12.webp',
      newUrl: 'https://picsum.photos/800/600?random=4'
    },
    {
      handle: 'sony-a7-iv',
      oldUrl: 'https://i.postimg.cc/t4gWwqHj/sony-a7-iv.webp',
      newUrl: 'https://picsum.photos/800/600?random=5'
    },
    {
      handle: 'sony-fe-24-70mm-f2-8-gm-ii',
      oldUrl: 'https://i.postimg.cc/kgHd0z7H/sony-fe-24-70-gm2.webp',
      newUrl: 'https://picsum.photos/800/600?random=6'
    },
    {
      handle: 'canon-eos-r5',
      oldUrl: 'https://i.postimg.cc/6q2DL6kd/canon-eos-r5.webp',
      newUrl: 'https://picsum.photos/800/600?random=7'
    }
  ]

  for (const update of imageUpdates) {
    const product = products.find(p => p.handle === update.handle)
    
    if (!product) {
      logger.info(`Product with handle ${update.handle} not found, skipping...`)
      continue
    }

    logger.info(`Updating images for product: ${product.title} (${product.handle})`)

    // Find the image that needs updating
    const imageToUpdate = product.images?.find(img => img.url === update.oldUrl)
    
    if (!imageToUpdate) {
      logger.info(`No broken image found for ${product.handle}, skipping...`)
      continue
    }

    try {
      // Update the product with new image URL
      await updateProductsWorkflow(container).run({
        input: {
          selector: { id: product.id },
          update: {
            images: [
              {
                id: imageToUpdate.id,
                url: update.newUrl
              }
            ]
          }
        }
      })

      logger.info(`✅ Successfully updated image for ${product.title}`)
    } catch (error) {
      logger.error(`❌ Failed to update ${product.title}:`, error)
    }
  }

  logger.info('Finished updating product images.')
}