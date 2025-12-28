"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

import LineItem from "./line-item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type LineItemsPreviewProps = {
  cart: HttpTypes.StoreCart
}

const LineItemsPreview = ({ cart }: LineItemsPreviewProps) => {
  const items = cart.items
  const hasOverflow = items && items.length > 4

  return (
    <div
      className={clx({
        "overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <div className="overflow-x-auto">
        <table className="table w-full" data-testid="items-table">
          <tbody>
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return (
                      <LineItem
                        key={item.id}
                        item={item}
                        type="preview"
                        currencyCode={cart.currency_code}
                        cartId={cart.id}
                      />
                    )
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LineItemsPreview