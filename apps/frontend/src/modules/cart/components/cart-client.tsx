'use client'

import { useCart } from '@lib/hooks/use-cart'
import { getCartId } from '@modules/shared/utils/cart-cookies'
import { useEffect, useState, useMemo } from 'react'
import CartTemplate from './cart-template'
import SkeletonCartPage from '@modules/skeletons/templates/skeleton-cart-page'
import { HttpTypes } from "@medusajs/types"
import { useLayoutBreadcrumbs } from '@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs'

type CartClientProps = {
  initialCart?: HttpTypes.StoreCart | null
}

export default function CartClient({ initialCart }: CartClientProps) {
  const [cartId, setCartId] = useState<string | null>(null)
  
  // Set breadcrumbs for cart page with memoized context
  const breadcrumbContext = useMemo(
    () => ({
      type: 'custom' as const,
      items: [{ title: 'Cart', isActive: true }]
    }),
    []
  )
  useLayoutBreadcrumbs(breadcrumbContext)
  
  // Get cart ID on client side
  useEffect(() => {
    setCartId(getCartId())
  }, [])
  
  // Use React Query with initial data from server
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
  
  return <CartTemplate cart={cart || null} />
}