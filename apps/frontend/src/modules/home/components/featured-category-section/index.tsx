import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { HttpTypes } from "@medusajs/types"
import CategoryProductCard from "@modules/store/components/category-product-card"
import Image from "next/image"
import Link from "next/link"

interface FeaturedCategorySectionProps {
  title: string
  heroImage: string
  products: HttpTypes.StoreProduct[]
  categoryLink: string
}

export default function FeaturedCategorySection({
  title,
  heroImage,
  products,
  categoryLink,
}: FeaturedCategorySectionProps) {
  return (
    <section className="mb-16">
      {/* Category Hero Banner */}
      <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden mb-8">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-between p-8 lg:p-12">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-5xl font-bold text-white uppercase tracking-wide drop-shadow-lg">
              {title}
            </h2>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={categoryLink}
              className="btn btn-primary btn-outline rounded-full bg-white font-semibold transition-all duration-200 hover:shadow-lg hover:text-primary hover:scale-105"
            >
              View More
              <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <CategoryProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
