const SkeletonProductPreview = () => {
  return (
    <div className="group h-full">
      <div className="card bg-base-100 shadow-lg h-full flex flex-col border border-base-300 animate-pulse">
        <figure className="relative aspect-square overflow-hidden bg-base-200">
          <div className="w-full h-full bg-base-300" />
        </figure>

        <div className="card-body p-4 flex flex-col flex-grow">
          <div className="space-y-2 min-h-[2.5rem]">
            <div className="h-4 bg-base-300 rounded w-full"></div>
            <div className="h-4 bg-base-300 rounded w-3/4"></div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            <div className="h-5 bg-base-200 rounded-lg w-16"></div>
            <div className="h-5 bg-base-200 rounded-lg w-20"></div>
            <div className="h-5 bg-base-200 rounded-lg w-14"></div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="h-6 bg-base-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
