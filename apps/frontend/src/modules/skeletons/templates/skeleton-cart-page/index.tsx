import { ShoppingBagIcon } from "@heroicons/react/24/outline"
import repeat from "@lib/util/repeat"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import SkeletonOrderSummary from "@modules/skeletons/components/skeleton-order-summary"

const SkeletonCartPage = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-base-content flex items-center gap-3">
            <ShoppingBagIcon className="w-8 h-8 md:w-10 md:h-10 text-base-content/30" />
            <div className="w-48 h-10 bg-base-300 animate-pulse rounded" />
          </h1>
          <div className="mt-2">
            <div className="w-32 h-6 bg-base-300 animate-pulse rounded" />
          </div>
        </div>

        <div data-testid="cart-container">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-6">
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body p-4 md:p-6">
                  <div className="space-y-4">
                    <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:pb-4 md:border-b md:border-base-300">
                      <div className="col-span-5">
                        <div className="w-20 h-4 bg-base-300 animate-pulse rounded" />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <div className="w-12 h-4 bg-base-300 animate-pulse rounded" />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <div className="w-16 h-4 bg-base-300 animate-pulse rounded" />
                      </div>
                      <div className="col-span-1"></div>
                      <div className="col-span-2 flex justify-end">
                        <div className="w-12 h-4 bg-base-300 animate-pulse rounded" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {repeat(3).map((index) => (
                        <SkeletonLineItem key={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:sticky xl:top-20 h-fit">
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body">
                  <SkeletonOrderSummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonCartPage
