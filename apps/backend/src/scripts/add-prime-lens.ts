import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function addPrimeLens({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Adding Canon RF 50mm f/1.2L USM prime lens product...')

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
  const primeCategory = categories.find((cat) => cat.handle === 'ong-kinh-fix')
  const canonCollection = collections.find((col) => col.handle === 'canon-collection')
  const professionalCollection = collections.find((col) => col.handle === 'professional-lenses')
  const defaultSalesChannel = salesChannels.find((sc) => sc.name === 'Kênh Bán Hàng Mặc Định')
  const shippingProfile = shippingProfiles[0]

  // Find relevant tags
  const canonTag = tags.find((tag) => tag.value === 'Canon')
  const fullFrameTag = tags.find((tag) => tag.value === 'Full Frame')
  const professionalTag = tags.find((tag) => tag.value === 'Professional')
  const portraitTag = tags.find((tag) => tag.value === 'Portrait')
  const weatherSealedTag = tags.find((tag) => tag.value === 'Weather Sealed')

  logger.info(`Found entities:`)
  logger.info(`- Lens type: ${lensType?.id || 'NOT FOUND'}`)
  logger.info(`- Prime category: ${primeCategory?.id || 'NOT FOUND'}`)
  logger.info(`- Canon collection: ${canonCollection?.id || 'NOT FOUND'}`)
  logger.info(`- Professional collection: ${professionalCollection?.id || 'NOT FOUND'}`)
  logger.info(`- Sales channel: ${defaultSalesChannel?.id || 'NOT FOUND'}`)
  logger.info(`- Shipping profile: ${shippingProfile?.id || 'NOT FOUND'}`)

  if (!lensType || !primeCategory || !canonCollection || !defaultSalesChannel || !shippingProfile) {
    logger.error('Required entities not found. Make sure to run the main seed script first.')
    return
  }

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Canon RF 50mm f/1.2L USM',
          type_id: lensType.id,
          category_ids: [primeCategory.id],
          collection_id: professionalCollection?.id || canonCollection.id,
          tag_ids: [
            canonTag?.id,
            fullFrameTag?.id,
            professionalTag?.id,
            portraitTag?.id,
            weatherSealedTag?.id,
          ].filter(Boolean) as string[],
          description:
            'Canon RF 50mm f/1.2L USM là ống kính chân dung chuyên nghiệp với khẩu độ f/1.2 cực rộng, tạo ra hiệu ứng bokeh tuyệt đẹp. Với công nghệ Dual Pixel CMOS AF và chống rung quang học, ống kính mang đến chất lượng hình ảnh xuất sắc cho hệ thống Canon EOS R.',
          handle: 'canon-rf-50mm-f1-2l-usm',
          weight: 950,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          metadata: {
            focal_length: '50mm',
            max_aperture: 'f/1.2',
            min_aperture: 'f/16',
            mount: 'Canon RF',
            elements_groups: '15 elements in 9 groups',
            aperture_blades: '10 blades',
            min_focus_distance: '0.4m',
            max_magnification: '0.19x',
            filter_size: '77mm',
            dimensions: '89.8 × 108mm',
            weather_sealing: 'Yes',
            image_stabilization: 'No (relies on in-body IS)',
            autofocus: 'Dual Pixel CMOS AF compatible',
            special_features: 'L-series build quality, Defocus Smoothing coating',
          },
          images: [
            {
              url: 'https://picsum.photos/800/600?random=2',
            },
          ],
          options: [
            {
              title: 'Condition',
              values: ['New', 'Open Box'],
            },
          ],
          variants: [
            {
              title: 'New',
              sku: 'CANON-RF-50-F12L-NEW',
              options: {
                Condition: 'New',
              },
              prices: [
                {
                  amount: 5800000000, // 58,000,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Open Box',
              sku: 'CANON-RF-50-F12L-OPENBOX',
              options: {
                Condition: 'Open Box',
              },
              prices: [
                {
                  amount: 5200000000, // 52,000,000 VND
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

  logger.info(`Successfully created Canon RF 50mm f/1.2L USM product with ID: ${productResult[0].id}`)
}