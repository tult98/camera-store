import { retrieveCart } from "@lib/data/cart"
import { getCartId } from "@lib/data/cookies"
import CartPage from "@modules/cart/components/cart-page"
import { Metadata } from "next"

// Force dynamic rendering due to cookies usage
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart() {
  const cartId = await getCartId()
  const cart = await retrieveCart(cartId)

  return <CartPage initialCart={cart} />
}
