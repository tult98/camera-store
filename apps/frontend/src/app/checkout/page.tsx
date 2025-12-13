import { retrieveCart } from "@lib/data/cart"
import CheckoutPageContent from "@modules/checkout"
import { getCartIdServer } from "@modules/shared/utils/cart-cookies-server"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams
  const buyNowCartId =
    typeof params.buyNowCartId === "string" ? params.buyNowCartId : undefined

  const cartId = buyNowCartId || (await getCartIdServer())

  const cart = await retrieveCart(cartId)

  return <CheckoutPageContent initialCart={cart} />
}
