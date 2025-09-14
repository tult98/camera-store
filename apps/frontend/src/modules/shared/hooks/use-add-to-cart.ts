"use client"

import { useDefaultRegion } from "@lib/hooks/use-default-region"
import { useToast } from "@lib/providers/toast-provider"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addItemToCart, createCart, getCart } from "../apiCalls/cart"
import { getCartId, setCartId } from "../utils/cart-cookies"

interface AddToCartParams {
  variantId: string
  quantity: number
}

/**
 * Hook for adding items to cart
 * Handles cart creation if needed and adds items
 */
export function useAddToCart() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { defaultRegion } = useDefaultRegion()

  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartParams) => {
      // Get region info from sessionStorage (set by cameraStoreApi)

      if (!defaultRegion) {
        throw new Error(
          "Region information not available. Please refresh the page."
        )
      }

      // Get existing cart ID or create new cart
      let cartId = getCartId()

      if (!cartId) {
        // Create new cart
        const cart = await createCart(
          defaultRegion.id,
          defaultRegion.currency_code
        )
        cartId = cart.id
        setCartId(cartId)
      } else {
        // Verify existing cart still exists
        const existingCart = await getCart(cartId)
        if (!existingCart) {
          // Cart doesn't exist anymore, create new one
          const cart = await createCart(
            defaultRegion.id,
            defaultRegion.currency_code
          )
          cartId = cart.id
          setCartId(cartId)
        }
      }

      // Add item to cart
      const updatedCart = await addItemToCart(cartId, variantId, quantity)
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      // Update the cart data directly in the query cache
      const cartId = getCartId()
      if (cartId && updatedCart) {
        queryClient.setQueryData(['cart', cartId], updatedCart)
        queryClient.setQueryData(['cart', cartId, undefined], updatedCart)
      }
      
      // Invalidate cart-related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      showToast("Product added to cart successfully!", "success")
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to add item to cart. Please try again."
      showToast(errorMessage, "error")
    },
  })
}
