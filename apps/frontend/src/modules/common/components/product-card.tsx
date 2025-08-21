'use client'

import { EyeIcon, HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { ProductData } from '@lib/hooks/useCategoryData'
import { ViewMode } from '@modules/store/store/category-filter-store'
import Link from 'next/link'

interface ProductCardProps {
  product: ProductData
  viewMode?: ViewMode
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIconSolid key={i} className="w-4 h-4 text-yellow-400 opacity-50" />)
      } else {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-base-content/20" />)
      }
    }

    return <div className="flex items-center gap-1">{stars}</div>
  }

  if (viewMode === 'list') {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
        <div className="card-body">
          <div className="flex gap-4">
            <div className="avatar flex-shrink-0">
              <div className="w-24 h-24 rounded-lg">
                <img
                  src={product.thumbnail || '/placeholder-product.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <Link 
                href={`/products/${product.handle}`}
                className="card-title text-sm hover:text-primary transition-colors line-clamp-2"
              >
                {product.title}
              </Link>
              
              <div className="flex items-center gap-2">
                {renderStars(product.rating)}
                {product.review_count && (
                  <span className="text-xs text-base-content/60">
                    ({product.review_count} reviews)
                  </span>
                )}
              </div>

              <div className="text-lg font-bold text-primary">
                {product.price?.amount ? formatPrice(product.price.amount, product.price.currency_code) : 'Price not available'}
              </div>

              {product.key_specs && product.key_specs.length > 0 && (
                <div className="space-y-1">
                  {product.key_specs.slice(0, 3).map((spec, index) => (
                    <div key={index} className="text-xs text-base-content/70">
                      <span className="font-medium">{spec.label}:</span> {spec.value}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`badge badge-sm ${
                  product.availability === 'in-stock' 
                    ? 'badge-success' 
                    : product.availability === 'pre-order'
                    ? 'badge-warning'
                    : 'badge-error'
                }`}>
                  {product.availability === 'in-stock' ? 'In Stock' : 
                   product.availability === 'pre-order' ? 'Pre-Order' : 'Out of Stock'}
                </span>

                <div className="flex gap-1">
                  <button className="btn btn-ghost btn-square btn-sm">
                    <HeartIcon className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-square btn-sm">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="btn btn-primary btn-sm">
                    <ShoppingCartIcon className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
      <figure className="relative">
        <img
          src={product.thumbnail || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <button className="btn btn-ghost btn-square btn-sm bg-base-100/80 hover:bg-base-100">
            <HeartIcon className="w-4 h-4" />
          </button>
          <button className="btn btn-ghost btn-square btn-sm bg-base-100/80 hover:bg-base-100">
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
        
        {product.availability !== 'in-stock' && (
          <div className="absolute top-2 left-2">
            <span className={`badge badge-sm ${
              product.availability === 'pre-order' 
                ? 'badge-warning' 
                : 'badge-error'
            }`}>
              {product.availability === 'pre-order' ? 'Pre-Order' : 'Out of Stock'}
            </span>
          </div>
        )}
      </figure>
      
      <div className="card-body p-4">
        <Link 
          href={`/products/${product.handle}`}
          className="card-title text-sm hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]"
        >
          {product.title}
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          {renderStars(product.rating)}
          {product.review_count && (
            <span className="text-xs text-base-content/60">
              ({product.review_count})
            </span>
          )}
        </div>

        <div className="text-lg font-bold text-primary mb-2">
          {product.price?.amount ? formatPrice(product.price.amount, product.price.currency_code) : 'Price not available'}
        </div>

        {product.key_specs && product.key_specs.length > 0 && (
          <div className="space-y-1 mb-3">
            {product.key_specs.slice(0, 2).map((spec, index) => (
              <div key={index} className="text-xs text-base-content/70">
                <span className="font-medium">{spec.label}:</span> {spec.value}
              </div>
            ))}
          </div>
        )}

        <div className="card-actions justify-end">
          <button 
            className="btn btn-primary btn-sm btn-block"
            disabled={product.availability === 'out-of-stock'}
          >
            <ShoppingCartIcon className="w-4 h-4" />
            {product.availability === 'pre-order' ? 'Pre-Order' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}