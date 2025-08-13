import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function addDSLRProduct({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Adding DSLR camera product...')

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
  const dslrCategory = categories.find((cat) => cat.handle === 'may-anh-dslr')
  const canonCollection = collections.find((col) => col.handle === 'canon-collection')
  const defaultSalesChannel = salesChannels.find((sc) => sc.name === 'Kênh Bán Hàng Mặc Định')
  logger.info(`Available shipping profiles: ${JSON.stringify(shippingProfiles, null, 2)}`)
  const shippingProfile = shippingProfiles.find((sp) => sp.name === 'Hồ sơ Vận chuyển Mặc định') || shippingProfiles[0]

  // Find relevant tags
  const canonTag = tags.find((tag) => tag.value === 'Canon')
  const fullFrameTag = tags.find((tag) => tag.value === 'Full Frame')
  const videoTag = tags.find((tag) => tag.value === '4K Video')
  const wifiTag = tags.find((tag) => tag.value === 'WiFi')
  const bluetoothTag = tags.find((tag) => tag.value === 'Bluetooth')
  const touchscreenTag = tags.find((tag) => tag.value === 'Touchscreen')
  const weatherSealedTag = tags.find((tag) => tag.value === 'Weather Sealed')
  const stabilizationTag = tags.find((tag) => tag.value === 'Image Stabilization')
  const portraitTag = tags.find((tag) => tag.value === 'Portrait')
  const professionalTag = tags.find((tag) => tag.value === 'Professional')

  logger.info(`Found entities:`)
  logger.info(`- Camera type: ${cameraType?.id || 'NOT FOUND'}`)
  logger.info(`- DSLR category: ${dslrCategory?.id || 'NOT FOUND'}`)
  logger.info(`- Canon collection: ${canonCollection?.id || 'NOT FOUND'}`)
  logger.info(`- Sales channel: ${defaultSalesChannel?.id || 'NOT FOUND'}`)
  logger.info(`- Shipping profile: ${shippingProfile?.id || 'NOT FOUND'}`)

  if (!cameraType || !dslrCategory || !canonCollection || !defaultSalesChannel || !shippingProfile) {
    logger.error('Required entities not found. Make sure to run the main seed script first.')
    return
  }

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Canon EOS R5',
          type_id: cameraType.id,
          category_ids: [dslrCategory.id],
          collection_id: canonCollection.id,
          tag_ids: [
            canonTag?.id,
            fullFrameTag?.id,
            videoTag?.id,
            wifiTag?.id,
            bluetoothTag?.id,
            touchscreenTag?.id,
            weatherSealedTag?.id,
            stabilizationTag?.id,
            portraitTag?.id,
            professionalTag?.id,
          ].filter(Boolean) as string[],
          description:
            'Canon EOS R5 là máy ảnh mirrorless full-frame cao cấp với cảm biến 45MP, quay video 8K và hệ thống lấy nét Dual Pixel CMOS AF II tiên tiến. Máy sở hữu chống rung trong thân máy 5 trục, màn hình cảm ứng xoay lật và khả năng chống thời tiết toàn diện, hoàn hảo cho nhiếp ảnh chuyên nghiệp.',
          handle: 'canon-eos-r5',
          weight: 738,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          metadata: {
            sensor: '45MP Full-Frame CMOS',
            processor: 'DIGIC X',
            mount: 'Canon RF',
            iso_range: '100-51200 (expandable to 50-102400)',
            video: '8K/30p, 4K/120p',
            autofocus: '1053-point Dual Pixel CMOS AF II',
            viewfinder: '5.76m-dot OLED EVF',
            lcd: '3.2-inch vari-angle touchscreen',
            connectivity: 'WiFi, Bluetooth, USB-C',
            battery_life: '320 shots',
            dimensions: '138.5 x 97.5 x 88mm',
            weather_sealing: 'Yes',
            stabilization: '5-axis In-Body Image Stabilization',
            burst_rate: '12 fps mechanical, 20 fps electronic',
          },
          images: [
            {
              url: 'https://picsum.photos/800/600?random=7',
            },
          ],
          options: [
            {
              title: 'Kit',
              values: ['Body only', 'Kit với lens 24-105mm f/4L'],
            },
          ],
          variants: [
            {
              title: 'Body only',
              sku: 'CANON-R5-BODY',
              options: {
                Kit: 'Body only',
              },
              prices: [
                {
                  amount: 9500000000, // 95,000,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Kit với lens 24-105mm f/4L',
              sku: 'CANON-R5-KIT-24-105',
              options: {
                Kit: 'Kit với lens 24-105mm f/4L',
              },
              prices: [
                {
                  amount: 12800000000, // 128,000,000 VND
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

  logger.info(`Successfully created Canon EOS R5 product with ID: ${productResult[0].id}`)
}