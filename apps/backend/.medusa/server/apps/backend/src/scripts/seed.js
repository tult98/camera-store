"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedDemoData;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const categories_1 = require("src/scripts/data/categories");
const products_1 = require("src/scripts/data/products");
const attribute_groups_1 = require("src/scripts/data/attribute-groups");
const attribute_templates_1 = require("src/scripts/data/attribute-templates");
const product_attributes_1 = require("src/modules/product-attributes");
async function seedDemoData({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    const productAttributesModuleService = container.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
    const countries = ["vn"]; // Vietnam only - no tax calculations needed
    logger.info("Seeding store data...");
    const [store] = await storeModuleService.listStores();
    let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });
    if (!defaultSalesChannel.length) {
        // create the default sales channel
        const { result: salesChannelResult } = await (0, core_flows_1.createSalesChannelsWorkflow)(container).run({
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
    await (0, core_flows_1.updateStoresWorkflow)(container).run({
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
    await (0, core_flows_1.createRegionsWorkflow)(container).run({
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
    const { result: stockLocationResult } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
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
        const { result: shippingProfileResult } = await (0, core_flows_1.createShippingProfilesWorkflow)(container).run({
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
        [utils_1.Modules.STOCK_LOCATION]: {
            stock_location_id: stockLocation.id,
        },
        [utils_1.Modules.FULFILLMENT]: {
            fulfillment_provider_id: "manual_manual",
        },
    });
    await link.create({
        [utils_1.Modules.STOCK_LOCATION]: {
            stock_location_id: stockLocation.id,
        },
        [utils_1.Modules.FULFILLMENT]: {
            fulfillment_set_id: fulfillmentSet.id,
        },
    });
    await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
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
    await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
        input: {
            id: stockLocation.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info("Finished seeding stock location data.");
    logger.info("Seeding publishable API key data...");
    const { result: publishableApiKeyResult } = await (0, core_flows_1.createApiKeysWorkflow)(container).run({
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
    await (0, core_flows_1.linkSalesChannelsToApiKeyWorkflow)(container).run({
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
        const frontendEnvPath = path.join(process.cwd(), "..", "frontend", ".env.local");
        if (fs.existsSync(frontendEnvPath)) {
            let envContent = fs.readFileSync(frontendEnvPath, "utf8");
            // Replace the publishable key in the env file
            const keyRegex = /NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*/;
            if (keyRegex.test(envContent)) {
                envContent = envContent.replace(keyRegex, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`);
            }
            else {
                // Add the key if it doesn't exist
                envContent += `
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}
`;
            }
            fs.writeFileSync(frontendEnvPath, envContent, "utf8");
            logger.info("✅ Updated frontend .env.local with new publishable key");
        }
        else {
            logger.warn("⚠️  Frontend .env.local file not found, skipping auto-update");
        }
    }
    catch (error) {
        logger.warn(`⚠️  Failed to update frontend environment file: ${error.message}`);
    }
    logger.info("Seeding product data...");
    // Create product types
    logger.info("Creating product types...");
    const { result: productTypeResult } = await (0, core_flows_1.createProductTypesWorkflow)(container).run({
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
    const { result: mainCategoryResult } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
        input: {
            product_categories: categories_1.productCategoriesData,
        },
    });
    // Then create subcategories
    const camerasCategory = mainCategoryResult.find((cat) => cat.name === "Cameras");
    const lensesCategory = mainCategoryResult.find((cat) => cat.name === "Lenses");
    const accessoriesCategory = mainCategoryResult.find((cat) => cat.name === "Accessories");
    const audioVideoCategory = mainCategoryResult.find((cat) => cat.name === "Audio & Video");
    const { result: subCategoryResult } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
        input: {
            product_categories: (0, categories_1.generateSubCategories)({
                camerasCategory: camerasCategory,
                lensesCategory: lensesCategory,
                accessoriesCategory: accessoriesCategory,
                audioVideoCategory: audioVideoCategory,
            }),
        },
    });
    const categoryResult = [...mainCategoryResult, ...subCategoryResult];
    await (0, core_flows_1.createProductsWorkflow)(container).run({
        input: {
            products: (0, products_1.generateProductsData)({
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
    const inventoryLevels = [];
    for (const inventoryItem of inventoryItems) {
        const inventoryLevel = {
            location_id: stockLocation.id,
            stocked_quantity: 100,
            inventory_item_id: inventoryItem.id,
        };
        inventoryLevels.push(inventoryLevel);
    }
    await (0, core_flows_1.createInventoryLevelsWorkflow)(container).run({
        input: {
            inventory_levels: inventoryLevels,
        },
    });
    logger.info("Finished seeding inventory levels data.");
    logger.info("Seeding attribute groups and templates...");
    // Create attribute groups
    const createdGroups = [];
    for (const groupData of attribute_groups_1.attributeGroupsData) {
        try {
            const group = await productAttributesModuleService.createAttributeGroups({
                group_name: groupData.group_name,
                options: groupData.options,
            });
            createdGroups.push(group);
            logger.info(`Created attribute group: ${groupData.group_name}`);
        }
        catch (error) {
            logger.error(`Failed to create attribute group ${groupData.group_name}: ${error.message}`);
        }
    }
    // Create attribute templates
    for (const templateData of attribute_templates_1.attributeTemplatesData) {
        try {
            await productAttributesModuleService.createAttributeTemplates({
                name: templateData.name,
                code: templateData.code,
                description: templateData.description,
                attribute_definitions: templateData.attribute_definitions,
                is_active: templateData.is_active,
            });
            logger.info(`Created attribute template: ${templateData.name}`);
        }
        catch (error) {
            logger.error(`Failed to create attribute template ${templateData.name}: ${error.message}`);
        }
    }
    logger.info("Finished seeding attribute groups and templates.");
    // Link products with attribute templates and set values
    logger.info("Linking products with attribute templates...");
    // Get created products
    const productModuleService = container.resolve(utils_1.Modules.PRODUCT);
    const products = await productModuleService.listProducts({}, {
        select: ["id", "handle", "title"],
    });
    // Get created attribute templates
    const [templates] = await productAttributesModuleService.listAndCountAttributeTemplates({});
    const cameraTemplate = templates.find((t) => t.code === "camera_specifications");
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
            const product = products.find((p) => p.handle === data.handle);
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
                attribute_values: data.values,
            });
            logger.info(`Created attributes for product: ${product.title}`);
        }
        catch (error) {
            logger.error(`Failed to create attributes for product ${data.handle}: ${error.message}`);
        }
    }
    logger.info("Finished linking products with attribute templates.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUE4QkEsK0JBNm1CQztBQXRvQkQscURBQStFO0FBQy9FLDREQWNxQztBQUNyQyw0REFHcUM7QUFDckMsd0RBQWlFO0FBQ2pFLHdFQUF3RTtBQUN4RSw4RUFBOEU7QUFDOUUsdUVBQTJFO0FBRTVELEtBQUssVUFBVSxZQUFZLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDaEUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9ELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakUsTUFBTSx3QkFBd0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN4RSxNQUFNLHlCQUF5QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUQsTUFBTSw4QkFBOEIsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUN0RCw4Q0FBeUIsQ0FDMUIsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyw0Q0FBNEM7SUFFdEUsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RELElBQUksbUJBQW1CLEdBQUcsTUFBTSx5QkFBeUIsQ0FBQyxpQkFBaUIsQ0FBQztRQUMxRSxJQUFJLEVBQUUsdUJBQXVCO0tBQzlCLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQyxtQ0FBbUM7UUFDbkMsTUFBTSxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxHQUFHLE1BQU0sSUFBQSx3Q0FBMkIsRUFDdEUsU0FBUyxDQUNWLENBQUMsR0FBRyxDQUFDO1lBQ0osS0FBSyxFQUFFO2dCQUNMLGlCQUFpQixFQUFFO29CQUNqQjt3QkFDRSxJQUFJLEVBQUUsdUJBQXVCO3FCQUM5QjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsbUJBQW1CLEdBQUcsa0JBQWtCLENBQUM7SUFDM0MsQ0FBQztJQUVELE1BQU0sSUFBQSxpQ0FBb0IsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDeEMsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxFQUFFO2dCQUNOLG9CQUFvQixFQUFFO29CQUNwQjt3QkFDRSxhQUFhLEVBQUUsS0FBSzt3QkFDcEIsVUFBVSxFQUFFLElBQUk7cUJBQ2pCO2lCQUNGO2dCQUNELHdCQUF3QixFQUFFLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7YUFDcEQ7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUN0QyxNQUFNLElBQUEsa0NBQXFCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3pDLEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxJQUFJLEVBQUUsU0FBUztvQkFDZixhQUFhLEVBQUUsS0FBSztvQkFDcEIsU0FBUztvQkFDVCxpQkFBaUIsRUFBRSxDQUFDLG1CQUFtQixDQUFDO2lCQUN6QzthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFFekMsa0VBQWtFO0lBQ2xFLE1BQU0sQ0FBQyxJQUFJLENBQUMsNERBQTRELENBQUMsQ0FBQztJQUUxRSxNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE1BQU0sSUFBQSx5Q0FBNEIsRUFDeEUsU0FBUyxDQUNWLENBQUMsR0FBRyxDQUFDO1FBQ0osS0FBSyxFQUFFO1lBQ0wsU0FBUyxFQUFFO2dCQUNUO29CQUNFLElBQUksRUFBRSxzQkFBc0I7b0JBQzVCLE9BQU8sRUFBRTt3QkFDUCxJQUFJLEVBQUUsT0FBTzt3QkFDYixZQUFZLEVBQUUsSUFBSTt3QkFDbEIsU0FBUyxFQUFFLGdCQUFnQjtxQkFDNUI7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0MsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSx3QkFBd0IsQ0FBQyxvQkFBb0IsQ0FBQztRQUMzRSxJQUFJLEVBQUUsU0FBUztLQUNoQixDQUFDLENBQUM7SUFDSCxJQUFJLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFFM0UsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sRUFBRSxNQUFNLEVBQUUscUJBQXFCLEVBQUUsR0FDckMsTUFBTSxJQUFBLDJDQUE4QixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUNsRCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNKO3dCQUNFLElBQUksRUFBRSwwQkFBMEI7d0JBQ2hDLElBQUksRUFBRSxTQUFTO3FCQUNoQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0wsZUFBZSxHQUFHLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxNQUFNLGNBQWMsR0FBRyxNQUFNLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDO1FBQzFFLElBQUksRUFBRSwyQkFBMkI7UUFDakMsSUFBSSxFQUFFLFVBQVU7UUFDaEIsYUFBYSxFQUFFO1lBQ2I7Z0JBQ0UsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsU0FBUyxFQUFFO29CQUNUO3dCQUNFLFlBQVksRUFBRSxJQUFJO3dCQUNsQixJQUFJLEVBQUUsU0FBUztxQkFDaEI7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUMsZUFBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ3hCLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxFQUFFO1NBQ3BDO1FBQ0QsQ0FBQyxlQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDckIsdUJBQXVCLEVBQUUsZUFBZTtTQUN6QztLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDLGVBQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUN4QixpQkFBaUIsRUFBRSxhQUFhLENBQUMsRUFBRTtTQUNwQztRQUNELENBQUMsZUFBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3JCLGtCQUFrQixFQUFFLGNBQWMsQ0FBQyxFQUFFO1NBQ3RDO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxJQUFBLDBDQUE2QixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNqRCxLQUFLLEVBQUU7WUFDTDtnQkFDRSxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixVQUFVLEVBQUUsTUFBTTtnQkFDbEIsV0FBVyxFQUFFLGVBQWU7Z0JBQzVCLGVBQWUsRUFBRSxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ25ELG1CQUFtQixFQUFFLGVBQWUsQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLGdCQUFnQjtvQkFDdkIsV0FBVyxFQUFFLG1DQUFtQztvQkFDaEQsSUFBSSxFQUFFLGdCQUFnQjtpQkFDdkI7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOO3dCQUNFLGFBQWEsRUFBRSxLQUFLO3dCQUNwQixNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWE7cUJBQzdCO2lCQUNGO2dCQUNELEtBQUssRUFBRTtvQkFDTDt3QkFDRSxTQUFTLEVBQUUsa0JBQWtCO3dCQUM3QixLQUFLLEVBQUUsTUFBTTt3QkFDYixRQUFRLEVBQUUsSUFBSTtxQkFDZjtvQkFDRDt3QkFDRSxTQUFTLEVBQUUsV0FBVzt3QkFDdEIsS0FBSyxFQUFFLE9BQU87d0JBQ2QsUUFBUSxFQUFFLElBQUk7cUJBQ2Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBRWxELE1BQU0sSUFBQSxxREFBd0MsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDNUQsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLGFBQWEsQ0FBQyxFQUFFO1lBQ3BCLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNqQztLQUNGLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUVyRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7SUFDbkQsTUFBTSxFQUFFLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQ0FBcUIsRUFDckUsU0FBUyxDQUNWLENBQUMsR0FBRyxDQUFDO1FBQ0osS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFO2dCQUNSO29CQUNFLEtBQUssRUFBRSxjQUFjO29CQUNyQixJQUFJLEVBQUUsYUFBYTtvQkFDbkIsVUFBVSxFQUFFLEVBQUU7aUJBQ2Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyRCxpRkFBaUY7SUFFakYsTUFBTSxJQUFBLDhDQUFpQyxFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNyRCxLQUFLLEVBQUU7WUFDTCxFQUFFLEVBQUUsaUJBQWlCLENBQUMsRUFBRTtZQUN4QixHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDakM7S0FDRixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7SUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUUvRCxpRUFBaUU7SUFDakUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUMvQixPQUFPLENBQUMsR0FBRyxFQUFFLEVBQ2IsSUFBSSxFQUNKLFVBQVUsRUFDVixZQUFZLENBQ2IsQ0FBQztRQUVGLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDO1lBQ25DLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRTFELDhDQUE4QztZQUM5QyxNQUFNLFFBQVEsR0FBRyx1Q0FBdUMsQ0FBQztZQUN6RCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDOUIsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQzdCLFFBQVEsRUFDUixzQ0FBc0MsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQ2hFLENBQUM7WUFDSixDQUFDO2lCQUFNLENBQUM7Z0JBQ04sa0NBQWtDO2dCQUNsQyxVQUFVLElBQUk7cUNBQ2UsaUJBQWlCLENBQUMsS0FBSztDQUMzRCxDQUFDO1lBQ0ksQ0FBQztZQUVELEVBQUUsQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLHdEQUF3RCxDQUFDLENBQUM7UUFDeEUsQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUNULDhEQUE4RCxDQUMvRCxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLElBQUksQ0FDVCxtREFDRyxLQUFlLENBQUMsT0FDbkIsRUFBRSxDQUNILENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBRXZDLHVCQUF1QjtJQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDekMsTUFBTSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxHQUFHLE1BQU0sSUFBQSx1Q0FBMEIsRUFDcEUsU0FBUyxDQUNWLENBQUMsR0FBRyxDQUFDO1FBQ0osS0FBSyxFQUFFO1lBQ0wsYUFBYSxFQUFFO2dCQUNiLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtnQkFDbkIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUNqQixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ25CLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtnQkFDbkIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO2dCQUNwQixFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7Z0JBQ3BCLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRTtnQkFDeEIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUNoQixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7Z0JBQ2xCLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTtnQkFDdkIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2dCQUNsQixFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7YUFDdkI7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILHNEQUFzRDtJQUN0RCxNQUFNLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsTUFBTSxJQUFBLDRDQUErQixFQUMxRSxTQUFTLENBQ1YsQ0FBQyxHQUFHLENBQUM7UUFDSixLQUFLLEVBQUU7WUFDTCxrQkFBa0IsRUFBRSxrQ0FBcUI7U0FDMUM7S0FDRixDQUFDLENBQUM7SUFFSCw0QkFBNEI7SUFDNUIsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUM3QyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxTQUFTLENBQ2hDLENBQUM7SUFDRixNQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQzVDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FDL0IsQ0FBQztJQUNGLE1BQU0sbUJBQW1CLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUNqRCxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxhQUFhLENBQ3BDLENBQUM7SUFDRixNQUFNLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FDaEQsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUN0QyxDQUFDO0lBRUYsTUFBTSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxHQUFHLE1BQU0sSUFBQSw0Q0FBK0IsRUFDekUsU0FBUyxDQUNWLENBQUMsR0FBRyxDQUFDO1FBQ0osS0FBSyxFQUFFO1lBQ0wsa0JBQWtCLEVBQUUsSUFBQSxrQ0FBcUIsRUFBQztnQkFDeEMsZUFBZSxFQUFFLGVBQWdCO2dCQUNqQyxjQUFjLEVBQUUsY0FBZTtnQkFDL0IsbUJBQW1CLEVBQUUsbUJBQW9CO2dCQUN6QyxrQkFBa0IsRUFBRSxrQkFBbUI7YUFDeEMsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxjQUFjLEdBQUcsQ0FBQyxHQUFHLGtCQUFrQixFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztJQUVyRSxNQUFNLElBQUEsbUNBQXNCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzFDLEtBQUssRUFBRTtZQUNMLFFBQVEsRUFBRSxJQUFBLCtCQUFvQixFQUFDO2dCQUM3QixpQkFBaUI7Z0JBQ2pCLGNBQWM7Z0JBQ2QsZUFBZTtnQkFDZixtQkFBbUI7YUFDcEIsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBRTlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUV6QyxNQUFNLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNqRCxNQUFNLEVBQUUsZ0JBQWdCO1FBQ3hCLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztLQUNmLENBQUMsQ0FBQztJQUVILE1BQU0sZUFBZSxHQUFnQyxFQUFFLENBQUM7SUFDeEQsS0FBSyxNQUFNLGFBQWEsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxNQUFNLGNBQWMsR0FBRztZQUNyQixXQUFXLEVBQUUsYUFBYSxDQUFDLEVBQUU7WUFDN0IsZ0JBQWdCLEVBQUUsR0FBRztZQUNyQixpQkFBaUIsRUFBRSxhQUFhLENBQUMsRUFBRTtTQUNwQyxDQUFDO1FBQ0YsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsTUFBTSxJQUFBLDBDQUE2QixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNqRCxLQUFLLEVBQUU7WUFDTCxnQkFBZ0IsRUFBRSxlQUFlO1NBQ2xDO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0lBRXZELE1BQU0sQ0FBQyxJQUFJLENBQUMsMkNBQTJDLENBQUMsQ0FBQztJQUV6RCwwQkFBMEI7SUFDMUIsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLEtBQUssTUFBTSxTQUFTLElBQUksc0NBQW1CLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUM7WUFDSCxNQUFNLEtBQUssR0FBRyxNQUFNLDhCQUE4QixDQUFDLHFCQUFxQixDQUFDO2dCQUN2RSxVQUFVLEVBQUUsU0FBUyxDQUFDLFVBQVU7Z0JBQ2hDLE9BQU8sRUFBRSxTQUFTLENBQUMsT0FBNkM7YUFDakUsQ0FBQyxDQUFDO1lBQ0gsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sQ0FBQyxLQUFLLENBQ1Ysb0NBQW9DLFNBQVMsQ0FBQyxVQUFVLEtBQ3JELEtBQWUsQ0FBQyxPQUNuQixFQUFFLENBQ0gsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBRUQsNkJBQTZCO0lBQzdCLEtBQUssTUFBTSxZQUFZLElBQUksNENBQXNCLEVBQUUsQ0FBQztRQUNsRCxJQUFJLENBQUM7WUFDSCxNQUFNLDhCQUE4QixDQUFDLHdCQUF3QixDQUFDO2dCQUM1RCxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUk7Z0JBQ3ZCLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSTtnQkFDdkIsV0FBVyxFQUFFLFlBQVksQ0FBQyxXQUFXO2dCQUNyQyxxQkFBcUIsRUFDbkIsWUFBWSxDQUFDLHFCQUdaO2dCQUNILFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUzthQUNsQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sQ0FBQyxLQUFLLENBQ1YsdUNBQXVDLFlBQVksQ0FBQyxJQUFJLEtBQ3JELEtBQWUsQ0FBQyxPQUNuQixFQUFFLENBQ0gsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBRWhFLHdEQUF3RDtJQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7SUFFNUQsdUJBQXVCO0lBQ3ZCLE1BQU0sb0JBQW9CLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEUsTUFBTSxRQUFRLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxZQUFZLENBQ3RELEVBQUUsRUFDRjtRQUNFLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDO0tBQ2xDLENBQ0YsQ0FBQztJQUVGLGtDQUFrQztJQUNsQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQ2YsTUFBTSw4QkFBOEIsQ0FBQyw4QkFBOEIsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxRSxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUNuQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyx1QkFBdUIsQ0FDMUMsQ0FBQztJQUNGLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUsscUJBQXFCLENBQUMsQ0FBQztJQUU3RSwyQ0FBMkM7SUFDM0MsTUFBTSxvQkFBb0IsR0FBRztRQUMzQjtZQUNFLE1BQU0sRUFBRSxpQkFBaUI7WUFDekIsUUFBUSxFQUFFLGNBQWM7WUFDeEIsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRSxVQUFVO2dCQUNqQixXQUFXLEVBQUUsT0FBTztnQkFDcEIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLGdCQUFnQixFQUFFLE9BQU87Z0JBQ3pCLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixtQkFBbUIsRUFBRSxJQUFJO2dCQUN6QixJQUFJLEVBQUUsSUFBSTtnQkFDVixTQUFTLEVBQUUsSUFBSTtnQkFDZixXQUFXLEVBQUUsSUFBSTtnQkFDakIsZUFBZSxFQUFFLGtCQUFrQjtnQkFDbkMsYUFBYSxFQUFFLEdBQUc7Z0JBQ2xCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixZQUFZLEVBQUUsR0FBRztnQkFDakIsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsTUFBTSxFQUFFLHFDQUFxQzthQUM5QztTQUNGO1FBQ0Q7WUFDRSxNQUFNLEVBQUUsY0FBYztZQUN0QixRQUFRLEVBQUUsY0FBYztZQUN4QixNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLE9BQU87Z0JBQ2QsV0FBVyxFQUFFLFlBQVk7Z0JBQ3pCLFVBQVUsRUFBRSxFQUFFO2dCQUNkLGdCQUFnQixFQUFFLE9BQU87Z0JBQ3pCLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixtQkFBbUIsRUFBRSxJQUFJO2dCQUN6QixJQUFJLEVBQUUsSUFBSTtnQkFDVixTQUFTLEVBQUUsSUFBSTtnQkFDZixXQUFXLEVBQUUsSUFBSTtnQkFDakIsZUFBZSxFQUFFLGtCQUFrQjtnQkFDbkMsYUFBYSxFQUFFLEdBQUc7Z0JBQ2xCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixZQUFZLEVBQUUsR0FBRztnQkFDakIsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsTUFBTSxFQUFFLCtCQUErQjthQUN4QztTQUNGO1FBQ0Q7WUFDRSxNQUFNLEVBQUUsWUFBWTtZQUNwQixRQUFRLEVBQUUsY0FBYztZQUN4QixNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLE1BQU07Z0JBQ2IsV0FBVyxFQUFFLFlBQVk7Z0JBQ3pCLFVBQVUsRUFBRSxFQUFFO2dCQUNkLGdCQUFnQixFQUFFLE9BQU87Z0JBQ3pCLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixtQkFBbUIsRUFBRSxJQUFJO2dCQUN6QixJQUFJLEVBQUUsSUFBSTtnQkFDVixTQUFTLEVBQUUsSUFBSTtnQkFDZixXQUFXLEVBQUUsSUFBSTtnQkFDakIsZUFBZSxFQUFFLGtCQUFrQjtnQkFDbkMsYUFBYSxFQUFFLEdBQUc7Z0JBQ2xCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixZQUFZLEVBQUUsR0FBRztnQkFDakIsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsTUFBTSxFQUFFLHFDQUFxQzthQUM5QztTQUNGO1FBQ0Q7WUFDRSxNQUFNLEVBQUUscUJBQXFCO1lBQzdCLFFBQVEsRUFBRSxjQUFjO1lBQ3hCLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsT0FBTztnQkFDZCxXQUFXLEVBQUUsWUFBWTtnQkFDekIsVUFBVSxFQUFFLEVBQUU7Z0JBQ2QsZ0JBQWdCLEVBQUUsUUFBUTtnQkFDMUIsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLG1CQUFtQixFQUFFLElBQUk7Z0JBQ3pCLElBQUksRUFBRSxJQUFJO2dCQUNWLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixlQUFlLEVBQUUsTUFBTTtnQkFDdkIsYUFBYSxFQUFFLEdBQUc7Z0JBQ2xCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsTUFBTSxFQUFFLHFCQUFxQjthQUM5QjtTQUNGO1FBQ0Q7WUFDRSxNQUFNLEVBQUUsV0FBVztZQUNuQixRQUFRLEVBQUUsY0FBYztZQUN4QixNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLE9BQU87Z0JBQ2QsV0FBVyxFQUFFLFlBQVk7Z0JBQ3pCLFVBQVUsRUFBRSxFQUFFO2dCQUNkLGdCQUFnQixFQUFFLFVBQVU7Z0JBQzVCLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixtQkFBbUIsRUFBRSxLQUFLO2dCQUMxQixJQUFJLEVBQUUsSUFBSTtnQkFDVixTQUFTLEVBQUUsSUFBSTtnQkFDZixXQUFXLEVBQUUsSUFBSTtnQkFDakIsZUFBZSxFQUFFLGFBQWE7Z0JBQzlCLGFBQWEsRUFBRSxFQUFFO2dCQUNqQixhQUFhLEVBQUUsS0FBSztnQkFDcEIsWUFBWSxFQUFFLEdBQUc7Z0JBQ2pCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLG1CQUFtQixFQUFFLEtBQUs7Z0JBQzFCLE1BQU0sRUFBRSxtQ0FBbUM7YUFDNUM7U0FDRjtRQUNEO1lBQ0UsTUFBTSxFQUFFLHlCQUF5QjtZQUNqQyxRQUFRLEVBQUUsY0FBYztZQUN4QixNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLFdBQVcsRUFBRSxRQUFRO2dCQUNyQixVQUFVLEVBQUUsQ0FBQztnQkFDYixnQkFBZ0IsRUFBRSxVQUFVO2dCQUM1QixlQUFlLEVBQUUsS0FBSztnQkFDdEIsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFdBQVcsRUFBRSxLQUFLO2dCQUNsQixlQUFlLEVBQUUsZUFBZTtnQkFDaEMsYUFBYSxFQUFFLEdBQUc7Z0JBQ2xCLGFBQWEsRUFBRSxHQUFHO2dCQUNsQixZQUFZLEVBQUUsR0FBRztnQkFDakIsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsTUFBTSxFQUFFLDBCQUEwQjthQUNuQztTQUNGO1FBQ0Q7WUFDRSxNQUFNLEVBQUUseUJBQXlCO1lBQ2pDLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsT0FBTztnQkFDZCxTQUFTLEVBQUUsT0FBTztnQkFDbEIsZ0JBQWdCLEVBQUUsRUFBRTtnQkFDcEIsZ0JBQWdCLEVBQUUsRUFBRTtnQkFDcEIsWUFBWSxFQUFFLE9BQU87Z0JBQ3JCLEtBQUssRUFBRSxVQUFVO2dCQUNqQixlQUFlLEVBQUUsSUFBSTtnQkFDckIsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsTUFBTSxFQUFFLE1BQU07YUFDZjtTQUNGO1FBQ0Q7WUFDRSxNQUFNLEVBQUUsNEJBQTRCO1lBQ3BDLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsTUFBTTtnQkFDYixTQUFTLEVBQUUsTUFBTTtnQkFDakIsZ0JBQWdCLEVBQUUsRUFBRTtnQkFDcEIsZ0JBQWdCLEVBQUUsRUFBRTtnQkFDcEIsWUFBWSxFQUFFLE9BQU87Z0JBQ3JCLEtBQUssRUFBRSxRQUFRO2dCQUNmLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixtQkFBbUIsRUFBRSxLQUFLO2dCQUMxQixNQUFNLEVBQUUsTUFBTTthQUNmO1NBQ0Y7S0FDRixDQUFDO0lBRUYsNEJBQTRCO0lBQzVCLEtBQUssTUFBTSxJQUFJLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUM7WUFDSCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUMzQixDQUFDLENBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxDQUM1QyxDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRCxTQUFTO1lBQ1gsQ0FBQztZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUM5RCxTQUFTO1lBQ1gsQ0FBQztZQUVELE1BQU0sOEJBQThCLENBQUMsdUJBQXVCLENBQUM7Z0JBQzNELFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDdEIsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDN0IsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE1BQTRDO2FBQ3BFLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsTUFBTSxDQUFDLEtBQUssQ0FDViwyQ0FBMkMsSUFBSSxDQUFDLE1BQU0sS0FDbkQsS0FBZSxDQUFDLE9BQ25CLEVBQUUsQ0FDSCxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFEQUFxRCxDQUFDLENBQUM7QUFDckUsQ0FBQyJ9