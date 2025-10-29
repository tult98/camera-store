"use client"

import { useCart } from "@lib/hooks/use-cart"
import { useToast } from "@lib/providers/toast-provider"
import { HttpTypes } from "@medusajs/types"
import { useLayoutBreadcrumbs } from "@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs"
import { useCartStore } from "@modules/shared/store/cart-store"
import SkeletonCartPage from "@modules/skeletons/templates/skeleton-cart-page"
import { useEffect, useMemo } from "react"
import CartLayout from "./cart-layout"

type CartPageProps = {
  initialCart?: HttpTypes.StoreCart | null
}

export default function CartPage({ initialCart }: CartPageProps) {
  const activeCartId = useCartStore((state) => state.getActiveCartId())
  const { showToast } = useToast()

  // Set breadcrumbs for cart page with memoized context
  const breadcrumbContext = useMemo(
    () => ({
      type: "custom" as const,
      items: [{ title: "Cart", isActive: true }],
    }),
    []
  )

  useLayoutBreadcrumbs(breadcrumbContext)

  const { data: cart, isLoading, error } = useCart(activeCartId, initialCart)

  useEffect(() => {
    if (!isLoading && error) {
      showToast(
        error.message || "Failed to load cart. Please try again.",
        "error"
      )
    }
  }, [isLoading, error])

  if (isLoading) return <SkeletonCartPage />

  return <CartLayout cart={cart} />
}
