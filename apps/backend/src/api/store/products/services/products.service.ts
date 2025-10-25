import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";
import type { MedusaContainer } from "@medusajs/framework/types";
import { PRODUCT_ATTRIBUTES_MODULE } from "src/modules/product-attributes/index";
import { resolveQueryInstance } from "src/utils/category-hierarchy";
import type { Product } from "../../category-products/types/category-products.types";

export interface ProductByHandleParams {
  handle: string;
  region_id: string;
  currency_code: string;
}

export class ProductsService {
  constructor(private container: MedusaContainer) {}

  async getProductByHandle(
    params: ProductByHandleParams
  ): Promise<Product | null> {
    const { handle, region_id, currency_code } = params;

    const query = resolveQueryInstance(this.container);
    const logger = this.container.resolve(ContainerRegistrationKeys.LOGGER);

    const result = await query.graph({
      entity: "product",
      fields: ["*"],
      filters: { handle },
      context: {
        variants: {
          calculated_price: QueryContext({
            region_id,
            currency_code,
          }),
        },
      },
    });

    const products = (result.data || []) as Product[];

    if (products.length === 0) {
      return null;
    }

    const product = products[0];
    const metadata = product.metadata || {};
    const { attribute_template_id, ...attributeValues } = metadata as Record<string, unknown>;

    try {
      if (!attribute_template_id) {
        return {
          ...product,
          product_attributes: attributeValues,
        };
      }

      const productAttributesService = this.container.resolve(
        PRODUCT_ATTRIBUTES_MODULE
      );

      const template = await productAttributesService.retrieveAttributeTemplate(
        attribute_template_id as string
      );

      const formattedAttributes: Record<string, unknown> = {};
      if (template?.attribute_definitions && attributeValues) {
        const templateDefinitions = template.attribute_definitions;
        if (Array.isArray(templateDefinitions)) {
          for (const [key, value] of Object.entries(attributeValues)) {
            const definition = templateDefinitions.find(
              (def: any) => def.key === key
            );

            if (definition?.label && value !== null && value !== undefined) {
              formattedAttributes[definition.label] = value;
            }
          }
        }
      }

      return {
        ...product,
        product_attributes: formattedAttributes,
      };
    } catch (error) {
      logger.error(
        `Error handling product attributes for product ${product.id}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return {
        ...product,
        product_attributes: attributeValues,
      };
    }
  }
}
