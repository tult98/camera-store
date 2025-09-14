import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import Item from "./cart-item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  
  return (
    <div className="space-y-4">
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:pb-4 md:border-b md:border-base-300">
        <div className="col-span-5 text-sm font-semibold text-base-content">Product</div>
        <div className="col-span-2 text-sm font-semibold text-base-content text-center">Price</div>
        <div className="col-span-2 text-sm font-semibold text-base-content text-center">Quantity</div>
        <div className="col-span-1 text-sm font-semibold text-base-content text-center"></div>
        <div className="col-span-2 text-sm font-semibold text-base-content text-right">Total</div>
      </div>
      
      <div className="space-y-4">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code || 'USD'}
                    cartId={cart?.id}
                  />
                )
              })
          : repeat(3).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </div>
    </div>
  )
}

export default ItemsTemplate
