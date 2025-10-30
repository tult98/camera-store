"use client"

import { HttpTypes } from "@medusajs/types"
import { CameraIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"

interface CategorySubcategoriesSectionProps {
  subcategories: HttpTypes.StoreProductCategory[]
}

export default function CategorySubcategoriesSection({
  subcategories
}: CategorySubcategoriesSectionProps) {
  if (!subcategories || subcategories.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/categories/${subcategory.handle}`}
            className="flex-shrink-0 flex flex-col items-center pb-2 rounded-lg border-2 border-base-300 bg-base-100 hover:border-primary hover:shadow-lg transition-all w-32"
          >
            <div className="w-full aspect-square relative mb-3 flex items-center justify-center bg-base-200 overflow-hidden">
              {subcategory.metadata?.image_url ? (
                <Image
                  src={subcategory.metadata.image_url as string}
                  alt={subcategory.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <CameraIcon className="w-12 h-12 text-base-content/40" />
              )}
            </div>
            <p className="text-sm font-medium text-center text-base-content line-clamp-2">
              {subcategory.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
