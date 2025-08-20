"use client"

import { HttpTypes } from "@medusajs/types"
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useEffect } from "react"

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  products: HttpTypes.StoreProduct[]
  onRemoveProduct: (productId: string) => void
}

export default function ComparisonModal({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
}: ComparisonModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const comparisonData = getComparisonData(products)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <h2 className="text-2xl font-bold">Compare Products</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 gap-0">
            {/* Product Headers */}
            <div className="grid gap-4 p-6 border-b border-base-300 min-w-fit" 
                 style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
              <div></div>
              {products.map((product) => (
                <div key={product.id} className="text-center space-y-4 min-w-[200px]">
                  <div className="relative">
                    <LocalizedClientLink href={`/products/${product.handle}`}>
                      <div className="w-full aspect-square bg-base-200 rounded-lg overflow-hidden">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.title || "Product"}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-base-300"></div>
                        )}
                      </div>
                    </LocalizedClientLink>
                    <button
                      onClick={() => onRemoveProduct(product.id!)}
                      className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                      title="Remove from comparison"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <LocalizedClientLink href={`/products/${product.handle}`}>
                    <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </LocalizedClientLink>
                  
                  <div className="text-lg font-semibold">
                    {getProductPrice({ product }).cheapestPrice?.calculated_price_incl_tax}
                  </div>
                  
                  <button className="btn btn-primary btn-sm w-full">
                    <ShoppingCartIcon className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="divide-y divide-base-300">
              {comparisonData.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid gap-4 p-4 ${index % 2 === 0 ? "bg-base-50" : "bg-base-100"} min-w-fit`}
                  style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
                >
                  <div className="font-medium text-base-content/80 py-2">
                    {row.label}
                  </div>
                  {row.values.map((value, productIndex) => (
                    <div key={productIndex} className="text-center py-2 min-w-[200px]">
                      {value || "—"}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getComparisonData(products: HttpTypes.StoreProduct[]) {
  const rows = [
    {
      label: "Brand",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.brand || extractBrandFromTitle(p.title)
      })
    },
    {
      label: "Sensor Size",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.sensor_size
      })
    },
    {
      label: "Megapixels",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.megapixels ? `${metadata.megapixels}MP` : null
      })
    },
    {
      label: "Video Capability",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.video_capability
      })
    },
    {
      label: "Mount Type",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.mount_type
      })
    },
    {
      label: "Focal Length",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.focal_length ? `${metadata.focal_length}mm` : null
      })
    },
    {
      label: "Max Aperture",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.max_aperture ? `f/${metadata.max_aperture}` : null
      })
    },
    {
      label: "Lens Type",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.lens_type
      })
    },
    {
      label: "Image Stabilization",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.image_stabilization ? "Yes" : "No"
      })
    },
    {
      label: "Weight",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        return metadata?.weight ? `${metadata.weight}g` : null
      })
    },
    {
      label: "Dimensions",
      values: products.map(p => {
        const metadata = p.metadata as Record<string, any>
        if (metadata?.dimensions) {
          return metadata.dimensions
        }
        if (metadata?.width && metadata?.height && metadata?.depth) {
          return `${metadata.width} × ${metadata.height} × ${metadata.depth}mm`
        }
        return null
      })
    },
    {
      label: "Availability",
      values: products.map(p => {
        if (!p.variants || p.variants.length === 0) return "Out of Stock"
        const variant = p.variants[0]
        if (!variant.manage_inventory) return "In Stock"
        const inventory = variant.inventory_quantity || 0
        if (inventory > 10) return "In Stock"
        if (inventory > 0) return "Limited Stock"
        return "Out of Stock"
      })
    }
  ]

  return rows.filter(row => row.values.some(value => value))
}

function extractBrandFromTitle(title?: string): string | null {
  if (!title) return null
  
  const brands = ["Canon", "Nikon", "Sony", "Fujifilm", "Olympus", "Panasonic", "Leica", "Pentax"]
  const titleUpper = title.toUpperCase()
  
  for (const brand of brands) {
    if (titleUpper.includes(brand.toUpperCase())) {
      return brand
    }
  }
  
  return null
}