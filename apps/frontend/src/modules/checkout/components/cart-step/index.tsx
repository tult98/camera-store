"use client"

import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useCart, useDeleteCartItem, useUpdateCartItem } from "@lib/hooks/use-cart"
import { HttpTypes } from "@medusajs/types"
import { useSearchParams, useRouter } from "next/navigation"

interface CartProps {
  initialCart: HttpTypes.StoreCart
}

export default function CartStep({ initialCart }: CartProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isOpen = searchParams.get("step") === "cart"

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

  if (!isOpen) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-base-content mb-6">
          Shopping Cart
        </h2>

        <div className="space-y-4">
          {currentCart?.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-4 border border-base-200 rounded-lg"
            >
              {/* Product Image */}
              <div className="w-16 h-16 bg-base-200 rounded-lg flex items-center justify-center mr-4">
                {item?.thumbnail ? (
                  <img
                    src={item.thumbnail}
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
                <p className="text-lg font-semibold text-base-content mt-1">
                  ${((item.unit_price || 0) / 100).toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
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

              {/* Delete Button */}
              <button
                onClick={() => handleRemoveItem(item.id)}
                disabled={isItemUpdating(item.id)}
                className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error hover:text-error-content"
                aria-label="Remove item"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Next Step Button */}
        <div className="mt-6 pt-6 border-t border-base-200">
          <div className="flex gap-4">
            <button
              onClick={handleNextStep}
              disabled={!currentCart?.items?.length}
              className="btn btn-primary flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
