const SkeletonCheckoutProgress = () => {
  return (
    <>
      <div className="md:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="ml-3 flex-1">
            <div className="w-32 h-5 bg-gray-200 animate-pulse mb-2" />
            <div className="w-40 h-4 bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="ml-4 flex-1">
                  <div className="w-24 h-4 bg-gray-200 animate-pulse mb-2" />
                  <div className="w-32 h-3 bg-gray-100 animate-pulse" />
                </div>
              </div>
              {index < 3 && (
                <div className="w-5 h-5 mx-4 bg-gray-100 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default SkeletonCheckoutProgress
