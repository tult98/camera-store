import SkeletonFilterGroup from "@modules/skeletons/components/skeleton-filter-group"

const SkeletonFilterSidebar = () => {
  return (
    <div className="w-full space-y-4">
      {/* Sort Dropdown Skeleton */}
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
      </div>
      
      {/* Filter Groups */}
      {[...Array(6)].map((_, index) => (
        <SkeletonFilterGroup key={index} />
      ))}
    </div>
  )
}

export default SkeletonFilterSidebar