import { CreateInventoryLevelInput, ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules, ProductStatus } from '@medusajs/framework/utils'
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createProductTypesWorkflow,
  createProductTagsWorkflow,
  createCollectionsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
  createPriceListsWorkflow,
} from '@medusajs/medusa/core-flows'

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)

  const countries = ['vn'] // Vietnam only - no tax calculations needed

  logger.info('Seeding store data...')
  const [store] = await storeModuleService.listStores()
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: 'Kênh Bán Hàng Mặc Định',
  })

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: 'Kênh Bán Hàng Mặc Định',
          },
        ],
      },
    })
    defaultSalesChannel = salesChannelResult
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: 'vnd',
            is_default: true,
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  })

  logger.info('Seeding region data...')
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: 'Việt Nam',
          currency_code: 'vnd',
          countries,
          payment_providers: ['pp_system_default'],
        },
      ],
    },
  })
  logger.info('Finished seeding regions.')

  // Skip tax regions - no tax calculations needed for Vietnam store
  logger.info('Skipping tax regions setup - no tax calculations required.')

  logger.info('Seeding stock location data...')
  const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: 'Cửa hàng Fujifilm Hà Nội',
          address: {
            city: 'Hanoi',
            country_code: 'VN',
            address_1: 'Hanoi, Vietnam',
          },
        },
      ],
    },
  })
  const stockLocation = stockLocationResult[0]

  logger.info('Seeding fulfillment data...')
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: 'default',
  })
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null

  if (!shippingProfile) {
    const { result: shippingProfileResult } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: 'Hồ sơ Vận chuyển Mặc định',
            type: 'default',
          },
        ],
      },
    })
    shippingProfile = shippingProfileResult[0]
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: 'Giao hàng từ cửa hàng Hà Nội',
    type: 'shipping',
    service_zones: [
      {
        name: 'Việt Nam',
        geo_zones: [
          {
            country_code: 'vn',
            type: 'country',
          },
        ],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: 'manual_manual',
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: 'Giao hàng tận nơi',
        price_type: 'flat',
        provider_id: 'manual_manual',
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: 'Giao hàng tận nơi',
          description: 'Chúng tôi đảm bảo giao hàng an toàn và nhanh chóng.',
          code: 'store-delivery',
        },
        prices: [
          {
            currency_code: 'vnd',
            amount: 50000, // 50,000 VND
          },
        ],
        rules: [
          {
            attribute: 'enabled_in_store',
            value: 'true',
            operator: 'eq',
          },
          {
            attribute: 'is_return',
            value: 'false',
            operator: 'eq',
          },
        ],
      },
    ],
  })
  logger.info('Finished seeding fulfillment data.')

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  })
  logger.info('Finished seeding stock location data.')

  logger.info('Seeding publishable API key data...')
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: 'Cửa hàng trực tuyến',
          type: 'publishable',
          created_by: '',
        },
      ],
    },
  })
  const publishableApiKey = publishableApiKeyResult[0]

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  })
  logger.info('Finished seeding publishable API key data.')

  logger.info('Seeding product data...')

  // Create product types
  logger.info('Creating product types...')
  const { result: productTypeResult } = await createProductTypesWorkflow(container).run({
    input: {
      product_types: [
        { value: 'camera', },
        { value: 'lens' },
        { value: 'tripod' },
        { value: 'filter' },
        { value: 'battery' },
        { value: 'charger' },
        { value: 'memory-card' },
        { value: 'bag' },
        { value: 'strap' },
        { value: 'microphone' },
        { value: 'light' },
        { value: 'accessory' },
      ],
    },
  })

  // Create product tags
  logger.info('Creating product tags...')
  const { result: productTagResult } = await createProductTagsWorkflow(container).run({
    input: {
      product_tags: [
        // Brand tags
        { value: 'Canon' },
        { value: 'Nikon' },
        { value: 'Sony' },
        { value: 'Fujifilm' },
        { value: 'Panasonic' },
        { value: 'Olympus' },
        { value: 'Leica' },
        // Feature tags
        { value: 'Full Frame' },
        { value: 'APS-C' },
        { value: 'Micro Four Thirds' },
        { value: 'Weather Sealed' },
        { value: '4K Video' },
        { value: 'Image Stabilization' },
        { value: 'WiFi' },
        { value: 'Bluetooth' },
        { value: 'Touchscreen' },
        // Use case tags
        { value: 'Portrait' },
        { value: 'Landscape' },
        { value: 'Street Photography' },
        { value: 'Wildlife' },
        { value: 'Sports' },
        { value: 'Macro' },
        { value: 'Travel' },
        { value: 'Professional' },
        { value: 'Beginner Friendly' },
        { value: 'Content Creation' },
        { value: 'Studio' },
      ],
    },
  })

  // Create collections
  logger.info('Creating collections...')
  const { result: collectionResult } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        // Brand collections
        {
          title: 'Bộ sưu tập Canon',
          handle: 'canon-collection',
        },
        {
          title: 'Bộ sưu tập Nikon',
          handle: 'nikon-collection',
        },
        {
          title: 'Bộ sưu tập Sony',
          handle: 'sony-collection',
        },
        {
          title: 'Bộ sưu tập Fujifilm',
          handle: 'fujifilm-collection',
        },
        // Feature collections
        {
          title: 'Máy ảnh Full Frame',
          handle: 'full-frame-cameras',
        },
        {
          title: 'Hệ thống máy ảnh Mirrorless',
          handle: 'mirrorless-systems',
        },
        {
          title: 'Ống kính chuyên nghiệp',
          handle: 'professional-lenses',
        },
        {
          title: 'Thiết bị du lịch',
          handle: 'travel-gear',
        },
        // Use case collections
        {
          title: 'Chụp ảnh chân dung',
          handle: 'portrait-photography',
        },
        {
          title: 'Chụp ảnh phong cảnh',
          handle: 'landscape-photography',
        },
        {
          title: 'Chụp ảnh đường phố',
          handle: 'street-photography',
        },
        {
          title: 'Đồ dùng thiết yếu cho người sáng tạo nội dung',
          handle: 'content-creator-essentials',
        },
        // Special collections
        {
          title: 'Sản phẩm mới về',
          handle: 'new-arrivals',
        },
        {
          title: 'Bán chạy nhất',
          handle: 'best-sellers',
        },
        {
          title: 'Dòng máy chuyên nghiệp',
          handle: 'professional-series',
        },
        {
          title: 'Dành cho người mới bắt đầu',
          handle: 'beginner-friendly',
        },
      ],
    },
  })

  // First create main categories
  const { result: mainCategoryResult } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        {
          name: 'Máy ảnh',
          is_active: true,
          description: 'Máy ảnh kỹ thuật số cho mọi nhu cầu chụp ảnh',
          handle: 'may-anh'
        },
        {
          name: 'Ống kính',
          is_active: true,
          description: 'Ống kính máy ảnh cho tất cả các loại ngàm (mount)',
          handle: 'ong-kinh'
        },
        {
          name: 'Phụ kiện',
          is_active: true,
          description: 'Phụ kiện và thiết bị nhiếp ảnh',
          handle: 'phu-kien'
        },
        {
          name: 'Âm thanh & Video',
          is_active: true,
          description: 'Micro và phụ kiện video',
          handle: 'am-thanh-video'
        },
      ],
    },
  })

  // Then create subcategories
  const camerasCategory = mainCategoryResult.find((cat) => cat.name === 'Máy ảnh')
  const lensesCategory = mainCategoryResult.find((cat) => cat.name === 'Ống kính')
  const accessoriesCategory = mainCategoryResult.find((cat) => cat.name === 'Phụ kiện')
  const audioVideoCategory = mainCategoryResult.find((cat) => cat.name === 'Âm thanh & Video')

  const { result: subCategoryResult } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        // Camera subcategories
        {
          name: 'Máy ảnh DSLR',
          is_active: true,
          description: 'Máy ảnh kỹ thuật số với gương lật',
          parent_category_id: camerasCategory?.id || null,
          handle: 'may-anh-dslr'
        },
        {
          name: 'Máy ảnh Mirrorless',
          is_active: true,
          description: 'Hệ thống máy ảnh không gương lật nhỏ gọn',
          parent_category_id: camerasCategory?.id || null,
          handle: 'may-anh-mirrorless'
        },
        {
          name: 'Máy ảnh lấy liền',
          is_active: true,
          description: 'Máy ảnh in ảnh trực tiếp và phim',
          parent_category_id: camerasCategory?.id || null,
          handle: 'may-anh-ly-lien'
        },
        {
          name: 'Máy ảnh hành động',
          is_active: true,
          description: 'Máy ảnh nhỏ gọn cho thể thao và phiêu lưu',
          parent_category_id: camerasCategory?.id || null,
          handle: 'may-anh-hanh-dong'
        },
        {
          name: 'Máy ảnh phim',
          is_active: true,
          description: 'Máy ảnh phim 35mm và medium format',
          parent_category_id: camerasCategory?.id || null,
          handle: 'may-anh-phim'
        },
        // Lens subcategories
        {
          name: 'Ống kính fix (Prime)',
          is_active: true,
          description: 'Ống kính có tiêu cự cố định',
          parent_category_id: lensesCategory?.id || null,
          handle: 'ong-kinh-fix'
        },
        {
          name: 'Ống kính zoom',
          is_active: true,
          description: 'Ống kính có tiêu cự thay đổi',
          parent_category_id: lensesCategory?.id || null,
          handle: 'ong-kinh-zoom'
        },
        {
          name: 'Ống kính macro',
          is_active: true,
          description: 'Ống kính chụp ảnh cận cảnh',
          parent_category_id: lensesCategory?.id || null,
          handle: 'ong-kinh-macro'
        },
        {
          name: 'Ống kính tele',
          is_active: true,
          description: 'Ống kính có tiêu cự dài',
          parent_category_id: lensesCategory?.id || null,
          handle: 'ong-kinh-tele'
        },
        // Accessory subcategories
        {
          name: 'Chân máy & Hỗ trợ',
          is_active: true,
          description: 'Thiết bị ổn định máy ảnh',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'chan-may-va-ho-tro'
        },
        {
          name: 'Túi & Hộp đựng',
          is_active: true,
          description: 'Giải pháp lưu trữ và bảo vệ máy ảnh',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'tui-va-hop-dung'
        },
        {
          name: 'Kính lọc (Filter)',
          is_active: true,
          description: 'Kính lọc ống kính và phụ kiện',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'kinh-loc'
        },
        {
          name: 'Pin & Sạc',
          is_active: true,
          description: 'Phụ kiện nguồn cho máy ảnh',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'pin-va-sac'
        },
        {
          name: 'Thẻ nhớ',
          is_active: true,
          description: 'Giải pháp lưu trữ cho máy ảnh kỹ thuật số',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'the-nho'
        },
        {
          name: 'Đèn & Chiếu sáng',
          is_active: true,
          description: 'Thiết bị chiếu sáng studio và di động',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'den-va-chieu-sang'
        },
        // Audio & Video subcategories
        {
          name: 'Micro thu âm',
          is_active: true,
          description: 'Micro ngoài dành cho máy ảnh',
          parent_category_id: audioVideoCategory?.id || null,
          handle: 'micro-thu-am'
        },
        {
          name: 'Phụ kiện video',
          is_active: true,
          description: 'Phụ kiện quay video',
          parent_category_id: audioVideoCategory?.id || null,
          handle: 'phu-kien-video'
        },
      ],
    },
  })

  const categoryResult = [...mainCategoryResult, ...subCategoryResult]

  const vietnamRegion = regionResult[0]

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Fujifilm X100VI',
          type_id: productTypeResult.find((type) => type.value === 'camera')?.id!,
          category_ids: [categoryResult.find((cat) => cat.name === 'Máy ảnh Mirrorless')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'fujifilm-collection')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Fujifilm')?.id,
            productTagResult.find((tag) => tag.value === 'APS-C')?.id,
            productTagResult.find((tag) => tag.value === '4K Video')?.id,
            productTagResult.find((tag) => tag.value === 'WiFi')?.id,
            productTagResult.find((tag) => tag.value === 'Bluetooth')?.id,
            productTagResult.find((tag) => tag.value === 'Street Photography')?.id,
            productTagResult.find((tag) => tag.value === 'Travel')?.id,
          ].filter(Boolean) as string[],
          description:
            'Fujifilm X100VI sở hữu cảm biến X-Trans CMOS 5 HR 40.2MP và bộ xử lý X-Processor 5, mang đến chất lượng hình ảnh vượt trội trong một thân máy nhỏ gọn, cao cấp. Với ống kính fix 23mm f/2 đặc trưng và kính ngắm lai tiên tiến, chiếc máy này hoàn hảo cho thể loại nhiếp ảnh đường phố và du lịch.',
          handle: 'fujifilm-x100vi',
          weight: 521,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          metadata: {
            sensor: '40.2MP X-Trans CMOS 5 HR',
            processor: 'X-Processor 5',
            lens: 'Fujinon 23mm f/2 (35mm equivalent)',
            iso_range: '160-12800 (expandable to 80-51200)',
            video: '4K/60p, Full HD/240p',
            viewfinder: 'Hybrid viewfinder (OVF/EVF)',
            lcd: '3.0-inch tilting touchscreen LCD',
            connectivity: 'WiFi, Bluetooth',
            battery_life: '450 shots',
            dimensions: '128 x 75 x 53mm',
            weather_sealing: 'No',
          },
          images: [
            {
              url: 'https://i.postimg.cc/G345r02z/x100vi-bac.webp',
            },
          ],
          options: [
            {
              title: 'Color',
              values: ['Bạc', 'Đen'],
            },
          ],
          variants: [
            {
              title: 'Bạc',
              sku: 'FUJI-X100VI-SILVER',
              options: {
                Color: 'Bạc',
              },
              prices: [
                {
                  amount: 3800000000, // 38,000,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Đen',
              sku: 'FUJI-X100VI-BLACK',
              options: {
                Color: 'Đen',
              },
              prices: [
                {
                  amount: 3800000000, // 38,000,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
      ],
    },
  })
  logger.info('Finished seeding product data.')

  logger.info('Seeding inventory levels.')

  const { data: inventoryItems } = await query.graph({
    entity: 'inventory_item',
    fields: ['id'],
  })

  const inventoryLevels: CreateInventoryLevelInput[] = []
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 100,
      inventory_item_id: inventoryItem.id,
    }
    inventoryLevels.push(inventoryLevel)
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  })

  logger.info('Finished seeding inventory levels data.')
}
