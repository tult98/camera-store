"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getDefaultRegion } from "./regions"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string | null) {
  if (!cartId) return null

  const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
    `/store/carts/${cartId}`,
    {
      method: "GET",
      query: {
        fields:
          "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
      },
    }
  )

  return cart
}

export async function buyNow({
  variantId,
  quantity,
}: {
  variantId: string
  quantity: number
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when creating buy now cart")
  }

  const region = await getDefaultRegion()
  // Always create a new cart for buy now
  const cartResp = await sdk.store.cart.create({
    region_id: region?.id,
    currency_code: region?.currency_code,
  })

  const cart = cartResp.cart

  // Add the item to the new cart
  await sdk.store.cart.createLineItem(cart.id, {
    variant_id: variantId,
    quantity,
  })

  return cart.id
}

export async function updateLineItem({
  lineId,
  quantity,
  cartId,
}: {
  lineId: string
  quantity: number
  cartId: string
}) {
  const updatedCart = await sdk.store.cart.updateLineItem(cartId, lineId, {
    quantity,
  })

  return updatedCart.cart
}

export async function deleteLineItem(lineId: string, cartId: string) {
  const deletedLineItem = await sdk.store.cart.deleteLineItem(cartId, lineId)

  return deletedLineItem
}

