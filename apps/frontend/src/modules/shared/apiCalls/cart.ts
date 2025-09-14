import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

/**
 * Get cart by ID
 */
export async function getCart(cartId: string): Promise<HttpTypes.StoreCart | null> {
  try {
    const response = await sdk.client.fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}`, {
      method: "GET",
      query: {
        fields: "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions"
      }
    })
    return response.cart
  } catch (error) {
    console.error("Failed to get cart:", error)
    return null
  }
}

/**
 * Create new cart with region
 */
export async function createCart(regionId: string, currencyCode: string): Promise<HttpTypes.StoreCart> {
  const response = await sdk.store.cart.create({
    region_id: regionId,
    currency_code: currencyCode,
  })
  return response.cart
}

/**
 * Add item to cart
 */
export async function addItemToCart(
  cartId: string, 
  variantId: string, 
  quantity: number
): Promise<HttpTypes.StoreCart> {
  const response = await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  })
  return response.cart
}