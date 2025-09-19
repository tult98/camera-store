"use client"

import { HttpTypes } from "@medusajs/types"
import { useState, useMemo, useCallback } from "react"
import { isEqual } from "lodash"
import ProductInfo from "@modules/products/templates/product-info"
import ProductActions from "@modules/products/components/product-actions"

type ProductDetailsWrapperProps = {
  product: HttpTypes.StoreProduct
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductDetailsWrapper({
  product,
  disabled
}: ProductDetailsWrapperProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return undefined

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const handleOptionsChange = useCallback((newOptions: Record<string, string | undefined>) => {
    setOptions(newOptions)
  }, [])

  return (
    <>
      <ProductInfo product={product} selectedVariant={selectedVariant} />
      <ProductActions 
        product={product} 
        disabled={disabled}
        onOptionsChange={handleOptionsChange}
        initialOptions={options}
      />
    </>
  )
}