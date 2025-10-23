import SkeletonFilterGroup from "../../components/skeleton-filter-group"

const SkeletonFilterSidebar = () => {
  return (
    <div className="w-80 bg-base-100 border-r border-base-300 h-full flex flex-col">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-base-300 bg-base-200/30">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-base-300 rounded w-32"></div>
          <div className="h-4 bg-base-300/60 rounded w-48"></div>
          <div className="mt-4">
            <div className="h-10 bg-base-300 rounded-lg w-full"></div>
          </div>
        </div>
      </div>

      {/* Filter Groups Skeleton */}
      <div className="flex-1 overflow-y-auto">
        {[...Array(4)].map((_, index) => (
          <SkeletonFilterGroup key={index} />
        ))}
      </div>

      {/* Clear All Button Skeleton */}
      <div className="p-6 border-t border-base-300 bg-base-200/30">
        <div className="animate-pulse">
          <div className="h-10 bg-base-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonFilterSidebar