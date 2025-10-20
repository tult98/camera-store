import { Modules } from '@medusajs/framework/utils';
import { updateProductsWorkflow } from '@medusajs/medusa/core-flows';
import { LinkDefinition } from '@medusajs/types';
import { StepResponse } from '@medusajs/workflows-sdk';
import { BRAND_MODULE } from 'src/modules/brand';
import BrandModuleService from 'src/modules/brand/service';

updateProductsWorkflow.hooks.productsUpdated(
  async ({ products, additional_data }, { container }) => {
    if (!additional_data?.brand_id) {
      return new StepResponse([], []);
    }

    const brandModuleService: BrandModuleService =
      container.resolve(BRAND_MODULE);
    const link = container.resolve('link');
    const logger = container.resolve('logger');
    const query = container.resolve('query');

    // if the brand doesn't exist, an error is thrown.
    await brandModuleService.retrieveBrand(additional_data.brand_id as string);

    const linksToCreate: LinkDefinition[] = [];

    for (const product of products) {
      // Query existing links for this product
      const existingLinks = await query.graph({
        entity: 'product_brand',
        fields: ['product_id', 'brand_id'],
        filters: {
          product_id: product.id,
        },
      });

      // Dismiss existing links if any
      if (existingLinks.data?.length > 0) {
        for (const existingLink of existingLinks.data) {
          await link.dismiss({
            [Modules.PRODUCT]: {
              product_id: existingLink.product_id,
            },
            [BRAND_MODULE]: {
              brand_id: existingLink.brand_id,
            },
          });
        }
      }

      // Prepare the new link
      linksToCreate.push({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [BRAND_MODULE]: {
          brand_id: additional_data.brand_id,
        },
      });
    }

    // Create new links
    await link.create(linksToCreate);

    logger.info('Linked brand to products');

    return new StepResponse(linksToCreate, linksToCreate);
  },
  async (links, { container }) => {
    if (!links?.length) {
      return;
    }

    const link = container.resolve('link');

    await link.dismiss(links);
  }
);
