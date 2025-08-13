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

  // Note: Cannot update token after creation - tokens are auto-generated by Medusa

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  })
  logger.info('Finished seeding publishable API key data.')
  logger.info(`Publishable API Key: ${publishableApiKey.token}`)

  // Update frontend environment file with the actual generated key
  try {
    const fs = require('fs')
    const path = require('path')
    const frontendEnvPath = path.join(process.cwd(), '..', 'frontend', '.env.local')
    
    if (fs.existsSync(frontendEnvPath)) {
      let envContent = fs.readFileSync(frontendEnvPath, 'utf8')
      
      // Replace the publishable key in the env file
      const keyRegex = /NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*/
      if (keyRegex.test(envContent)) {
        envContent = envContent.replace(keyRegex, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`)
      } else {
        // Add the key if it doesn't exist
        envContent += `\nNEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}\n`
      }
      
      fs.writeFileSync(frontendEnvPath, envContent, 'utf8')
      logger.info('✅ Updated frontend .env.local with new publishable key')
    } else {
      logger.warn('⚠️  Frontend .env.local file not found, skipping auto-update')
    }
  } catch (error) {
    logger.warn(`⚠️  Failed to update frontend environment file: ${(error as Error).message}`)
  }

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

  // Hero banner URLs for featured categories
  const heroBanners = [
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ]

  // Product image mapping - using curated camera-specific images
  const productImages = {
    'fujifilm-x100vi': {
      thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ]
    },
    'canon-eos-r5': {
      thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515431094867-eb3ae9b2b70b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ]
    },
    'sony-a7-iv': {
      thumbnail: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ]
    },
    'canon-rf-50mm-f1-2l-usm': {
      thumbnail: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517742443272-5e5d3a9d66cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ]
    },
    'gopro-hero-12-black': {
      thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ]
    },
    'leica-m11': {
      thumbnail: 'https://images.unsplash.com/photo-1521651201144-634f700b36ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1521651201144-634f700b36ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ]
    },
    'fujifilm-instax-mini-12': {
      thumbnail: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ]
    },
    'sony-fe-24-70mm-f2-8-gm-ii': {
      thumbnail: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ]
    }
  }

  // First create main categories with featured metadata
  const { result: mainCategoryResult } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        {
          name: 'Máy ảnh',
          is_active: true,
          description: 'Máy ảnh kỹ thuật số cho mọi nhu cầu chụp ảnh',
          handle: 'may-anh',
          metadata: {
            hero_image_url: heroBanners[0],
            is_featured: true,
            display_order: 0
          }
        },
        {
          name: 'Ống kính',
          is_active: true,
          description: 'Ống kính máy ảnh cho tất cả các loại ngàm (mount)',
          handle: 'ong-kinh',
          metadata: {
            hero_image_url: heroBanners[1],
            is_featured: true,
            display_order: 1
          }
        },
        {
          name: 'Phụ kiện',
          is_active: true,
          description: 'Phụ kiện và thiết bị nhiếp ảnh',
          handle: 'phu-kien',
          metadata: {
            hero_image_url: heroBanners[2],
            is_featured: true,
            display_order: 2
          }
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
          thumbnail: productImages['fujifilm-x100vi'].thumbnail,
          images: productImages['fujifilm-x100vi'].images.map(url => ({ url })),
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
        {
          title: 'Canon EOS R5',
          type_id: productTypeResult.find((type) => type.value === 'camera')?.id!,
          category_ids: [categoryResult.find((cat) => cat.name === 'Máy ảnh Mirrorless')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'canon-collection')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Canon')?.id,
            productTagResult.find((tag) => tag.value === 'Full Frame')?.id,
            productTagResult.find((tag) => tag.value === '4K Video')?.id,
            productTagResult.find((tag) => tag.value === 'WiFi')?.id,
            productTagResult.find((tag) => tag.value === 'Bluetooth')?.id,
            productTagResult.find((tag) => tag.value === 'Touchscreen')?.id,
            productTagResult.find((tag) => tag.value === 'Weather Sealed')?.id,
            productTagResult.find((tag) => tag.value === 'Image Stabilization')?.id,
            productTagResult.find((tag) => tag.value === 'Portrait')?.id,
            productTagResult.find((tag) => tag.value === 'Professional')?.id,
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
          thumbnail: productImages['canon-eos-r5'].thumbnail,
          images: productImages['canon-eos-r5'].images.map(url => ({ url })),
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
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: 'Sony A7 IV',
          type_id: productTypeResult.find((type) => type.value === 'camera')?.id!,
          category_ids: [categoryResult.find((cat) => cat.name === 'Máy ảnh Mirrorless')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'sony-collection')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Sony')?.id,
            productTagResult.find((tag) => tag.value === 'Full Frame')?.id,
            productTagResult.find((tag) => tag.value === '4K Video')?.id,
            productTagResult.find((tag) => tag.value === 'WiFi')?.id,
            productTagResult.find((tag) => tag.value === 'Bluetooth')?.id,
            productTagResult.find((tag) => tag.value === 'Touchscreen')?.id,
            productTagResult.find((tag) => tag.value === 'Weather Sealed')?.id,
            productTagResult.find((tag) => tag.value === 'Image Stabilization')?.id,
            productTagResult.find((tag) => tag.value === 'Portrait')?.id,
            productTagResult.find((tag) => tag.value === 'Landscape')?.id,
            productTagResult.find((tag) => tag.value === 'Professional')?.id,
            productTagResult.find((tag) => tag.value === 'Content Creation')?.id,
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
          thumbnail: productImages['sony-a7-iv'].thumbnail,
          images: productImages['sony-a7-iv'].images.map(url => ({ url })),
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
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: 'Canon RF 50mm f/1.2L USM',
          type_id: productTypeResult.find((type) => type.value === 'lens')?.id!,
          category_ids: [categoryResult.find((cat) => cat.name === 'Ống kính fix (Prime)')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'canon-collection')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Canon')?.id,
            productTagResult.find((tag) => tag.value === 'Full Frame')?.id,
            productTagResult.find((tag) => tag.value === 'Professional')?.id,
            productTagResult.find((tag) => tag.value === 'Portrait')?.id,
            productTagResult.find((tag) => tag.value === 'Weather Sealed')?.id,
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
          thumbnail: productImages['canon-rf-50mm-f1-2l-usm'].thumbnail,
          images: productImages['canon-rf-50mm-f1-2l-usm'].images.map(url => ({ url })),
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
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: 'GoPro Hero 12 Black',
          type_id: productTypeResult.find((type) => type.value === 'camera')?.id!,
          category_ids: [categoryResult.find((cat) => cat.name === 'Máy ảnh hành động')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'travel-gear')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === '4K Video')?.id,
            productTagResult.find((tag) => tag.value === 'WiFi')?.id,
            productTagResult.find((tag) => tag.value === 'Bluetooth')?.id,
            productTagResult.find((tag) => tag.value === 'Touchscreen')?.id,
            productTagResult.find((tag) => tag.value === 'Weather Sealed')?.id,
            productTagResult.find((tag) => tag.value === 'Image Stabilization')?.id,
            productTagResult.find((tag) => tag.value === 'Sports')?.id,
            productTagResult.find((tag) => tag.value === 'Travel')?.id,
            productTagResult.find((tag) => tag.value === 'Content Creation')?.id,
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
          thumbnail: productImages['gopro-hero-12-black'].thumbnail,
          images: productImages['gopro-hero-12-black'].images.map(url => ({ url })),
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
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: 'Leica M11',
          type_id: productTypeResult.find((type) => type.value === 'camera')?.id!,
          category_ids: [categoryResult.find((cat) => cat.name === 'Máy ảnh phim')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'professional-series')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Leica')?.id,
            productTagResult.find((tag) => tag.value === 'Full Frame')?.id,
            productTagResult.find((tag) => tag.value === 'Professional')?.id,
            productTagResult.find((tag) => tag.value === 'Street Photography')?.id,
            productTagResult.find((tag) => tag.value === 'Portrait')?.id,
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
          thumbnail: productImages['leica-m11'].thumbnail,
          images: productImages['leica-m11'].images.map(url => ({ url })),
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
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: 'Fujifilm Instax Mini 12',
          type_id: productTypeResult.find((type) => type.value === 'camera')?.id!,
          category_ids: [categoryResult.find((cat) => cat.name === 'Máy ảnh lấy liền')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'fujifilm-collection')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Fujifilm')?.id,
            productTagResult.find((tag) => tag.value === 'Travel')?.id,
            productTagResult.find((tag) => tag.value === 'Beginner Friendly')?.id,
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
          thumbnail: productImages['fujifilm-instax-mini-12'].thumbnail,
          images: productImages['fujifilm-instax-mini-12'].images.map(url => ({ url })),
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
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: 'Sony FE 24-70mm f/2.8 GM II',
          type_id: productTypeResult.find((type) => type.value === 'lens')?.id!,
          category_ids: [categoryResult.find((cat) => cat.name === 'Ống kính zoom')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'sony-collection')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Sony')?.id,
            productTagResult.find((tag) => tag.value === 'Full Frame')?.id,
            productTagResult.find((tag) => tag.value === 'Professional')?.id,
            productTagResult.find((tag) => tag.value === 'Portrait')?.id,
            productTagResult.find((tag) => tag.value === 'Landscape')?.id,
            productTagResult.find((tag) => tag.value === 'Weather Sealed')?.id,
            productTagResult.find((tag) => tag.value === 'Content Creation')?.id,
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
          thumbnail: productImages['sony-fe-24-70mm-f2-8-gm-ii'].thumbnail,
          images: productImages['sony-fe-24-70mm-f2-8-gm-ii'].images.map(url => ({ url })),
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
