import {
  CreateInventoryLevelInput,
  ExecArgs,
  ProductDTO,
} from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createProductTypesWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  generateSubCategories,
  productCategoriesData,
} from "src/scripts/data/categories";
import { generateProductsData } from "src/scripts/data/products";
import { attributeGroupsData } from "src/scripts/data/attribute-groups";
import { attributeTemplatesData } from "src/scripts/data/attribute-templates";
import { PRODUCT_ATTRIBUTES_MODULE } from "src/modules/product-attributes";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const productAttributesModuleService = container.resolve(
    PRODUCT_ATTRIBUTES_MODULE
  );

  const countries = ["vn"]; // Vietnam only - no tax calculations needed

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "vnd",
            is_default: true,
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding region data...");
  await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Vietnam",
          currency_code: "vnd",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  logger.info("Finished seeding regions.");

  // Skip tax regions - no tax calculations needed for Vietnam store
  logger.info("Skipping tax regions setup - no tax calculations required.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Fujifilm Hanoi Store",
          address: {
            city: "Hanoi",
            country_code: "VN",
            address_1: "Hanoi, Vietnam",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Shipping from Hanoi Store",
    type: "shipping",
    service_zones: [
      {
        name: "Vietnam",
        geo_zones: [
          {
            country_code: "vn",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Store Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Store Delivery",
          description: "We ensure safe and fast delivery.",
          code: "store-delivery",
        },
        prices: [
          {
            currency_code: "vnd",
            amount: 50000, // 50,000 VND
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Online Store",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  // Note: Cannot update token after creation - tokens are auto-generated by Medusa

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");
  logger.info(`Publishable API Key: ${publishableApiKey.token}`);

  // Update frontend environment file with the actual generated key
  try {
    const fs = require("fs");
    const path = require("path");
    const frontendEnvPath = path.join(
      process.cwd(),
      "..",
      "frontend",
      ".env.local"
    );

    if (fs.existsSync(frontendEnvPath)) {
      let envContent = fs.readFileSync(frontendEnvPath, "utf8");

      // Replace the publishable key in the env file
      const keyRegex = /NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*/;
      if (keyRegex.test(envContent)) {
        envContent = envContent.replace(
          keyRegex,
          `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`
        );
      } else {
        // Add the key if it doesn't exist
        envContent += `
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}
`;
      }

      fs.writeFileSync(frontendEnvPath, envContent, "utf8");
      logger.info("✅ Updated frontend .env.local with new publishable key");
    } else {
      logger.warn(
        "⚠️  Frontend .env.local file not found, skipping auto-update"
      );
    }
  } catch (error) {
    logger.warn(
      `⚠️  Failed to update frontend environment file: ${
        (error as Error).message
      }`
    );
  }

  logger.info("Seeding product data...");

  // Create product types
  logger.info("Creating product types...");
  const { result: productTypeResult } = await createProductTypesWorkflow(
    container
  ).run({
    input: {
      product_types: [
        { value: "camera" },
        { value: "lens" },
        { value: "tripod" },
        { value: "filter" },
        { value: "battery" },
        { value: "charger" },
        { value: "memory-card" },
        { value: "bag" },
        { value: "strap" },
        { value: "microphone" },
        { value: "light" },
        { value: "accessory" },
      ],
    },
  });

  // First create main categories with featured metadata
  const { result: mainCategoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: productCategoriesData,
    },
  });

  // Then create subcategories
  const camerasCategory = mainCategoryResult.find(
    (cat) => cat.name === "Cameras"
  );
  const lensesCategory = mainCategoryResult.find(
    (cat) => cat.name === "Lenses"
  );
  const accessoriesCategory = mainCategoryResult.find(
    (cat) => cat.name === "Accessories"
  );
  const audioVideoCategory = mainCategoryResult.find(
    (cat) => cat.name === "Audio & Video"
  );

  const { result: subCategoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: generateSubCategories({
        camerasCategory: camerasCategory!,
        lensesCategory: lensesCategory!,
        accessoriesCategory: accessoriesCategory!,
        audioVideoCategory: audioVideoCategory!,
      }),
    },
  });

  const categoryResult = [...mainCategoryResult, ...subCategoryResult];

  await createProductsWorkflow(container).run({
    input: {
      products: generateProductsData({
        productTypeResult,
        categoryResult,
        shippingProfile,
        defaultSalesChannel,
      }),
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 100,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");

  logger.info("Seeding attribute groups and templates...");

  // Create attribute groups
  const createdGroups = [];
  for (const groupData of attributeGroupsData) {
    try {
      const group = await productAttributesModuleService.createAttributeGroups({
        group_name: groupData.group_name,
        options: groupData.options as unknown as Record<string, unknown>,
      });
      createdGroups.push(group);
      logger.info(`Created attribute group: ${groupData.group_name}`);
    } catch (error) {
      logger.error(
        `Failed to create attribute group ${groupData.group_name}: ${
          (error as Error).message
        }`
      );
    }
  }

  // Create attribute templates
  for (const templateData of attributeTemplatesData) {
    try {
      await productAttributesModuleService.createAttributeTemplates({
        name: templateData.name,
        code: templateData.code,
        description: templateData.description,
        attribute_definitions:
          templateData.attribute_definitions as unknown as Record<
            string,
            unknown
          >,
        is_active: templateData.is_active,
      });
      logger.info(`Created attribute template: ${templateData.name}`);
    } catch (error) {
      logger.error(
        `Failed to create attribute template ${templateData.name}: ${
          (error as Error).message
        }`
      );
    }
  }

  logger.info("Finished seeding attribute groups and templates.");

  // Link products with attribute templates and set values
  logger.info("Linking products with attribute templates...");

  // Get created products
  const productModuleService = container.resolve(Modules.PRODUCT);
  const products = await productModuleService.listProducts(
    {},
    {
      select: ["id", "handle", "title"],
    }
  );

  // Get created attribute templates
  const [templates] =
    await productAttributesModuleService.listAndCountAttributeTemplates({});
  const cameraTemplate = templates.find(
    (t) => t.code === "camera_specifications"
  );
  const lensTemplate = templates.find((t) => t.code === "lens_specifications");

  // Define attribute values for each product
  const productAttributeData = [
    {
      handle: "fujifilm-x100vi",
      template: cameraTemplate,
      values: {
        brand: "Fujifilm",
        sensor_type: "APS-C",
        resolution: 40.2,
        video_resolution: "4K60p",
        weather_sealing: true,
        image_stabilization: true,
        wifi: true,
        bluetooth: true,
        touchscreen: true,
        viewfinder_type: "Hybrid (OVF/EVF)",
        iso_range_min: 160,
        iso_range_max: 12800,
        battery_life: 450,
        lcd_size: 3.0,
        articulating_screen: true,
        weight: "521g (with battery and memory card)",
      },
    },
    {
      handle: "canon-eos-r5",
      template: cameraTemplate,
      values: {
        brand: "Canon",
        sensor_type: "Full Frame",
        resolution: 45,
        video_resolution: "8K30p",
        weather_sealing: true,
        image_stabilization: true,
        wifi: true,
        bluetooth: true,
        touchscreen: true,
        viewfinder_type: "Electronic (EVF)",
        iso_range_min: 100,
        iso_range_max: 51200,
        battery_life: 320,
        lcd_size: 3.2,
        articulating_screen: true,
        weight: "738g (body only with battery)",
      },
    },
    {
      handle: "sony-a7-iv",
      template: cameraTemplate,
      values: {
        brand: "Sony",
        sensor_type: "Full Frame",
        resolution: 33,
        video_resolution: "4K60p",
        weather_sealing: true,
        image_stabilization: true,
        wifi: true,
        bluetooth: true,
        touchscreen: true,
        viewfinder_type: "Electronic (EVF)",
        iso_range_min: 100,
        iso_range_max: 51200,
        battery_life: 580,
        lcd_size: 3.0,
        articulating_screen: true,
        weight: "658g (with battery and memory card)",
      },
    },
    {
      handle: "gopro-hero-12-black",
      template: cameraTemplate,
      values: {
        brand: "GoPro",
        sensor_type: "1/1.9-inch",
        resolution: 27,
        video_resolution: "4K120p",
        weather_sealing: true,
        image_stabilization: true,
        wifi: true,
        bluetooth: true,
        touchscreen: true,
        viewfinder_type: "None",
        iso_range_min: 100,
        iso_range_max: 6400,
        battery_life: 1200,
        lcd_size: 2.27,
        articulating_screen: false,
        weight: "154g (with battery)",
      },
    },
    {
      handle: "leica-m11",
      template: cameraTemplate,
      values: {
        brand: "Leica",
        sensor_type: "Full Frame",
        resolution: 60,
        video_resolution: "No Video",
        weather_sealing: false,
        image_stabilization: false,
        wifi: true,
        bluetooth: true,
        touchscreen: true,
        viewfinder_type: "Rangefinder",
        iso_range_min: 64,
        iso_range_max: 50000,
        battery_life: 700,
        lcd_size: 2.95,
        articulating_screen: false,
        weight: "640g (Silver Chrome with battery)",
      },
    },
    {
      handle: "fujifilm-instax-mini-12",
      template: cameraTemplate,
      values: {
        brand: "Fujifilm",
        sensor_type: "1-inch",
        resolution: 2,
        video_resolution: "No Video",
        weather_sealing: false,
        image_stabilization: false,
        wifi: false,
        bluetooth: false,
        touchscreen: false,
        viewfinder_type: "Optical (OVF)",
        iso_range_min: 800,
        iso_range_max: 800,
        battery_life: 100,
        lcd_size: 0,
        articulating_screen: false,
        weight: "306g (without batteries)",
      },
    },
    {
      handle: "canon-rf-50mm-f1-2l-usm",
      template: lensTemplate,
      values: {
        brand: "Canon",
        lens_type: "Prime",
        focal_length_min: 50,
        focal_length_max: 50,
        max_aperture: "f/1.2",
        mount: "Canon RF",
        weather_sealing: true,
        image_stabilization: false,
        weight: "950g",
      },
    },
    {
      handle: "sony-fe-24-70mm-f2-8-gm-ii",
      template: lensTemplate,
      values: {
        brand: "Sony",
        lens_type: "Zoom",
        focal_length_min: 24,
        focal_length_max: 70,
        max_aperture: "f/2.8",
        mount: "Sony E",
        weather_sealing: true,
        image_stabilization: false,
        weight: "695g",
      },
    },
  ];

  // Create product attributes
  for (const data of productAttributeData) {
    try {
      const product = products.find(
        (p: ProductDTO) => p.handle === data.handle
      );
      if (!product) {
        logger.warn(`Product not found: ${data.handle}`);
        continue;
      }
      if (!data.template) {
        logger.warn(`Template not found for product: ${data.handle}`);
        continue;
      }

      await productAttributesModuleService.createProductAttributes({
        product_id: product.id,
        template_id: data.template.id,
        attribute_values: data.values as unknown as Record<string, unknown>,
      });

      logger.info(`Created attributes for product: ${product.title}`);
    } catch (error) {
      logger.error(
        `Failed to create attributes for product ${data.handle}: ${
          (error as Error).message
        }`
      );
    }
  }

  logger.info("Finished linking products with attribute templates.");
}
