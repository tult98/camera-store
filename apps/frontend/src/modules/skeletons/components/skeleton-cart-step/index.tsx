import repeat from "@lib/util/repeat"

const SkeletonCartStep = () => {
  return (
    <div className="bg-base-100 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="w-48 h-7 bg-base-300 animate-pulse mb-6" />

        <div className="space-y-4">
          {repeat(3).map((i) => (
            <div
              key={i}
              className="p-3 bg-base-200 rounded-lg md:flex md:items-center md:p-4 md:border md:border-base-300 md:bg-base-100"
            >
              <div className="md:hidden">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-base-300 rounded-lg animate-pulse flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="w-32 h-4 bg-base-300 animate-pulse mb-2" />
                    <div className="w-24 h-3 bg-base-200 animate-pulse mb-3" />
                    <div className="w-20 h-6 bg-base-300 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-base-300 animate-pulse" />
                    <div className="w-6 h-5 bg-base-200 animate-pulse" />
                    <div className="w-7 h-7 rounded-full bg-base-300 animate-pulse" />
                  </div>
                  <div className="w-5 h-5 bg-base-200 animate-pulse" />
                </div>
              </div>

              <div className="hidden md:flex md:items-center md:w-full">
                <div className="w-16 h-16 bg-base-300 rounded-lg animate-pulse mr-4 flex-shrink-0" />
                <div className="flex-1">
                  <div className="w-48 h-5 bg-base-300 animate-pulse mb-2" />
                  <div className="w-32 h-4 bg-base-200 animate-pulse mb-2" />
                  <div className="w-24 h-6 bg-base-300 animate-pulse" />
                </div>
                <div className="flex items-center space-x-3 mr-4">
                  <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />
                  <div className="w-8 h-6 bg-base-200 animate-pulse" />
                  <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />
                </div>
                <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 md:mt-6 pt-6 md:pt-6 md:border-t md:border-base-300">
          <div className="w-full h-12 bg-base-300 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCartStep
