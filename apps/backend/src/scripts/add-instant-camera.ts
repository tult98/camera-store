import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function addInstantCamera({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Adding Fujifilm Instax Mini 12 instant camera product...')

  // Get existing categories, types, tags, collections
  const { data: categories } = await query.graph({
    entity: 'product_category',
    fields: ['id', 'name', 'handle'],
  })

  const { data: types } = await query.graph({
    entity: 'product_type',
    fields: ['id', 'value'],
  })

  const { data: tags } = await query.graph({
    entity: 'product_tag',
    fields: ['id', 'value'],
  })

  const { data: collections } = await query.graph({
    entity: 'product_collection',
    fields: ['id', 'handle'],
  })

  const { data: salesChannels } = await query.graph({
    entity: 'sales_channel',
    fields: ['id', 'name'],
  })

  const { data: shippingProfiles } = await query.graph({
    entity: 'shipping_profile',
    fields: ['id', 'name'],
  })

  // Find required entities
  const cameraType = types.find((type) => type.value === 'camera')
  const instantCategory = categories.find((cat) => cat.handle === 'may-anh-ly-lien')
  const fujiCollection = collections.find((col) => col.handle === 'fujifilm-collection')
  const defaultSalesChannel = salesChannels.find((sc) => sc.name === 'Kênh Bán Hàng Mặc Định')
  const shippingProfile = shippingProfiles[0]

  // Find relevant tags
  const fujiTag = tags.find((tag) => tag.value === 'Fujifilm')
  const travelTag = tags.find((tag) => tag.value === 'Travel')
  const beginnerTag = tags.find((tag) => tag.value === 'Beginner Friendly')

  logger.info(`Found entities:`)
  logger.info(`- Camera type: ${cameraType?.id || 'NOT FOUND'}`)
  logger.info(`- Instant category: ${instantCategory?.id || 'NOT FOUND'}`)
  logger.info(`- Fuji collection: ${fujiCollection?.id || 'NOT FOUND'}`)
  logger.info(`- Sales channel: ${defaultSalesChannel?.id || 'NOT FOUND'}`)
  logger.info(`- Shipping profile: ${shippingProfile?.id || 'NOT FOUND'}`)

  if (!cameraType || !instantCategory || !fujiCollection || !defaultSalesChannel || !shippingProfile) {
    logger.error('Required entities not found. Make sure to run the main seed script first.')
    return
  }

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Fujifilm Instax Mini 12',
          type_id: cameraType.id,
          category_ids: [instantCategory.id],
          collection_id: fujiCollection.id,
          tag_ids: [
            fujiTag?.id,
            travelTag?.id,
            beginnerTag?.id,
          ].filter(Boolean) as string[],
          description:
            'Fujifilm Instax Mini 12 là máy ảnh lấy liền nhỏ gọn và dễ sử dụng, hoàn hảo cho những khoảnh khắc đáng nhớ. Với chế độ tự động thông minh, ống kính selfie tích hợp và thiết kế màu sắc tươi sáng, máy mang đến trải nghiệm nhiếp ảnh vui tươi và đơn giản.',
          handle: 'fujifilm-instax-mini-12',
          weight: 306,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          metadata: {
            film_format: 'Instax Mini (62×46mm)',
            lens: '60mm f/12.7',
            focus_range: '0.3m to infinity',
            exposure_control: 'Automatic',
            flash: 'Built-in flash with automatic firing',
            selfie_mode: 'Built-in selfie mirror and close-up lens',
            power: '2× AA alkaline batteries',
            dimensions: '104.2 × 121.2 × 67.1mm',
            colors_available: 'Pastel Blue, Lilac Purple, Mint Green, Blossom Pink, Clay White',
            special_features: 'Automatic exposure, Selfie mirror, Close-up lens adapter',
          },
          images: [
            {
              url: 'https://picsum.photos/800/600?random=1',
            },
          ],
          options: [
            {
              title: 'Color',
              values: ['Pastel Blue', 'Lilac Purple', 'Mint Green', 'Blossom Pink', 'Clay White'],
            },
          ],
          variants: [
            {
              title: 'Pastel Blue',
              sku: 'FUJI-INSTAX-MINI12-BLUE',
              options: {
                Color: 'Pastel Blue',
              },
              prices: [
                {
                  amount: 190000000, // 1,900,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Lilac Purple',
              sku: 'FUJI-INSTAX-MINI12-PURPLE',
              options: {
                Color: 'Lilac Purple',
              },
              prices: [
                {
                  amount: 190000000, // 1,900,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Mint Green',
              sku: 'FUJI-INSTAX-MINI12-GREEN',
              options: {
                Color: 'Mint Green',
              },
              prices: [
                {
                  amount: 190000000, // 1,900,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Blossom Pink',
              sku: 'FUJI-INSTAX-MINI12-PINK',
              options: {
                Color: 'Blossom Pink',
              },
              prices: [
                {
                  amount: 190000000, // 1,900,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Clay White',
              sku: 'FUJI-INSTAX-MINI12-WHITE',
              options: {
                Color: 'Clay White',
              },
              prices: [
                {
                  amount: 190000000, // 1,900,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
      ],
    },
  })

  logger.info(`Successfully created Fujifilm Instax Mini 12 product with ID: ${productResult[0].id}`)
}