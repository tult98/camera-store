const SkeletonProductControls = () => {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-4 p-4 bg-white border border-gray-200 rounded-lg">
        {/* Left side - Sort and View Toggle */}
        <div className="flex gap-4 items-center">
          {/* Sort Dropdown */}
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          
          {/* View Toggle */}
          <div className="flex gap-1">
            <div className="h-10 w-10 bg-gray-200 rounded"></div>
            <div className="h-10 w-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Right side - Compare Button */}
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )
}

export default SkeletonProductControls