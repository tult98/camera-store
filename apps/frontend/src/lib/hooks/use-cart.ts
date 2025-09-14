'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateLineItem, deleteLineItem, retrieveCart } from '@lib/data/cart'
import { useToast } from '@lib/providers/toast-provider'
import { HttpTypes } from '@medusajs/types'

export function useCart(cartId?: string, isBuyNow?: boolean, initialData?: HttpTypes.StoreCart | null) {
  return useQuery({
    queryKey: ['cart', cartId, isBuyNow],
    queryFn: () => retrieveCart(cartId, isBuyNow),
    enabled: !!cartId || isBuyNow !== undefined,
    initialData: initialData || undefined,
  })
}

export function useUpdateCartItem(cartId: string) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async ({
      lineId,
      quantity,
    }: {
      lineId: string
      quantity: number
    }) => {
      return await updateLineItem({ lineId, quantity, cartId })
    },
    onSuccess: (updatedCart) => {
      // Update the cart data directly in the query cache
      queryClient.setQueryData(['cart', cartId], updatedCart)
      queryClient.setQueryData(['cart', cartId, undefined], updatedCart)
      
      // Also invalidate to ensure all cart queries are updated
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      showToast('Item updated successfully', 'success')
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to update item. Please try again.'
      showToast(errorMessage, 'error')
    },
  })
}

export function useDeleteCartItem(cartId: string) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (lineId: string) => {
      await deleteLineItem(lineId, cartId)
      // After deletion, refetch the cart to get updated data
      return await retrieveCart(cartId)
    },
    onSuccess: (updatedCart) => {
      // Update the cart data directly in the query cache
      if (updatedCart) {
        queryClient.setQueryData(['cart', cartId], updatedCart)
        queryClient.setQueryData(['cart', cartId, undefined], updatedCart)
      }
      
      // Also invalidate to ensure all cart queries are updated
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      showToast('Item removed successfully', 'success')
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to remove item. Please try again.'
      showToast(errorMessage, 'error')
    },
  })
}