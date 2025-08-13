import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function addZoomLens({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Adding Sony FE 24-70mm f/2.8 GM II zoom lens product...')

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
  const lensType = types.find((type) => type.value === 'lens')
  const zoomCategory = categories.find((cat) => cat.handle === 'ong-kinh-zoom')
  const sonyCollection = collections.find((col) => col.handle === 'sony-collection')
  const professionalCollection = collections.find((col) => col.handle === 'professional-lenses')
  const defaultSalesChannel = salesChannels.find((sc) => sc.name === 'Kênh Bán Hàng Mặc Định')
  const shippingProfile = shippingProfiles[0]

  // Find relevant tags
  const sonyTag = tags.find((tag) => tag.value === 'Sony')
  const fullFrameTag = tags.find((tag) => tag.value === 'Full Frame')
  const professionalTag = tags.find((tag) => tag.value === 'Professional')
  const portraitTag = tags.find((tag) => tag.value === 'Portrait')
  const landscapeTag = tags.find((tag) => tag.value === 'Landscape')
  const weatherSealedTag = tags.find((tag) => tag.value === 'Weather Sealed')
  const contentCreationTag = tags.find((tag) => tag.value === 'Content Creation')

  logger.info(`Found entities:`)
  logger.info(`- Lens type: ${lensType?.id || 'NOT FOUND'}`)
  logger.info(`- Zoom category: ${zoomCategory?.id || 'NOT FOUND'}`)
  logger.info(`- Sony collection: ${sonyCollection?.id || 'NOT FOUND'}`)
  logger.info(`- Professional collection: ${professionalCollection?.id || 'NOT FOUND'}`)
  logger.info(`- Sales channel: ${defaultSalesChannel?.id || 'NOT FOUND'}`)
  logger.info(`- Shipping profile: ${shippingProfile?.id || 'NOT FOUND'}`)

  if (!lensType || !zoomCategory || !sonyCollection || !defaultSalesChannel || !shippingProfile) {
    logger.error('Required entities not found. Make sure to run the main seed script first.')
    return
  }

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Sony FE 24-70mm f/2.8 GM II',
          type_id: lensType.id,
          category_ids: [zoomCategory.id],
          collection_id: professionalCollection?.id || sonyCollection.id,
          tag_ids: [
            sonyTag?.id,
            fullFrameTag?.id,
            professionalTag?.id,
            portraitTag?.id,
            landscapeTag?.id,
            weatherSealedTag?.id,
            contentCreationTag?.id,
          ].filter(Boolean) as string[],
          description:
            'Sony FE 24-70mm f/2.8 GM II là ống kính zoom tiêu chuẩn G Master thế hệ mới, nhẹ hơn 20% so với phiên bản trước với độ phân giải cực cao. Với 4 motor XD Linear và chống rung quang học, ống kính hoàn hảo cho cả nhiếp ảnh và quay phim chuyên nghiệp.',
          handle: 'sony-fe-24-70mm-f2-8-gm-ii',
          weight: 695,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          metadata: {
            focal_length: '24-70mm',
            max_aperture: 'f/2.8',
            min_aperture: 'f/22',
            mount: 'Sony E (Full Frame)',
            elements_groups: '17 elements in 14 groups',
            aperture_blades: '11 blades',
            min_focus_distance: '0.21m (wide) / 0.38m (tele)',
            max_magnification: '0.32x',
            filter_size: '82mm',
            dimensions: '88 × 119.5mm',
            weather_sealing: 'Yes',
            image_stabilization: 'Optical SteadyShot',
            autofocus: '4× XD Linear Motors',
            special_features: 'G Master optics, Nano AR Coating II, Fluorine coating',
            focus_breathing: 'Minimized for video',
          },
          images: [
            {
              url: 'https://picsum.photos/800/600?random=6',
            },
          ],
          options: [
            {
              title: 'Condition',
              values: ['New', 'Demo Unit'],
            },
          ],
          variants: [
            {
              title: 'New',
              sku: 'SONY-FE-24-70-GM2-NEW',
              options: {
                Condition: 'New',
              },
              prices: [
                {
                  amount: 6800000000, // 68,000,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Demo Unit',
              sku: 'SONY-FE-24-70-GM2-DEMO',
              options: {
                Condition: 'Demo Unit',
              },
              prices: [
                {
                  amount: 6200000000, // 62,000,000 VND
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

  logger.info(`Successfully created Sony FE 24-70mm f/2.8 GM II product with ID: ${productResult[0].id}`)
}