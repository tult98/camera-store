import Image from 'next/image'
import Link from 'next/link'
import { ProductData } from '@lib/hooks/useCategoryData'
import { ViewMode } from '@modules/store/store/category-filter-store'

interface CategoryProductCardProps {
  product: ProductData
  viewMode?: ViewMode
}

export default function CategoryProductCard({ product, viewMode = 'grid' }: CategoryProductCardProps) {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const imageUrl = product.thumbnail?.startsWith('http') 
    ? product.thumbnail 
    : product.thumbnail?.startsWith('/') 
      ? product.thumbnail
      : `/images/${product.thumbnail}`

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.handle}`}>
        <div className="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <figure className="relative w-48 h-48 shrink-0">
            {product.availability === 'in-stock' ? (
              <div className="absolute top-2 right-2 z-10 badge badge-success badge-sm">
                In Stock
              </div>
            ) : (
              <div className="absolute top-2 right-2 z-10 badge badge-error badge-sm">
                Out of Stock
              </div>
            )}
            {product.thumbnail && (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 192px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/placeholder-camera.svg'
                }}
              />
            )}
          </figure>
          
          <div className="card-body">
            <h3 className="card-title text-lg">{product.title}</h3>
            
            {product.key_specs && product.key_specs.length > 0 && (
              <div className="grid grid-cols-2 gap-2 text-sm my-2">
                {product.key_specs.slice(0, 4).map((spec, index) => (
                  <div key={index}>
                    <span className="text-base-content/60">{spec.label}:</span>{' '}
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="card-actions justify-between items-center mt-auto">
              <span className="text-primary font-bold text-xl">
                {formatPrice(product.price.amount, product.price.currency_code)}
              </span>
              
              <button className="btn btn-primary btn-sm">Add to Cart</button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group h-full">
      <Link href={`/products/${product.handle}`} className="block h-full">
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
          <figure className="relative aspect-square overflow-hidden bg-gray-100">
            {product.availability === 'in-stock' ? (
              <div className="absolute top-3 right-3 z-10 badge badge-success">
                In Stock
              </div>
            ) : (
              <div className="absolute top-3 right-3 z-10 badge badge-error">
                Out of Stock
              </div>
            )}

            {product.thumbnail && (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/placeholder-camera.svg'
                }}
              />
            )}
          </figure>

          <div className="card-body p-4 flex flex-col flex-grow">
            <h3 className="font-medium text-sm lg:text-base text-base-content line-clamp-2 min-h-[2.5rem]">
              {product.title}
            </h3>
            
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-primary font-bold text-lg">
                {formatPrice(product.price.amount, product.price.currency_code)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}