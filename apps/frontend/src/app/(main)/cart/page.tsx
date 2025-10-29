import { retrieveCart } from "@lib/data/cart"
import { getCartIdServer } from "@modules/shared/utils/cart-cookies-server"
import CartPage from "@modules/cart/components/cart-page"
import { Metadata } from "next"

// Force dynamic rendering due to cookies usage
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart() {
  const cartId = await getCartIdServer()
  const cart = await retrieveCart(cartId)

  return <CartPage initialCart={cart} />
}
