const SkeletonPriceFilter = () => {
  return (
    <div className="animate-pulse">
      <div className="collapse collapse-arrow bg-base-200">
        <input type="checkbox" defaultChecked disabled />
        <div className="collapse-title">
          {/* Filter Group Title */}
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="collapse-content">
          <div className="space-y-4">
            {/* Price Range Input Fields */}
            <div className="flex gap-2 items-center">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <span className="text-base-content/60">-</span>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
            
            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full w-full"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-100 rounded w-12"></div>
                <div className="h-3 bg-gray-100 rounded w-12"></div>
              </div>
            </div>
            
            {/* Apply Button */}
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonPriceFilter