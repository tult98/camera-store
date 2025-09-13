"use client"

import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useCart, useDeleteCartItem, useUpdateCartItem } from "@lib/hooks/use-cart"
import { formatPrice } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useRouter, useSearchParams } from "next/navigation"

interface CartProps {
  initialCart: HttpTypes.StoreCart
}

export default function CartStep({ initialCart }: CartProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { data: cart } = useCart(initialCart.id)
  const currentCart = cart || initialCart

  const updateCartItem = useUpdateCartItem(currentCart.id)
  const deleteCartItem = useDeleteCartItem(currentCart.id)

  const handleUpdateQuantity = (lineItemId: string, quantity: number) => {
    if (quantity < 1) return

    updateCartItem.mutate({
      lineId: lineItemId,
      quantity,
    })
  }

  const handleRemoveItem = (lineItemId: string) => {
    deleteCartItem.mutate(lineItemId)
  }

  const isItemUpdating = (itemId: string) => {
    return (
      (updateCartItem.isPending &&
        updateCartItem.variables?.lineId === itemId) ||
      (deleteCartItem.isPending && deleteCartItem.variables === itemId)
    )
  }

  const handleNextStep = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("step", "shipping-address")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-base-content mb-6">
          Shopping Cart
        </h2>

        <div className="space-y-4">
          {currentCart?.items?.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-gray-50 rounded-lg md:flex md:items-center md:p-4 md:border md:border-base-200 md:bg-white"
            >
              {/* Mobile Layout - Matches mockup exactly */}
              <div className="md:hidden">
                {/* Product Image */}
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item?.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : item?.variant?.product?.thumbnail ? (
                      <img
                        src={item.variant.product.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {item.title}
                    </h3>
                    {item.variant?.title && item.variant.title !== "Default Variant" && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        Variant: {item.variant.title}
                      </p>
                    )}
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {formatPrice(item.unit_price || 0, currentCart.currency_code || 'USD')}
                    </p>
                  </div>
                </div>
                
                {/* Mobile Quantity and Delete */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, (item.quantity || 1) - 1)
                      }
                      disabled={
                        isItemUpdating(item.id) || (item.quantity || 1) <= 1
                      }
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center bg-white flex-shrink-0"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="w-3 h-3" />
                    </button>

                    <span className="text-base font-semibold min-w-[1.5rem] text-center">
                      {item.quantity || 1}
                    </span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, (item.quantity || 1) + 1)
                      }
                      disabled={isItemUpdating(item.id)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center bg-white flex-shrink-0"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isItemUpdating(item.id)}
                    className="p-1.5 flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <TrashIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex md:items-center md:w-full">
                {/* Product Image */}
                <div className="w-16 h-16 bg-base-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  {item?.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : item?.variant?.product?.thumbnail ? (
                    <img
                      src={item.variant.product.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-base-300 rounded"></div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-base-content">
                    {item.title}
                  </h3>
                  {item.variant?.title && item.variant.title !== "Default Variant" && (
                    <p className="text-sm text-gray-500">
                      Variant: {item.variant.title}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-base-content mt-1">
                    {formatPrice(item.total || 0, currentCart.currency_code || 'USD')}
                  </p>
                </div>

                {/* Desktop Quantity Controls */}
                <div className="flex items-center space-x-3 mr-4">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, (item.quantity || 1) - 1)
                    }
                    disabled={
                      isItemUpdating(item.id) || (item.quantity || 1) <= 1
                    }
                    className="btn btn-ghost btn-sm btn-circle"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>

                  <span className="text-lg font-semibold min-w-[2rem] text-center">
                    {item.quantity || 1}
                  </span>

                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, (item.quantity || 1) + 1)
                    }
                    disabled={isItemUpdating(item.id)}
                    className="btn btn-ghost btn-sm btn-circle"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Desktop Delete Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isItemUpdating(item.id)}
                  className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error hover:text-error-content"
                  aria-label="Remove item"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Next Step Button */}
        <div className="mt-6 md:mt-6 pt-6 md:pt-6 md:border-t md:border-base-200">
          <div className="flex gap-4">
            <button
              onClick={handleNextStep}
              disabled={!currentCart?.items?.length}
              className="btn btn-primary w-full"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
