"use client"

import { useCart } from "@lib/hooks/use-cart"
import { useToast } from "@lib/providers/toast-provider"
import { HttpTypes } from "@medusajs/types"
import { useLayoutBreadcrumbs } from "@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs"
import { useCartId } from "@modules/shared/hooks/use-cart-id"
import SkeletonCartPage from "@modules/skeletons/templates/skeleton-cart-page"
import { useEffect, useMemo } from "react"
import CartLayout from "./cart-layout"

type CartPageProps = {
  initialCart?: HttpTypes.StoreCart | null
}

export default function CartPage({ initialCart }: CartPageProps) {
  // Get cart ID from global state - reactive to changes
  const cartId = useCartId()
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

  // Use React Query with initial data from server - automatically refetches when cartId changes
  const {
    data: cart,
    isLoading: cartLoading,
    error: cartError,
  } = useCart(cartId || undefined, undefined, initialCart)

  // Show error toast when cart fails to load
  useEffect(() => {
    if (!cartLoading && cartError) {
      const errorMessage =
        cartError instanceof Error
          ? cartError.message
          : "Failed to load cart. Please try again."

      showToast(errorMessage, "error")
    }
  }, [cartError, showToast])

  // Only show loading if we don't have initial cart data and are still loading
  if (cartLoading && !initialCart) {
    return <SkeletonCartPage />
  }

  return <CartLayout cart={cart || null} />
}
