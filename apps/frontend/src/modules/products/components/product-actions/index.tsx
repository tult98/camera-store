"use client"

import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { ShoppingCartIcon, BoltIcon } from "@heroicons/react/24/outline"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
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

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const params = useParams()
  const countryCode = params['countryCode'] as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex flex-col gap-y-3">
          <span className="text-sm font-medium text-base-content">Số lượng</span>
          
          <div className="flex items-center gap-3">
            <div className="join w-fit">
              <button 
                className="btn btn-sm join-item"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="input input-sm join-item w-16 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] focus:outline-none"
                min="1"
              />
              <button 
                className="btn btn-sm join-item"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
            
            {selectedVariant && (
              <span className="text-sm text-base-content/60">
                {selectedVariant.manage_inventory && selectedVariant.inventory_quantity !== undefined
                  ? `${selectedVariant.inventory_quantity} sản phẩm có sẵn`
                  : selectedVariant.allow_backorder
                  ? "Có thể đặt trước"
                  : "Có sẵn"
                }
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                !!disabled ||
                isAdding ||
                !isValidVariant ||
                !inStock
              }
              className="btn btn-outline h-12 px-6"
              data-testid="add-product-button"
            >
              {isAdding ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : !inStock && selectedVariant && isValidVariant ? (
                "Hết hàng"
              ) : (
                <>
                  <ShoppingCartIcon className="w-5 h-5" />
                  Thêm vào giỏ
                </>
              )}
            </button>
            
            <button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                !!disabled ||
                isAdding ||
                !isValidVariant ||
                !inStock
              }
              className="btn btn-primary h-12 px-6"
              data-testid="buy-now-button"
            >
              {isAdding ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : !inStock && selectedVariant && isValidVariant ? (
                "Hết hàng"
              ) : (
                <>
                  <BoltIcon className="w-5 h-5" />
                  Mua ngay
                </>
              )}
            </button>
          </div>
        </div>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={false}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
