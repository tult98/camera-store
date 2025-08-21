import { Container } from "@medusajs/ui"

const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      {/* Product Image */}
      <Container className="aspect-[9/16] w-full bg-gray-200 rounded-lg" />
      
      {/* Product Info */}
      <div className="mt-4 space-y-2">
        {/* Product Title */}
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        
        {/* Key Specs */}
        <div className="space-y-1 mt-2">
          <div className="h-3 bg-gray-100 rounded w-2/3"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
        
        {/* Price and Rating */}
        <div className="flex justify-between items-center mt-3">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-100 rounded w-16"></div>
        </div>
        
        {/* Action Button */}
        <div className="h-8 bg-gray-200 rounded w-full mt-2"></div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
