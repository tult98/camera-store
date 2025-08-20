"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import ProductGrid, { ViewMode } from "../product-grid"
import { useProductComparison } from "../product-comparison"

interface ProductGridWrapperProps {
  products: HttpTypes.StoreProduct[]
  isLoading?: boolean
}

export default function ProductGridWrapper({ 
  products, 
  isLoading = false 
}: ProductGridWrapperProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const comparison = useProductComparison()

  const handleToggleComparison = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    if (comparison.isSelected(productId)) {
      comparison.removeProduct(productId)
    } else {
      comparison.addProduct(product)
    }
  }

  return (
    <ProductGrid
      products={products}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      selectedForComparison={comparison.selectedProducts.map(p => p.id!)}
      onToggleComparison={handleToggleComparison}
      maxComparisons={4}
    />
  )
}