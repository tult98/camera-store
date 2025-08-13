import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function addActionCamera({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Adding GoPro Hero 12 Black action camera product...')

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
  const actionCategory = categories.find((cat) => cat.handle === 'may-anh-hanh-dong')
  const travelCollection = collections.find((col) => col.handle === 'travel-gear')
  const defaultSalesChannel = salesChannels.find((sc) => sc.name === 'Kênh Bán Hàng Mặc Định')
  const shippingProfile = shippingProfiles[0]

  // Find relevant tags
  const videoTag = tags.find((tag) => tag.value === '4K Video')
  const wifiTag = tags.find((tag) => tag.value === 'WiFi')
  const bluetoothTag = tags.find((tag) => tag.value === 'Bluetooth')
  const touchscreenTag = tags.find((tag) => tag.value === 'Touchscreen')
  const weatherSealedTag = tags.find((tag) => tag.value === 'Weather Sealed')
  const stabilizationTag = tags.find((tag) => tag.value === 'Image Stabilization')
  const sportsTag = tags.find((tag) => tag.value === 'Sports')
  const travelTag = tags.find((tag) => tag.value === 'Travel')
  const contentCreationTag = tags.find((tag) => tag.value === 'Content Creation')

  logger.info(`Found entities:`)
  logger.info(`- Camera type: ${cameraType?.id || 'NOT FOUND'}`)
  logger.info(`- Action category: ${actionCategory?.id || 'NOT FOUND'}`)
  logger.info(`- Travel collection: ${travelCollection?.id || 'NOT FOUND'}`)
  logger.info(`- Sales channel: ${defaultSalesChannel?.id || 'NOT FOUND'}`)
  logger.info(`- Shipping profile: ${shippingProfile?.id || 'NOT FOUND'}`)

  if (!cameraType || !actionCategory || !travelCollection || !defaultSalesChannel || !shippingProfile) {
    logger.error('Required entities not found. Make sure to run the main seed script first.')
    return
  }

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'GoPro Hero 12 Black',
          type_id: cameraType.id,
          category_ids: [actionCategory.id],
          collection_id: travelCollection.id,
          tag_ids: [
            videoTag?.id,
            wifiTag?.id,
            bluetoothTag?.id,
            touchscreenTag?.id,
            weatherSealedTag?.id,
            stabilizationTag?.id,
            sportsTag?.id,
            travelTag?.id,
            contentCreationTag?.id,
          ].filter(Boolean) as string[],
          description:
            'GoPro Hero 12 Black là camera hành động tiên tiến nhất với quay video 5.3K60 và HDR, chống nước đến độ sâu 10m. Với HyperSmooth 6.0, TimeWarp 3.0 và khả năng livestream, hoàn hảo cho thể thao cực hạn và sáng tạo nội dung.',
          handle: 'gopro-hero-12-black',
          weight: 154,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          metadata: {
            sensor: '1/1.9" CMOS',
            video_resolution: '5.3K60, 4K120, 2.7K240',
            photo_resolution: '27MP',
            stabilization: 'HyperSmooth 6.0',
            waterproof: '10m without housing',
            display: '2.27" rear touchscreen, 1.4" front screen',
            connectivity: 'WiFi 6, Bluetooth 5.0',
            voice_control: 'Yes, 14 languages',
            battery_life: '70 minutes 5.3K30 recording',
            dimensions: '71.8 × 50.8 × 33.6mm',
            special_features: 'TimeWarp 3.0, Night Effects, HDR Video, Livestream',
            mounting: 'Standard GoPro mounting system',
          },
          images: [
            {
              url: 'https://picsum.photos/800/600?random=4',
            },
          ],
          options: [
            {
              title: 'Package',
              values: ['Camera only', 'Creator Edition'],
            },
          ],
          variants: [
            {
              title: 'Camera only',
              sku: 'GOPRO-HERO12-CAMERA',
              options: {
                Package: 'Camera only',
              },
              prices: [
                {
                  amount: 1050000000, // 10,500,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Creator Edition',
              sku: 'GOPRO-HERO12-CREATOR',
              options: {
                Package: 'Creator Edition',
              },
              prices: [
                {
                  amount: 1450000000, // 14,500,000 VND
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

  logger.info(`Successfully created GoPro Hero 12 Black product with ID: ${productResult[0].id}`)
}