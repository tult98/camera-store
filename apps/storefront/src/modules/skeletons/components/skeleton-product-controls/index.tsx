const SkeletonProductControls = () => {
  return (
    <div className="bg-base-200/30 rounded-2xl p-4 mb-6 border border-base-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-5 bg-base-300 rounded w-40 animate-pulse"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 bg-base-200 rounded-lg w-28 border border-base-300"></div>

          <div className="h-10 bg-base-200 rounded-lg w-32 sm:w-48 border border-base-300"></div>

          <div className="hidden lg:flex gap-0 border border-base-300 rounded-lg overflow-hidden">
            <div className="h-10 w-10 bg-base-200"></div>
            <div className="h-10 w-10 bg-base-200 border-l border-base-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductControls