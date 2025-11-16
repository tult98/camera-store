import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service.js';
import {
  Product,
  ProductCategory,
  ProductImage,
  ProductOption,
  ProductTag,
  ProductVariant,
  VariantPrice,
} from './types/product.types.js';

@Injectable()
export class StoreProductService {
  constructor(private readonly prisma: PrismaService) {}

  private async getVariantPrices(
    variantIds: string[],
    currencyCode: string
  ): Promise<Map<string, VariantPrice>> {
    if (variantIds.length === 0) {
      return new Map();
    }

    const priceSetLinks = await this.prisma.product_variant_price_set.findMany({
      where: {
        variant_id: { in: variantIds },
        deleted_at: null,
      },
    });

    if (priceSetLinks.length === 0) {
      return new Map();
    }

    const priceSetIds = priceSetLinks.map((link) => link.price_set_id);

    const priceSets = await this.prisma.price_set.findMany({
      where: {
        id: { in: priceSetIds },
        deleted_at: null,
      },
      include: {
        price: {
          where: {
            currency_code: currencyCode,
            deleted_at: null,
          },
          orderBy: {
            amount: 'asc',
          },
          take: 1,
        },
      },
    });

    const priceSetMap = new Map(
      priceSets
        .filter((ps) => ps.price.length > 0)
        .map((ps) => [
          ps.id,
          {
            currency_code: ps.price[0].currency_code,
            amount: Number(ps.price[0].amount),
          },
        ])
    );

    const variantPriceMap = new Map<string, VariantPrice>();
    for (const link of priceSetLinks) {
      const price = priceSetMap.get(link.price_set_id);
      if (price) {
        variantPriceMap.set(link.variant_id, price);
      }
    }

    return variantPriceMap;
  }

  private transformProduct(
    rawProduct: any,
    variantPrices?: Map<string, VariantPrice>
  ): Product {
    const categories: ProductCategory[] = rawProduct.product_category_product
      ? rawProduct.product_category_product.map((pcp: any) => ({
          ...pcp.product_category,
        }))
      : [];

    const tags: ProductTag[] = rawProduct.product_tags
      ? rawProduct.product_tags.map((pt: any) => ({ ...pt.product_tag }))
      : [];

    const images: ProductImage[] = rawProduct.image
      ? rawProduct.image.map((img: any) => ({ ...img }))
      : [];

    const options: ProductOption[] = rawProduct.product_option
      ? rawProduct.product_option.map((opt: any) => {
          const { product_option_value, ...cleanOption } = opt;
          return {
            ...cleanOption,
            values: product_option_value
              ? product_option_value.map((val: any) => ({ ...val }))
              : [],
          };
        })
      : [];

    const variants: ProductVariant[] = rawProduct.product_variant
      ? rawProduct.product_variant.map((variant: any) => {
          const { product_variant_option, ...cleanVariant } = variant;

          const price = variantPrices?.get(variant.id);

          return {
            ...cleanVariant,
            options: product_variant_option
              ? product_variant_option.map((vopt: any) => ({
                  ...vopt.product_option_value,
                }))
              : [],
            calculated_price: {
              calculated_amount: price?.amount,
              currency_code: price?.currency_code,
              original_amount: price?.amount,
            },
          };
        })
      : [];

    const {
      product_category_product,
      product_tags,
      image,
      product_option,
      product_variant,
      product_type,
      product_collection,
      metadata,
      ...cleanProduct
    } = rawProduct;

    return {
      ...cleanProduct,
      categories,
      type: product_type || null,
      collection: product_collection || null,
      tags,
      images,
      options,
      variants,
      product_attributes: metadata,
    };
  }

  async findByHandle(
    handle: string,
    currencyCode: string = 'USD'
  ): Promise<Product> {
    const rawProduct = await this.prisma.product.findFirst({
      where: {
        handle,
        status: 'published',
        deleted_at: null,
      },
      include: {
        image: true,
        product_option: {
          include: {
            product_option_value: true,
          },
        },
        product_variant: {
          include: {
            product_variant_option: {
              include: {
                product_option_value: true,
              },
            },
          },
        },
        product_category_product: {
          include: {
            product_category: true,
          },
        },
        product_type: true,
        product_collection: true,
        product_tags: {
          include: {
            product_tag: true,
          },
        },
      },
    });

    if (!rawProduct) {
      throw new NotFoundException(`Product with handle "${handle}" not found`);
    }

    const variantIds = rawProduct.product_variant
      ? rawProduct.product_variant.map((v) => v.id)
      : [];

    const variantPrices = await this.getVariantPrices(variantIds, currencyCode);

    return this.transformProduct(rawProduct, variantPrices);
  }
}
