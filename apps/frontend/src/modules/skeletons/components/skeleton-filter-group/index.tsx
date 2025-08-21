const SkeletonFilterGroup = () => {
  return (
    <div className="animate-pulse">
      <div className="collapse collapse-arrow bg-base-200">
        <input type="checkbox" defaultChecked disabled />
        <div className="collapse-title">
          {/* Filter Group Title */}
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="collapse-content">
          <div className="space-y-2">
            {/* Filter Options */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-2 p-1">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-3 bg-gray-100 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonFilterGroup