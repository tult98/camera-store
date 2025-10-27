"use client"

import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useDeleteCartItem, useUpdateCartItem } from "@lib/hooks/use-cart"
import { HttpTypes } from "@medusajs/types"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Image from "next/image"
import Link from "next/link"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
  cartId?: string
}

const LineItem = ({ item, type = "full", currencyCode, cartId }: ItemProps) => {
  const updateCartItem = useUpdateCartItem(cartId || "")
  const deleteCartItem = useDeleteCartItem(cartId || "")

  const changeQuantity = (quantity: number) => {
    if (!cartId || quantity < 1) return

    updateCartItem.mutate({
      lineId: item.id,
      quantity,
    })
  }

  const handleDelete = () => {
    if (!cartId) return
    deleteCartItem.mutate(item.id)
  }

  const isUpdating =
    updateCartItem.isPending && updateCartItem.variables?.lineId === item.id
  const isDeleting =
    deleteCartItem.isPending && deleteCartItem.variables === item.id

  const maxQuantity = 10

  if (type === "preview") {
    return (
      <tr className="border-b border-base-content/10">
        <td className="p-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/products/${item.product_handle}`}
              className="flex-shrink-0"
            >
              <div className="w-16 h-16 relative">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.product_title || ""}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-base-200 rounded-lg" />
                )}
              </div>
            </Link>

            <div className="flex-grow min-w-0">
              <h3 className="text-sm font-medium text-base-content truncate">
                {item.product_title}
              </h3>
              <LineItemOptions variant={item.variant} />
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-base-content/70">
                  {item.quantity}x
                </span>
                <LineItemUnitPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </div>
            </div>

            <div className="text-right">
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden card bg-base-100 border border-base-300">
        <div className="card-body p-4">
          <div className="flex gap-4">
            <Link
              href={`/products/${item.product_handle}`}
              className="flex-shrink-0"
            >
              <div className="w-20 h-20 relative">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.product_title || ""}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-base-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-base-content/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Link>

            <div className="flex-grow min-w-0">
              <Link href={`/products/${item.product_handle}`}>
                <h3
                  className="font-semibold text-base-content line-clamp-2"
                  data-testid="product-title"
                >
                  {item.product_title}
                </h3>
              </Link>
              <LineItemOptions
                variant={item.variant}
                data-testid="product-variant"
              />
              <div className="mt-2">
                <LineItemUnitPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="join">
              <button
                onClick={() => changeQuantity((item.quantity || 1) - 1)}
                disabled={isUpdating || isDeleting || (item.quantity || 1) <= 1}
                className="btn btn-sm join-item"
                aria-label="Decrease quantity"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <div className="btn btn-sm join-item pointer-events-none">
                {isUpdating ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  item.quantity || 1
                )}
              </div>
              <button
                onClick={() => changeQuantity((item.quantity || 1) + 1)}
                disabled={
                  isUpdating ||
                  isDeleting ||
                  (item.quantity || 1) >= maxQuantity
                }
                className="btn btn-sm join-item"
                aria-label="Increase quantity"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-base-content/60">Total</div>
                <LineItemPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </div>
              <button
                onClick={handleDelete}
                disabled={isDeleting || isUpdating}
                className="btn btn-ghost btn-sm btn-square text-error"
                aria-label="Remove item"
                data-testid="product-delete-button"
              >
                {isDeleting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <TrashIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div
        className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center md:py-4 md:border-b md:border-base-content/10"
        data-testid="product-row"
      >
        <div className="col-span-5 flex items-center gap-4">
          <Link
            href={`/products/${item.product_handle}`}
            className="flex-shrink-0"
          >
            <div className="w-20 h-20 relative">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.product_title || ""}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-base-200 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-base-content/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </Link>

          <div className="flex-grow min-w-0">
            <Link href={`/products/${item.product_handle}`}>
              <h3
                className="font-semibold text-base-content hover:text-primary transition-colors"
                data-testid="product-title"
              >
                {item.product_title}
              </h3>
            </Link>
            <LineItemOptions
              variant={item.variant}
              data-testid="product-variant"
            />
          </div>
        </div>

        <div className="col-span-2 text-center">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>

        <div className="col-span-2 flex justify-center items-center">
          <div className="join">
            <button
              onClick={() => changeQuantity((item.quantity || 1) - 1)}
              disabled={isUpdating || isDeleting || (item.quantity || 1) <= 1}
              className="btn btn-sm join-item"
              aria-label="Decrease quantity"
              data-testid="product-select-button"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <div className="btn btn-sm join-item pointer-events-none min-w-[3rem]">
              {isUpdating ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                item.quantity || 1
              )}
            </div>
            <button
              onClick={() => changeQuantity((item.quantity || 1) + 1)}
              disabled={
                isUpdating || isDeleting || (item.quantity || 1) >= maxQuantity
              }
              className="btn btn-sm join-item"
              aria-label="Increase quantity"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="col-span-1 flex justify-center items-center">
          <button
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            className="btn btn-ghost btn-sm btn-square text-error"
            aria-label="Remove item"
            data-testid="product-delete-button"
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <TrashIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="col-span-2 text-right">
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </>
  )
}

export default LineItem
