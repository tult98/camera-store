"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct & {
    product_attributes?: Array<{
      attribute_name: string
      value: unknown
    }>
  }
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description")

  // Extract technical specifications from product_attributes
  const getTechnicalSpecs = () => {
    if (!product.product_attributes || product.product_attributes.length === 0)
      return null

    const specs = product.product_attributes.map((attr) => ({
      label: attr.attribute_name,
      value: attr.value,
    }))

    return specs.length > 0 ? specs : null
  }

  const technicalSpecs = getTechnicalSpecs()
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
          DESCRIPTION
        </button>
        <button
          className={`px-6 py-3 text-sm font-bold transition-colors cursor-pointer ${
            activeTab === "specs"
              ? "text-base-content border-b-2 border-base-content"
              : "text-base-content/50 hover:text-base-content/80"
          }`}
          onClick={() => setActiveTab("specs")}
        >
          TECHNICAL SPECIFICATIONS ({specsCount})
        </button>
      </div>

      <div className="w-full">
        {activeTab === "description" && (
          <div className="prose prose-lg max-w-none w-full">
            {product.description ? (
              <div
                className="text-base-content/80 leading-relaxed w-full"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            ) : (
              <div className="text-base-content/60 text-center py-8 w-full">
                <p>No product description available.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" && (
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
                          {spec.value === true ? (
                            <CheckCircleIcon className="w-5 h-5 text-success" />
                          ) : spec.value === false ? (
                            <XCircleIcon className="w-5 h-5 text-error" />
                          ) : (
                            (spec.value as string)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-base-content/60 text-center py-8 w-full">
                <p>No detailed specifications available.</p>
                <p className="text-sm mt-2">
                  Information will be updated soon.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductTabs
