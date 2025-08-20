"use client"

import { HttpTypes } from "@medusajs/types"
import { useState, useCallback, useEffect } from "react"
import ComparisonBar from "./comparison-bar"

interface ProductComparisonProviderProps {
  children: React.ReactNode
  maxComparisons?: number
}

export interface ComparisonContextType {
  selectedProducts: HttpTypes.StoreProduct[]
  addProduct: (product: HttpTypes.StoreProduct) => void
  removeProduct: (productId: string) => void
  clearAll: () => void
  isSelected: (productId: string) => boolean
  canAddMore: boolean
  count: number
}

export function ProductComparisonProvider({
  children,
  maxComparisons = 4,
}: ProductComparisonProviderProps) {
  const [selectedProducts, setSelectedProducts] = useState<HttpTypes.StoreProduct[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('product-comparison')
    if (saved) {
      try {
        const products = JSON.parse(saved)
        setSelectedProducts(products)
      } catch (error) {
        console.error('Failed to load comparison products from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('product-comparison', JSON.stringify(selectedProducts))
  }, [selectedProducts])

  const addProduct = useCallback((product: HttpTypes.StoreProduct) => {
    setSelectedProducts(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev
      }
      if (prev.length >= maxComparisons) {
        return prev
      }
      return [...prev, product]
    })
  }, [maxComparisons])

  const removeProduct = useCallback((productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId))
  }, [])

  const clearAll = useCallback(() => {
    setSelectedProducts([])
  }, [])

  const isSelected = useCallback((productId: string) => {
    return selectedProducts.some(p => p.id === productId)
  }, [selectedProducts])

  const toggleProduct = useCallback((product: HttpTypes.StoreProduct) => {
    if (isSelected(product.id!)) {
      removeProduct(product.id!)
    } else {
      addProduct(product)
    }
  }, [isSelected, removeProduct, addProduct])

  const contextValue: ComparisonContextType = {
    selectedProducts,
    addProduct,
    removeProduct,
    clearAll,
    isSelected,
    canAddMore: selectedProducts.length < maxComparisons,
    count: selectedProducts.length,
  }

  return (
    <>
      <ComparisonContext.Provider value={contextValue}>
        {children}
      </ComparisonContext.Provider>
      
      <ComparisonBar
        selectedProducts={selectedProducts}
        onRemoveProduct={removeProduct}
        onClearAll={clearAll}
        maxComparisons={maxComparisons}
      />
    </>
  )
}

import { createContext, useContext } from "react"

const ComparisonContext = createContext<ComparisonContextType | null>(null)

export function useProductComparison() {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useProductComparison must be used within a ProductComparisonProvider')
  }
  return context
}

export { ComparisonBar }