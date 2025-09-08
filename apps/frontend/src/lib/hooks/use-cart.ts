'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateLineItem, deleteLineItem, retrieveCart } from '@lib/data/cart'
import { useToast } from '@lib/providers/toast-provider'

export function useCart(cartId?: string, isBuyNow?: boolean) {
  return useQuery({
    queryKey: ['cart', cartId, isBuyNow],
    queryFn: () => retrieveCart(cartId, isBuyNow),
    enabled: !!cartId || isBuyNow !== undefined,
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
    onSuccess: () => {
      // Invalidate cart-related queries to refetch data
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
      return await deleteLineItem(lineId, cartId)
    },
    onSuccess: () => {
      // Invalidate cart-related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      showToast('Item removed successfully', 'success')
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to remove item. Please try again.'
      showToast(errorMessage, 'error')
    },
  })
}