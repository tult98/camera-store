import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

export const getPricesForVariant = (variant: any) => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  return {
    calculated_price_number: variant.calculated_price.calculated_amount,
    calculated_price: convertToLocale({
      amount: variant.calculated_price.calculated_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_number: variant.calculated_price.original_amount,
    original_price: convertToLocale({
      amount: variant.calculated_price.original_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    currency_code: variant.calculated_price.currency_code,
    price_type: variant.calculated_price?.price_list_type,
    percentage_diff: getPercentageDiff(
      variant.calculated_price.original_amount,
      variant.calculated_price.calculated_amount
    ),
  }
}

export function getPriceRange(product: HttpTypes.StoreProduct) {
  if (!product || !product.variants?.length) {
    return null
  }

  const variantsWithPrices = product.variants
    .filter((v: any) => !!v.calculated_price)
    .map((v: any) => getPricesForVariant(v))
    .filter(Boolean)

  if (variantsWithPrices.length === 0) {
    return null
  }

  const prices = variantsWithPrices.map(v => v?.calculated_price_number).filter(p => p != null) as number[]
  const originalPrices = variantsWithPrices.map(v => v?.original_price_number).filter(p => p != null) as number[]
  
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const minOriginalPrice = Math.min(...originalPrices)
  const maxOriginalPrice = Math.max(...originalPrices)

  const currencyCode = variantsWithPrices[0]?.currency_code
  const hasRange = minPrice !== maxPrice

  // Check if any variants have sale pricing
  const hasSalePrice = variantsWithPrices.some(v => v?.price_type === "sale")

  return {
    hasRange,
    minPrice: {
      calculated_price_number: minPrice,
      calculated_price: convertToLocale({
        amount: minPrice,
        currency_code: currencyCode,
      }),
      original_price_number: minOriginalPrice,
      original_price: convertToLocale({
        amount: minOriginalPrice,
        currency_code: currencyCode,
      }),
    },
    maxPrice: {
      calculated_price_number: maxPrice,
      calculated_price: convertToLocale({
        amount: maxPrice,
        currency_code: currencyCode,
      }),
      original_price_number: maxOriginalPrice,
      original_price: convertToLocale({
        amount: maxOriginalPrice,
        currency_code: currencyCode,
      }),
    },
    currency_code: currencyCode,
    hasSalePrice,
    percentage_diff: hasSalePrice ? getPercentageDiff(minOriginalPrice, minPrice) : null,
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant: any = product.variants
      .filter((v: any) => !!v.calculated_price)
      .sort((a: any, b: any) => {
        return (
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
