'use client'

import { useCart } from '@lib/hooks/use-cart'
import { useCartId } from '@modules/shared/hooks/use-cart-id'
import { useMemo } from 'react'
import CartLayout from './cart-layout'
import SkeletonCartPage from '@modules/skeletons/templates/skeleton-cart-page'
import { HttpTypes } from "@medusajs/types"
import { useLayoutBreadcrumbs } from '@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs'

type CartPageProps = {
  initialCart?: HttpTypes.StoreCart | null
}

export default function CartPage({ initialCart }: CartPageProps) {
  // Get cart ID from global state - reactive to changes
  const cartId = useCartId()
  
  // Set breadcrumbs for cart page with memoized context
  const breadcrumbContext = useMemo(
    () => ({
      type: 'custom' as const,
      items: [{ title: 'Cart', isActive: true }]
    }),
    []
  )
  useLayoutBreadcrumbs(breadcrumbContext)
  
  // Use React Query with initial data from server - automatically refetches when cartId changes
  const { data: cart, isLoading: cartLoading, error: cartError } = useCart(
    cartId || undefined,
    undefined,
    initialCart
  )
  
  // Only show loading if we don't have initial cart data and are still loading
  if (cartLoading && !initialCart) {
    return <SkeletonCartPage />
  }
  
  if (cartError) {
    console.error('Error loading cart:', cartError)
  }
  
  return <CartLayout cart={cart || null} />
}