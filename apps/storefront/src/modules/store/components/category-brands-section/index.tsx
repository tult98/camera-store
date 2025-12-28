"use client"

import { Brand } from "@camera-store/shared-types"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"
import Image from "next/image"

interface CategoryBrandsSectionProps {
  brands: Brand[]
}

export default function CategoryBrandsSection({
  brands,
}: CategoryBrandsSectionProps) {
  const { brandFilter, setBrandFilter, clearBrandFilter } =
    useCategoryFilterStore()

  const brandsWithImages = brands.filter((brand) => brand.image_url)

  if (!brandsWithImages || brandsWithImages.length === 0) {
    return null
  }

  const handleBrandClick = (brandId: string) => {
    if (brandFilter === brandId) {
      clearBrandFilter()
    } else {
      setBrandFilter(brandId)
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Brands</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
        {brandsWithImages.map((brand) => (
          <button
            key={brand.id}
            onClick={() => handleBrandClick(brand.id)}
            className={`flex-shrink-0 w-24 h-24 rounded-lg border-2 transition-all hover:shadow-lg ${
              brandFilter === brand.id
                ? "border-primary bg-primary/10"
                : "border-base-300 bg-base-100 hover:border-primary/50"
            }`}
            aria-label={`Filter by ${brand.name}`}
          >
            <div className="flex items-center justify-center h-full p-2">
              <div className="relative w-full h-full">
                <Image
                  src={brand.image_url!}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
