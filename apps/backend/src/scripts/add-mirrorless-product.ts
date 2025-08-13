import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function addMirrorlessProduct({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Adding Sony A7 IV mirrorless camera product...')

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
  const mirrorlessCategory = categories.find((cat) => cat.handle === 'may-anh-mirrorless')
  const sonyCollection = collections.find((col) => col.handle === 'sony-collection')
  const defaultSalesChannel = salesChannels.find((sc) => sc.name === 'Kênh Bán Hàng Mặc Định')
  const shippingProfile = shippingProfiles[0] // Use first available shipping profile

  // Find relevant tags
  const sonyTag = tags.find((tag) => tag.value === 'Sony')
  const fullFrameTag = tags.find((tag) => tag.value === 'Full Frame')
  const videoTag = tags.find((tag) => tag.value === '4K Video')
  const wifiTag = tags.find((tag) => tag.value === 'WiFi')
  const bluetoothTag = tags.find((tag) => tag.value === 'Bluetooth')
  const touchscreenTag = tags.find((tag) => tag.value === 'Touchscreen')
  const weatherSealedTag = tags.find((tag) => tag.value === 'Weather Sealed')
  const stabilizationTag = tags.find((tag) => tag.value === 'Image Stabilization')
  const portraitTag = tags.find((tag) => tag.value === 'Portrait')
  const landscapeTag = tags.find((tag) => tag.value === 'Landscape')
  const professionalTag = tags.find((tag) => tag.value === 'Professional')
  const contentCreationTag = tags.find((tag) => tag.value === 'Content Creation')

  logger.info(`Found entities:`)
  logger.info(`- Camera type: ${cameraType?.id || 'NOT FOUND'}`)
  logger.info(`- Mirrorless category: ${mirrorlessCategory?.id || 'NOT FOUND'}`)
  logger.info(`- Sony collection: ${sonyCollection?.id || 'NOT FOUND'}`)
  logger.info(`- Sales channel: ${defaultSalesChannel?.id || 'NOT FOUND'}`)
  logger.info(`- Shipping profile: ${shippingProfile?.id || 'NOT FOUND'}`)

  if (!cameraType || !mirrorlessCategory || !sonyCollection || !defaultSalesChannel || !shippingProfile) {
    logger.error('Required entities not found. Make sure to run the main seed script first.')
    return
  }

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Sony A7 IV',
          type_id: cameraType.id,
          category_ids: [mirrorlessCategory.id],
          collection_id: sonyCollection.id,
          tag_ids: [
            sonyTag?.id,
            fullFrameTag?.id,
            videoTag?.id,
            wifiTag?.id,
            bluetoothTag?.id,
            touchscreenTag?.id,
            weatherSealedTag?.id,
            stabilizationTag?.id,
            portraitTag?.id,
            landscapeTag?.id,
            professionalTag?.id,
            contentCreationTag?.id,
          ].filter(Boolean) as string[],
          description:
            'Sony A7 IV là máy ảnh mirrorless full-frame mới nhất với cảm biến 33MP, quay video 4K 60fps và hệ thống lấy nét lai 759 điểm. Với chống rung trong thân máy 5.5 stops, màn hình cảm ứng xoay lật và khả năng chống bụi bẩn, hoàn hảo cho cả nhiếp ảnh và quay phim chuyên nghiệp.',
          handle: 'sony-a7-iv',
          weight: 658,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          metadata: {
            sensor: '33MP Full-Frame Exmor R CMOS',
            processor: 'BIONZ XR',
            mount: 'Sony E',
            iso_range: '100-51200 (expandable to 50-204800)',
            video: '4K/60p, Full HD/120p',
            autofocus: '759-point hybrid AF system',
            viewfinder: '3.68m-dot OLED EVF',
            lcd: '3.0-inch vari-angle touchscreen',
            connectivity: 'WiFi, Bluetooth, USB-C',
            battery_life: '520 shots',
            dimensions: '131.3 x 96.4 x 79.8mm',
            weather_sealing: 'Yes',
            stabilization: '5.5-stop In-Body Image Stabilization',
            burst_rate: '10 fps',
            dual_card_slots: 'CFexpress Type A + SD',
          },
          images: [
            {
              url: 'https://picsum.photos/800/600?random=5',
            },
          ],
          options: [
            {
              title: 'Kit',
              values: ['Body only', 'Kit với lens FE 28-70mm f/3.5-5.6 OSS'],
            },
          ],
          variants: [
            {
              title: 'Body only',
              sku: 'SONY-A7IV-BODY',
              options: {
                Kit: 'Body only',
              },
              prices: [
                {
                  amount: 6200000000, // 62,000,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Kit với lens FE 28-70mm f/3.5-5.6 OSS',
              sku: 'SONY-A7IV-KIT-28-70',
              options: {
                Kit: 'Kit với lens FE 28-70mm f/3.5-5.6 OSS',
              },
              prices: [
                {
                  amount: 7500000000, // 75,000,000 VND
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

  logger.info(`Successfully created Sony A7 IV product with ID: ${productResult[0].id}`)
}