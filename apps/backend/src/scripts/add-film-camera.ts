import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function addFilmCamera({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Adding Leica M11 film camera product...')

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
  const filmCategory = categories.find((cat) => cat.handle === 'may-anh-phim')
  const professionalCollection = collections.find((col) => col.handle === 'professional-series')
  const defaultSalesChannel = salesChannels.find((sc) => sc.name === 'Kênh Bán Hàng Mặc Định')
  const shippingProfile = shippingProfiles[0]

  // Find relevant tags
  const leicaTag = tags.find((tag) => tag.value === 'Leica')
  const fullFrameTag = tags.find((tag) => tag.value === 'Full Frame')
  const professionalTag = tags.find((tag) => tag.value === 'Professional')
  const streetTag = tags.find((tag) => tag.value === 'Street Photography')
  const portraitTag = tags.find((tag) => tag.value === 'Portrait')

  logger.info(`Found entities:`)
  logger.info(`- Camera type: ${cameraType?.id || 'NOT FOUND'}`)
  logger.info(`- Film category: ${filmCategory?.id || 'NOT FOUND'}`)
  logger.info(`- Professional collection: ${professionalCollection?.id || 'NOT FOUND'}`)
  logger.info(`- Sales channel: ${defaultSalesChannel?.id || 'NOT FOUND'}`)
  logger.info(`- Shipping profile: ${shippingProfile?.id || 'NOT FOUND'}`)

  if (!cameraType || !filmCategory || !professionalCollection || !defaultSalesChannel || !shippingProfile) {
    logger.error('Required entities not found. Make sure to run the main seed script first.')
    return
  }

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Leica M11',
          type_id: cameraType.id,
          category_ids: [filmCategory.id],
          collection_id: professionalCollection.id,
          tag_ids: [
            leicaTag?.id,
            fullFrameTag?.id,
            professionalTag?.id,
            streetTag?.id,
            portraitTag?.id,
          ].filter(Boolean) as string[],
          description:
            'Leica M11 là đỉnh cao của nhiếp ảnh rangefinder với cảm biến BSI CMOS 60MP, thiết kế cổ điển bền bỉ và chất lượng hình ảnh xuất sắc. Tương thích với toàn bộ hệ thống ống kính M, máy mang đến trải nghiệm nhiếp ảnh thuần túy và tinh tế nhất.',
          handle: 'leica-m11',
          weight: 640,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          metadata: {
            sensor: '60MP BSI CMOS',
            mount: 'Leica M',
            iso_range: '64-50000',
            viewfinder: 'Bright line rangefinder',
            lcd: '3.0-inch touchscreen (2.95M dots)',
            connectivity: 'WiFi, Bluetooth, USB-C',
            battery_life: '1700 shots',
            dimensions: '139 × 80 × 38.5mm',
            build: 'Magnesium alloy top plate, aluminum body',
            special_features: 'Triple resolution modes (60MP/36MP/18MP), Silent mode',
            lens_compatibility: 'All Leica M lenses from 1954 onwards',
            storage: 'Internal 256GB + SD card slot',
          },
          images: [
            {
              url: 'https://picsum.photos/800/600?random=3',
            },
          ],
          options: [
            {
              title: 'Color',
              values: ['Silver Chrome', 'Black Paint'],
            },
          ],
          variants: [
            {
              title: 'Silver Chrome',
              sku: 'LEICA-M11-SILVER',
              options: {
                Color: 'Silver Chrome',
              },
              prices: [
                {
                  amount: 20500000000, // 205,000,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Black Paint',
              sku: 'LEICA-M11-BLACK',
              options: {
                Color: 'Black Paint',
              },
              prices: [
                {
                  amount: 21000000000, // 210,000,000 VND
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

  logger.info(`Successfully created Leica M11 product with ID: ${productResult[0].id}`)
}