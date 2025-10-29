import { retrieveCart } from "@lib/data/cart"
import { getCartId } from "@lib/data/cookies"
import EmptyCartMessage from "@modules/cart/components/empty-cart-message"
import Checkout from "@modules/checkout/components"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams
  const buyNowCartId =
    typeof params.buyNowCartId === "string" ? params.buyNowCartId : undefined

  const cartId = buyNowCartId || (await getCartId())

  const cart = await retrieveCart(cartId)

  return <Checkout initialCart={cart} />
}
