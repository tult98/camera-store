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
    name: 'Default Sales Channel',
  })

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: 'Default Sales Channel',
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
  await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: 'Vietnam',
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
          name: 'Fujifilm Hanoi Store',
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
            name: 'Default Shipping Profile',
            type: 'default',
          },
        ],
      },
    })
    shippingProfile = shippingProfileResult[0]
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: 'Shipping from Hanoi Store',
    type: 'shipping',
    service_zones: [
      {
        name: 'Vietnam',
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
        name: 'Store Delivery',
        price_type: 'flat',
        provider_id: 'manual_manual',
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: 'Store Delivery',
          description: 'We ensure safe and fast delivery.',
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
          title: 'Online Store',
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
        envContent += `
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}
`
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
          title: 'Canon Collection',
          handle: 'canon-collection',
        },
        {
          title: 'Nikon Collection',
          handle: 'nikon-collection',
        },
        {
          title: 'Sony Collection',
          handle: 'sony-collection',
        },
        {
          title: 'Fujifilm Collection',
          handle: 'fujifilm-collection',
        },
        // Feature collections
        {
          title: 'Full Frame Cameras',
          handle: 'full-frame-cameras',
        },
        {
          title: 'Mirrorless Systems',
          handle: 'mirrorless-systems',
        },
        {
          title: 'Professional Lenses',
          handle: 'professional-lenses',
        },
        {
          title: 'Travel Gear',
          handle: 'travel-gear',
        },
        // Use case collections
        {
          title: 'Portrait Photography',
          handle: 'portrait-photography',
        },
        {
          title: 'Landscape Photography',
          handle: 'landscape-photography',
        },
        {
          title: 'Street Photography',
          handle: 'street-photography',
        },
        {
          title: 'Content Creator Essentials',
          handle: 'content-creator-essentials',
        },
        // Special collections
        {
          title: 'New Arrivals',
          handle: 'new-arrivals',
        },
        {
          title: 'Best Sellers',
          handle: 'best-sellers',
        },
        {
          title: 'Professional Series',
          handle: 'professional-series',
        },
        {
          title: 'Beginner Friendly',
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
          name: 'Cameras',
          is_active: true,
          description: 'Digital cameras for all your photography needs',
          handle: 'cameras',
          metadata: {
            hero_image_url: heroBanners[0],
            is_featured: true,
            display_order: 0
          }
        },
        {
          name: 'Lenses',
          is_active: true,
          description: 'Camera lenses for all mount types',
          handle: 'lenses',
          metadata: {
            hero_image_url: heroBanners[1],
            is_featured: true,
            display_order: 1
          }
        },
        {
          name: 'Accessories',
          is_active: true,
          description: 'Photography accessories and gear',
          handle: 'accessories',
          metadata: {
            hero_image_url: heroBanners[2],
            is_featured: true,
            display_order: 2
          }
        },
        {
          name: 'Audio & Video',
          is_active: true,
          description: 'Microphones and video accessories',
          handle: 'audio-video'
        },
      ],
    },
  })

  // Then create subcategories
  const camerasCategory = mainCategoryResult.find((cat) => cat.name === 'Cameras')
  const lensesCategory = mainCategoryResult.find((cat) => cat.name === 'Lenses')
  const accessoriesCategory = mainCategoryResult.find((cat) => cat.name === 'Accessories')
  const audioVideoCategory = mainCategoryResult.find((cat) => cat.name === 'Audio & Video')

  const { result: subCategoryResult } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        // Camera subcategories
        {
          name: 'DSLR Cameras',
          is_active: true,
          description: 'Digital single-lens reflex cameras',
          parent_category_id: camerasCategory?.id || null,
          handle: 'dslr-cameras'
        },
        {
          name: 'Mirrorless Cameras',
          is_active: true,
          description: 'Compact mirrorless camera systems',
          parent_category_id: camerasCategory?.id || null,
          handle: 'mirrorless-cameras'
        },
        {
          name: 'Instant Cameras',
          is_active: true,
          description: 'Instant print and film cameras',
          parent_category_id: camerasCategory?.id || null,
          handle: 'instant-cameras'
        },
        {
          name: 'Action Cameras',
          is_active: true,
          description: 'Compact cameras for sports and adventure',
          parent_category_id: camerasCategory?.id || null,
          handle: 'action-cameras'
        },
        {
          name: 'Film Cameras',
          is_active: true,
          description: '35mm and medium format film cameras',
          parent_category_id: camerasCategory?.id || null,
          handle: 'film-cameras'
        },
        // Lens subcategories
        {
          name: 'Prime Lenses',
          is_active: true,
          description: 'Lenses with a fixed focal length',
          parent_category_id: lensesCategory?.id || null,
          handle: 'prime-lenses'
        },
        {
          name: 'Zoom Lenses',
          is_active: true,
          description: 'Lenses with a variable focal length',
          parent_category_id: lensesCategory?.id || null,
          handle: 'zoom-lenses'
        },
        {
          name: 'Macro Lenses',
          is_active: true,
          description: 'Lenses for close-up photography',
          parent_category_id: lensesCategory?.id || null,
          handle: 'macro-lenses'
        },
        {
          name: 'Telephoto Lenses',
          is_active: true,
          description: 'Lenses with a long focal length',
          parent_category_id: lensesCategory?.id || null,
          handle: 'telephoto-lenses'
        },
        // Accessory subcategories
        {
          name: 'Tripods & Supports',
          is_active: true,
          description: 'Camera stabilization equipment',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'tripods-supports'
        },
        {
          name: 'Bags & Cases',
          is_active: true,
          description: 'Camera storage and protection solutions',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'bags-cases'
        },
        {
          name: 'Filters',
          is_active: true,
          description: 'Lens filters and accessories',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'filters'
        },
        {
          name: 'Batteries & Chargers',
          is_active: true,
          description: 'Power accessories for cameras',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'batteries-chargers'
        },
        {
          name: 'Memory Cards',
          is_active: true,
          description: 'Storage solutions for digital cameras',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'memory-cards'
        },
        {
          name: 'Lighting & Flashes',
          is_active: true,
          description: 'Studio and portable lighting equipment',
          parent_category_id: accessoriesCategory?.id || null,
          handle: 'lighting-flashes'
        },
        // Audio & Video subcategories
        {
          name: 'Microphones',
          is_active: true,
          description: 'External microphones for cameras',
          parent_category_id: audioVideoCategory?.id || null,
          handle: 'microphones'
        },
        {
          name: 'Video Accessories',
          is_active: true,
          description: 'Accessories for video recording',
          parent_category_id: audioVideoCategory?.id || null,
          handle: 'video-accessories'
        },
      ],
    },
  })

  const categoryResult = [...mainCategoryResult, ...subCategoryResult]

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Fujifilm X100VI',
          type_id: productTypeResult.find((type) => type.value === 'camera')?.id!,
          category_ids: [categoryResult.find((cat) => cat.name === 'Mirrorless Cameras')!.id],
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
            'The Fujifilm X100VI features a 40.2MP X-Trans CMOS 5 HR sensor and the X-Processor 5, delivering outstanding image quality in a compact, premium body. With its signature 23mm f/2 fixed lens and advanced hybrid viewfinder, this camera is perfect for street and travel photography.',
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
              values: ['Silver', 'Black'],
            },
          ],
          variants: [
            {
              title: 'Silver',
              sku: 'FUJI-X100VI-SILVER',
              options: {
                Color: 'Silver',
              },
              prices: [
                {
                  amount: 3800000000, // 38,000,000 VND
                  currency_code: 'vnd',
                },
              ],
            },
            {
              title: 'Black',
              sku: 'FUJI-X100VI-BLACK',
              options: {
                Color: 'Black',
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
          category_ids: [categoryResult.find((cat) => cat.name === 'Mirrorless Cameras')!.id],
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
            'The Canon EOS R5 is a high-end full-frame mirrorless camera with a 45MP sensor, 8K video recording, and an advanced Dual Pixel CMOS AF II system. It features 5-axis in-body image stabilization, a vari-angle touchscreen, and comprehensive weather sealing, making it perfect for professional photography.',
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
              values: ['Body only', 'Kit with 24-105mm f/4L lens'],
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
              title: 'Kit with 24-105mm f/4L lens',
              sku: 'CANON-R5-KIT-24-105',
              options: {
                Kit: 'Kit with 24-105mm f/4L lens',
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
          category_ids: [categoryResult.find((cat) => cat.name === 'Mirrorless Cameras')!.id],
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
            'The Sony A7 IV is the latest full-frame mirrorless camera with a 33MP sensor, 4K 60fps video recording, and a 759-point hybrid AF system. With 5.5-stops of in-body image stabilization, a vari-angle touchscreen, and dust and moisture resistance, it is perfect for both professional photography and videography.',
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
              values: ['Body only', 'Kit with FE 28-70mm f/3.5-5.6 OSS lens'],
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
              title: 'Kit with FE 28-70mm f/3.5-5.6 OSS lens',
              sku: 'SONY-A7IV-KIT-28-70',
              options: {
                Kit: 'Kit with FE 28-70mm f/3.5-5.6 OSS lens',
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
          category_ids: [categoryResult.find((cat) => cat.name === 'Prime Lenses')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'canon-collection')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Canon')?.id,
            productTagResult.find((tag) => tag.value === 'Full Frame')?.id,
            productTagResult.find((tag) => tag.value === 'Professional')?.id,
            productTagResult.find((tag) => tag.value === 'Portrait')?.id,
            productTagResult.find((tag) => tag.value === 'Weather Sealed')?.id,
          ].filter(Boolean) as string[],
          description:
            'The Canon RF 50mm f/1.2L USM is a professional portrait lens with an ultra-wide f/1.2 aperture, creating beautiful bokeh effects. With Dual Pixel CMOS AF technology and optical image stabilization, this lens delivers outstanding image quality for the Canon EOS R system.',
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
          category_ids: [categoryResult.find((cat) => cat.name === 'Action Cameras')!.id],
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
            'The GoPro Hero 12 Black is the most advanced action camera with 5.3K60 video and HDR, waterproof to 10m. With HyperSmooth 6.0, TimeWarp 3.0, and livestreaming capabilities, it is perfect for extreme sports and content creation.',
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
          category_ids: [categoryResult.find((cat) => cat.name === 'Film Cameras')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'professional-series')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Leica')?.id,
            productTagResult.find((tag) => tag.value === 'Full Frame')?.id,
            productTagResult.find((tag) => tag.value === 'Professional')?.id,
            productTagResult.find((tag) => tag.value === 'Street Photography')?.id,
            productTagResult.find((tag) => tag.value === 'Portrait')?.id,
          ].filter(Boolean) as string[],
          description:
            'The Leica M11 is the pinnacle of rangefinder photography with a 60MP BSI CMOS sensor, a classic durable design, and outstanding image quality. Compatible with the entire M-lens system, it offers the purest and most refined photography experience.',
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
          category_ids: [categoryResult.find((cat) => cat.name === 'Instant Cameras')!.id],
          collection_id: collectionResult.find((col) => col.handle === 'fujifilm-collection')!.id,
          tag_ids: [
            productTagResult.find((tag) => tag.value === 'Fujifilm')?.id,
            productTagResult.find((tag) => tag.value === 'Travel')?.id,
            productTagResult.find((tag) => tag.value === 'Beginner Friendly')?.id,
          ].filter(Boolean) as string[],
          description:
            'The Fujifilm Instax Mini 12 is a compact and easy-to-use instant camera, perfect for memorable moments. With its smart automatic mode, built-in selfie lens, and bright color design, it offers a fun and simple photography experience.',
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
          category_ids: [categoryResult.find((cat) => cat.name === 'Zoom Lenses')!.id],
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
            'The Sony FE 24-70mm f/2.8 GM II is the new generation G Master standard zoom lens, 20% lighter than its predecessor with extremely high resolution. With 4 XD Linear motors and optical image stabilization, this lens is perfect for both professional photography and videography.',
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