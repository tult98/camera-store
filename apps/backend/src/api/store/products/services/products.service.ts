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

interface ProductAttributeData {
  product_id: string;
  template_id: string;
  attribute_values: Record<string, unknown>;
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
      fields: ["id"],
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

    try {
      const productAttributesService = this.container.resolve(
        PRODUCT_ATTRIBUTES_MODULE
      );

      const productAttributes =
        await productAttributesService.listProductAttributes({
          product_id: [product.id],
        });

      logger.debug(
        `Retrieved ${productAttributes.length} product attributes for product ${product.id}`
      );

      const attributesData = productAttributes.find(
        (attr: ProductAttributeData) => attr.product_id === product.id
      );

      if (!attributesData) {
        return {
          ...product,
          product_attributes: {},
        };
      }

      // Get the attribute template to map raw values to labels
      const template = await productAttributesService.retrieveAttributeTemplate(
        attributesData.template_id
      );

      // Transform raw attribute_values to label/value pairs
      const formattedAttributes: Record<string, unknown> = {};
      if (template?.attribute_definitions && attributesData.attribute_values) {
        const templateDefinitions = template.attribute_definitions;
        if (Array.isArray(templateDefinitions)) {
          for (const [key, value] of Object.entries(
            attributesData.attribute_values
          )) {
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
        product_attributes: {},
      };
    }
  }
}
