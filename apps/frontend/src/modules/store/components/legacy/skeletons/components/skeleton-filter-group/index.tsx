const SkeletonFilterGroup = () => {
  return (
    <div className="border-b border-base-300 last:border-b-0">
      {/* Filter Header */}
      <div className="p-4">
        <div className="animate-pulse flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-base-300 rounded w-24"></div>
            <div className="w-6 h-4 bg-base-300/60 rounded-full"></div>
          </div>
          <div className="w-4 h-4 bg-base-300 rounded"></div>
        </div>
      </div>

      {/* Filter Content */}
      <div className="px-4 pb-4">
        <div className="animate-pulse space-y-3">
          {/* Checkbox options or slider */}
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-2">
              <div className="w-4 h-4 bg-base-300 rounded"></div>
              <div className="h-4 bg-base-300 rounded flex-1"></div>
              <div className="h-3 bg-base-300/60 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkeletonFilterGroup