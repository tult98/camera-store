import { Brand } from "@modules/shared/types/brand"
import Image from "next/image"
import Link from "next/link"

interface ShopByBrandProps {
  brands: Brand[]
}

const ShopByBrand = ({ brands }: ShopByBrandProps) => {
  if (!brands || brands.length === 0) return null

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Shop by{" "}
            <span className="font-serif italic text-primary">Brand</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover exceptional craftsmanship from the world&apos;s leading
            camera manufacturers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {brands.map((brand) => {
            return (
              <Link
                key={brand.id}
                href={`/brands/${brand.id}`}
                className="group relative bg-white rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-base-200/30 to-base-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative border-8 border-white transition-all duration-500 group-hover:border-primary/10 h-[140px] md:h-[160px]">
                  <div className="absolute inset-0 p-6 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                      <Image
                        src={brand.image_url}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain transition-all duration-500 p-4"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </div>

                  <div className="absolute inset-0 border border-base-content/5 group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />

                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/40 transition-all duration-500 translate-x-1 -translate-y-1" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/40 transition-all duration-500 -translate-x-1 translate-y-1" />
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <span className="font-semibold text-xs uppercase tracking-widest">
                      Explore {brand.name}
                    </span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
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
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ShopByBrand
