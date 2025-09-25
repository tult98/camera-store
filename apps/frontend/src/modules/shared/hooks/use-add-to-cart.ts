"use client"

import { useDefaultRegion } from "@lib/hooks/use-default-region"
import { useToast } from "@lib/providers/toast-provider"
import { useMutation } from "@tanstack/react-query"
import { addItemToCart, createCart, getCart } from "../apiCalls/cart"
import { useCartStore } from "../store/cart-store"

interface AddToCartParams {
  variantId: string
  quantity: number
}

/**
 * Hook for adding items to cart
 * Handles cart creation if needed and adds items
 */
export function useAddToCart() {
  const { showToast } = useToast()
  const { defaultRegion } = useDefaultRegion()
  const { cartId, setCartId } = useCartStore()

  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartParams) => {
      // Get region info from sessionStorage (set by cameraStoreApi)

      if (!defaultRegion) {
        throw new Error(
          "Region information not available. Please refresh the page."
        )
      }

      // Get existing cart ID or create new cart
      let currentCartId = cartId

      if (!currentCartId) {
        // Create new cart
        const cart = await createCart(
          defaultRegion.id,
          defaultRegion.currency_code
        )
        currentCartId = cart.id
      } else {
        // Verify existing cart still exists
        const existingCart = await getCart(currentCartId)
        if (!existingCart) {
          // Cart doesn't exist anymore, create new one
          const cart = await createCart(
            defaultRegion.id,
            defaultRegion.currency_code
          )
          currentCartId = cart.id
          setCartId(currentCartId)
        }
      }

      // Add item to cart
      const updatedCart = await addItemToCart(
        currentCartId,
        variantId,
        quantity
      )
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      // React Query will automatically refetch cart data when cartId changes
      // No manual cache management needed anymore
      setCartId(updatedCart.id)
      showToast("Product added to cart successfully!", "success")
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to add item to cart. Please try again."
      showToast(errorMessage, "error")
    },
  })
}
