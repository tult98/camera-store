"use client"

import { BoltIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { buyNow } from "@lib/data/cart"
import { useToast } from "@lib/providers/toast-provider"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { useAddToCart } from "@modules/shared/hooks"
import { useMutation } from "@tanstack/react-query"
import { isEqual } from "lodash"
import { useRouter } from "next/navigation"
import { useMemo, useRef, useState } from "react"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  disabled?: boolean
  onOptionsChange?: (options: Record<string, string | undefined>) => void
  initialOptions?: Record<string, string | undefined>
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
  onOptionsChange,
  initialOptions = {},
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>(initialOptions)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { showToast } = useToast()

  // Add to cart mutation
  const addToCartMutation = useAddToCart()

  // Buy Now mutation using React Query
  const buyNowMutation = useMutation({
    mutationFn: async ({
      variantId,
      quantity,
    }: {
      variantId: string
      quantity: number
    }) => {
      return await buyNow({ variantId, quantity })
    },
    onSuccess: () => {
      showToast("Product added to checkout successfully!", "success")
      router.push("/checkout")
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to process buy now. Please try again."
      showToast(errorMessage, "error")
    },
  })

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    const newOptions = {
      ...options,
      [optionId]: value,
    }
    setOptions(newOptions)
    onOptionsChange?.(newOptions)
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
  const handleAddToCart = () => {
    if (!selectedVariant?.id) return

    addToCartMutation.mutate({
      variantId: selectedVariant.id,
      quantity: quantity,
    })
  }

  // handle buy now - create new cart and go to checkout
  const handleBuyNow = () => {
    if (!selectedVariant?.id) return

    buyNowMutation.mutate({
      variantId: selectedVariant.id,
      quantity: quantity,
    })
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
                      disabled={!!disabled || addToCartMutation.isPending}
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
          <span className="text-sm font-medium text-base-content">
            Quantity
          </span>

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
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
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
                {selectedVariant.manage_inventory &&
                selectedVariant.inventory_quantity !== undefined
                  ? `${selectedVariant.inventory_quantity} items available`
                  : selectedVariant.allow_backorder
                  ? "Pre-order available"
                  : "Available"}
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
                addToCartMutation.isPending ||
                !isValidVariant ||
                !inStock
              }
              className="btn btn-outline h-12 px-6"
              data-testid="add-product-button"
            >
              {addToCartMutation.isPending && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {!inStock && selectedVariant && isValidVariant ? (
                "Out of stock"
              ) : (
                <>
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={
                !selectedVariant ||
                !!disabled ||
                buyNowMutation.isPending ||
                !isValidVariant ||
                !inStock
              }
              className="btn btn-primary h-12 px-6"
              data-testid="buy-now-button"
            >
              {buyNowMutation.isPending && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {!inStock && selectedVariant && isValidVariant ? (
                "Out of stock"
              ) : (
                <>
                  <BoltIcon className="w-5 h-5" />
                  Buy now
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
          isAdding={addToCartMutation.isPending}
          show={false}
          optionsDisabled={!!disabled || addToCartMutation.isPending}
        />
      </div>
    </>
  )
}
