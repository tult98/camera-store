const SkeletonActiveFilters = () => {
  return (
    <div className="animate-pulse mb-4">
      <div className="flex flex-wrap gap-2">
        {/* Active Filter Tags */}
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="h-8 bg-gray-200 rounded-full"
            style={{ width: `${60 + index * 20}px` }}
          ></div>
        ))}
        {/* Clear All Button */}
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
  )
}

export default SkeletonActiveFilters