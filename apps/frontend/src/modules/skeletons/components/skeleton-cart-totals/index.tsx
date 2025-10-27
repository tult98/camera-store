const SkeletonCartTotals = ({ header = true }) => {
  return (
    <div className="flex flex-col gap-y-2">
      {header && <div className="w-32 h-4 bg-base-300 animate-pulse rounded mb-2"></div>}
      <div className="flex items-center justify-between">
        <div className="w-20 h-4 bg-base-300 animate-pulse rounded"></div>
        <div className="w-16 h-4 bg-base-300 animate-pulse rounded"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-16 h-4 bg-base-300 animate-pulse rounded"></div>
        <div className="w-16 h-4 bg-base-300 animate-pulse rounded"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-12 h-4 bg-base-300 animate-pulse rounded"></div>
        <div className="w-16 h-4 bg-base-300 animate-pulse rounded"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-14 h-4 bg-base-300 animate-pulse rounded"></div>
        <div className="w-16 h-4 bg-base-300 animate-pulse rounded"></div>
      </div>
    </div>
  )
}

export default SkeletonCartTotals
