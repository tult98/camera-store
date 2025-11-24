import { Category } from "@modules/shared/types/category"
import Image from "next/image"
import Link from "next/link"

interface ShopByCategoryProps {
  categories: Category[]
}

const ShopByCategory = ({ categories }: ShopByCategoryProps) => {
  if (!categories || categories.length === 0) return null

  return (
    <section className="content-container py-16 lg:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          Shop by{" "}
          <span className="font-serif italic text-primary">Category</span>
        </h2>
        <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
          Explore our curated collection of premium camera equipment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {categories.map((category) => {
          return (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group relative overflow-hidden rounded-2xl h-[320px] lg:h-[380px] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-base-200">
                {category.metadata?.hero_image_url && (
                  <Image
                    src={category.metadata.hero_image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

              <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-white/0 group-hover:border-white/30 transition-all duration-500 rounded-xl pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1 translate-y-1" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1 translate-y-1" />
              </div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                  <h3 className="font-serif font-bold text-white mb-2 leading-tight text-2xl lg:text-3xl">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="text-white/90 line-clamp-2 mb-4 text-sm lg:text-base">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all duration-300">
                    <span className="font-semibold text-sm uppercase tracking-wider">
                      Explore
                    </span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default ShopByCategory
