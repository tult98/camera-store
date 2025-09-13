import { sdk } from "@lib/config"
import { CompleteOrderParams } from "@modules/checkout/types"

export async function completeOrder({
  cart,
  shippingMethodId,
  providerId,
}: CompleteOrderParams) {
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