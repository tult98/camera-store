"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import ProductGrid, { type ViewMode } from "../product-grid"

interface ProductGridClientProps {
  products: HttpTypes.StoreProduct[]
}

export default function ProductGridClient({
  products,
}: ProductGridClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  return (
    <ProductGrid
      products={products}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    />
  )
}
