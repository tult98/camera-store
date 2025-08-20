"use client"

import { HttpTypes } from "@medusajs/types"
import { XMarkIcon, ScaleIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { useState } from "react"
import ComparisonModal from "./comparison-modal"

interface ComparisonBarProps {
  selectedProducts: HttpTypes.StoreProduct[]
  onRemoveProduct: (productId: string) => void
  onClearAll: () => void
  maxComparisons?: number
}

export default function ComparisonBar({
  selectedProducts,
  onRemoveProduct,
  onClearAll,
  maxComparisons = 4,
}: ComparisonBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (selectedProducts.length === 0) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 shadow-lg z-40 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <ScaleIcon className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  Compare ({selectedProducts.length}/{maxComparisons})
                </span>
              </div>
              
              <div className="flex gap-2 flex-1 min-w-0 overflow-x-auto">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative flex-shrink-0 group"
                  >
                    <div className="w-12 h-12 bg-base-200 rounded-lg overflow-hidden">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title || "Product"}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-base-300"></div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveProduct(product.id!)}
                      className="absolute -top-1 -right-1 btn btn-xs btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from comparison"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClearAll}
                className="btn btn-ghost btn-sm"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={selectedProducts.length < 2}
                className="btn btn-primary btn-sm"
              >
                Compare ({selectedProducts.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <ComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={selectedProducts}
        onRemoveProduct={onRemoveProduct}
      />
    </>
  )
}