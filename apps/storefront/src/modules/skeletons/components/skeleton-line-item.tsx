const SkeletonLineItem = () => {
  return (
    <>
      <div className="md:hidden card bg-base-100 border border-base-300">
        <div className="card-body p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-base-300 animate-pulse rounded-lg" />
            </div>

            <div className="flex-grow min-w-0 space-y-2">
              <div className="w-3/4 h-5 bg-base-300 animate-pulse rounded" />
              <div className="w-1/2 h-4 bg-base-300 animate-pulse rounded" />
              <div className="w-20 h-4 bg-base-300 animate-pulse rounded" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="w-28 h-8 bg-base-300 animate-pulse rounded" />
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <div className="w-12 h-3 bg-base-300 animate-pulse rounded" />
                <div className="w-16 h-5 bg-base-300 animate-pulse rounded" />
              </div>
              <div className="w-8 h-8 bg-base-300 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center md:py-4 md:border-b md:border-base-200">
        <div className="col-span-5 flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-base-300 animate-pulse rounded-lg" />
          </div>
          <div className="flex-grow min-w-0 space-y-2">
            <div className="w-3/4 h-5 bg-base-300 animate-pulse rounded" />
            <div className="w-1/2 h-4 bg-base-300 animate-pulse rounded" />
          </div>
        </div>

        <div className="col-span-2 flex justify-center">
          <div className="w-16 h-5 bg-base-300 animate-pulse rounded" />
        </div>

        <div className="col-span-2 flex justify-center">
          <div className="w-28 h-8 bg-base-300 animate-pulse rounded" />
        </div>

        <div className="col-span-1 flex justify-center">
          <div className="w-8 h-8 bg-base-300 animate-pulse rounded" />
        </div>

        <div className="col-span-2 flex justify-end">
          <div className="w-20 h-5 bg-base-300 animate-pulse rounded" />
        </div>
      </div>
    </>
  )
}

export default SkeletonLineItem
