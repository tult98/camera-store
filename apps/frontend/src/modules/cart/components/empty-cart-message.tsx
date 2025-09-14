import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShoppingCartIcon, CameraIcon, SparklesIcon } from "@heroicons/react/24/outline"

const EmptyCartMessage = () => {
  const categories = [
    { name: "Cameras", href: "/categories/cameras", icon: CameraIcon },
    { name: "Lenses", href: "/categories/lenses", icon: SparklesIcon },
    { name: "All Products", href: "/store", icon: ShoppingCartIcon },
  ]

  return (
    <div className="min-h-[60vh] flex items-center justify-center" data-testid="empty-cart-message">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="relative inline-block">
            <ShoppingCartIcon className="w-24 h-24 text-base-content/20" />
            <div className="absolute -bottom-2 -right-2 bg-base-200 rounded-full p-2">
              <span className="text-2xl">😔</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-base-content mb-4">
          Your Cart is Empty
        </h2>
        
        <p className="text-lg text-base-content/70 mb-8 max-w-md mx-auto">
          Looks like you haven&apos;t added any camera gear to your cart yet. 
          Let&apos;s find the perfect equipment for your photography needs!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <LocalizedClientLink
              key={category.name}
              href={category.href}
              className="card bg-base-200 hover:bg-base-300 transition-colors"
            >
              <div className="card-body items-center text-center p-6">
                <category.icon className="w-8 h-8 text-primary mb-2" />
                <h3 className="card-title text-base">{category.name}</h3>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
        
        <LocalizedClientLink href="/store">
          <button className="btn btn-primary btn-lg">
            Start Shopping
            <ShoppingCartIcon className="w-5 h-5 ml-2" />
          </button>
        </LocalizedClientLink>
        
        <div className="mt-12 p-6 bg-base-200 rounded-lg">
          <h3 className="font-semibold text-base-content mb-2">
            🎯 Pro Tip
          </h3>
          <p className="text-sm text-base-content/70">
            Create an account to save items to your wishlist and get personalized recommendations 
            based on your photography style!
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmptyCartMessage
