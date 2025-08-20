"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import ProductGrid, { type ViewMode } from "../product-grid";

interface ProductGridClientProps {
  products: HttpTypes.StoreProduct[]
}

export default function ProductGridClient({ products }: ProductGridClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])

  const handleToggleComparison = (productId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      }
      if (prev.length >= 4) {
        return prev
      }
      return [...prev, productId]
    })
  }

  return (
    <ProductGrid
      products={products}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      selectedForComparison={selectedForComparison}
      onToggleComparison={handleToggleComparison}
      maxComparisons={4}
    />
  )
}