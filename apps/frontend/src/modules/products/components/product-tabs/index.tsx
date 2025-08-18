"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description")

  // Extract technical specifications from metadata
  const getTechnicalSpecs = (metadata?: Record<string, any>) => {
    if (!metadata) return null
    
    const specs = []
    
    // Common camera specifications
    if (metadata['sensor_type']) specs.push({ label: "Loại cảm biến", value: metadata['sensor_type'] })
    if (metadata['megapixels']) specs.push({ label: "Độ phân giải", value: `${metadata['megapixels']} MP` })
    if (metadata['iso_range']) specs.push({ label: "Dải ISO", value: metadata['iso_range'] })
    if (metadata['video_recording']) specs.push({ label: "Quay video", value: metadata['video_recording'] })
    if (metadata['lens_mount']) specs.push({ label: "Ngàm ống kính", value: metadata['lens_mount'] })
    if (metadata['screen_size']) specs.push({ label: "Kích thước màn hình", value: metadata['screen_size'] })
    if (metadata['battery_life']) specs.push({ label: "Thời lượng pin", value: metadata['battery_life'] })
    if (metadata['weight']) specs.push({ label: "Trọng lượng", value: metadata['weight'] })
    if (metadata['dimensions']) specs.push({ label: "Kích thước", value: metadata['dimensions'] })
    if (metadata['connectivity']) specs.push({ label: "Kết nối", value: metadata['connectivity'] })
    if (metadata['storage']) specs.push({ label: "Lưu trữ", value: metadata['storage'] })
    if (metadata['viewfinder']) specs.push({ label: "Kính ngắm", value: metadata['viewfinder'] })
    
    // Fallback to basic product properties if no metadata specs
    if (specs.length === 0) {
      if (product.weight) specs.push({ label: "Trọng lượng", value: `${product.weight} g` })
      if (product.length && product.width && product.height) {
        specs.push({ 
          label: "Kích thước", 
          value: `${product.length}L x ${product.width}W x ${product.height}H` 
        })
      }
      if (product.material) specs.push({ label: "Chất liệu", value: product.material })
      if (product.origin_country) specs.push({ label: "Xuất xứ", value: product.origin_country })
      if (product.type?.value) specs.push({ label: "Loại", value: product.type.value })
    }
    
    return specs.length > 0 ? specs : null
  }

  const technicalSpecs = getTechnicalSpecs(product.metadata || {})
  const specsCount = technicalSpecs ? technicalSpecs.length : 0

  return (
    <div className="w-full">
      <div className="flex gap-0 mb-6 border-b border-base-300">
        <button
          className={`px-6 py-3 text-sm font-bold transition-colors cursor-pointer ${
            activeTab === "description" 
              ? "text-base-content border-b-2 border-base-content" 
              : "text-base-content/50 hover:text-base-content/80"
          }`}
          onClick={() => setActiveTab("description")}
        >
          MÔ TẢ
        </button>
        <button
          className={`px-6 py-3 text-sm font-bold transition-colors cursor-pointer ${
            activeTab === "specs" 
              ? "text-base-content border-b-2 border-base-content" 
              : "text-base-content/50 hover:text-base-content/80"
          }`}
          onClick={() => setActiveTab("specs")}
        >
          THÔNG SỐ KỸ THUẬT ({specsCount})
        </button>
      </div>

      <div className="grid grid-cols-1 min-h-[400px] w-full">
        <div 
          className={`col-start-1 row-start-1 w-full transition-opacity duration-200 ${
            activeTab === "description" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <div className="prose prose-lg max-w-none w-full">
            {product.description ? (
              <div 
                className="text-base-content/80 leading-relaxed w-full"
                dangerouslySetInnerHTML={{ 
                  __html: product.description 
                }}
              />
            ) : (
              <div className="text-base-content/60 text-center py-12 w-full">
                <p>Chưa có mô tả sản phẩm.</p>
              </div>
            )}
          </div>
        </div>

        <div 
          className={`col-start-1 row-start-1 w-full transition-opacity duration-200 ${
            activeTab === "specs" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <div className="w-full">
            {technicalSpecs && technicalSpecs.length > 0 ? (
              <div className="w-full">
                <table className="table table-zebra w-full table-fixed">
                  <tbody>
                    {technicalSpecs.map((spec, index) => (
                      <tr key={index}>
                        <td className="font-semibold text-base-content w-2/5">
                          {spec.label}
                        </td>
                        <td className="text-base-content/80 w-3/5 break-words">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-base-content/60 text-center py-12 w-full">
                <p>Chưa có thông số kỹ thuật chi tiết.</p>
                <p className="text-sm mt-2">Thông tin sẽ được cập nhật sớm.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
