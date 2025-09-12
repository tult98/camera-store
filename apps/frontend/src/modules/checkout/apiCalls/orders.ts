import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export async function completeOrder({
  cart,
  shippingMethodId,
  providerId,
}: {
  cart: HttpTypes.StoreCart
  shippingMethodId: string
  providerId: string
  isBuyNow?: boolean
}) {
  await sdk.store.cart.addShippingMethod(cart.id, {
    option_id: shippingMethodId,
  })

  await sdk.store.payment.initiatePaymentSession(cart, {
    provider_id: providerId,
  })

  const cartRes = await sdk.store.cart.complete(cart.id)

  return cartRes.type === "order" ? cartRes.order : null
}
3