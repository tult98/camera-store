import repeat from "@lib/util/repeat"

const SkeletonShippingAddressStep = () => {
  return (
    <div className="bg-base-100 p-6 rounded-lg border border-base-300">
      <div className="flex flex-row items-center justify-between mb-8">
        <div className="w-56 h-6 bg-base-300 animate-pulse" />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-y-2">
          <div className="w-20 h-4 bg-base-200 animate-pulse mb-2" />
          <div className="w-full h-12 bg-base-300 animate-pulse rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {repeat(2).map((i) => (
            <div key={i} className="grid grid-cols-1 gap-y-2">
              <div className="w-20 h-4 bg-base-200 animate-pulse mb-2" />
              <div className="w-full h-12 bg-base-300 animate-pulse rounded-lg" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-y-2">
          <div className="w-20 h-4 bg-base-200 animate-pulse mb-2" />
          <div className="w-full h-12 bg-base-300 animate-pulse rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-y-2">
          <div className="w-20 h-4 bg-base-200 animate-pulse mb-2" />
          <div className="w-full h-12 bg-base-300 animate-pulse rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-y-2">
          <div className="w-32 h-4 bg-base-200 animate-pulse mb-2" />
          <div className="w-full h-12 bg-base-300 animate-pulse rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {repeat(2).map((i) => (
            <div key={i} className="grid grid-cols-1 gap-y-2">
              <div className="w-20 h-4 bg-base-200 animate-pulse mb-2" />
              <div className="w-full h-12 bg-base-300 animate-pulse rounded-lg" />
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <div className="w-full h-12 bg-base-200 animate-pulse rounded-lg" />
          <div className="w-full h-12 bg-base-300 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonShippingAddressStep
