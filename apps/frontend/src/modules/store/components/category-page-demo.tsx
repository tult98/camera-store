"use client"

import { useState } from "react"
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"
import { FilterSidebar, FilterDrawer } from "./filters"

interface CategoryPageDemoProps {
  categoryType?: 'cameras' | 'lenses' | 'accessories'
}

export default function CategoryPageDemo({ categoryType = 'cameras' }: CategoryPageDemoProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Mock data for available brands
  const availableBrands = [
    { value: 'canon', label: 'Canon', count: 45 },
    { value: 'nikon', label: 'Nikon', count: 38 },
    { value: 'sony', label: 'Sony', count: 52 },
    { value: 'fujifilm', label: 'Fujifilm', count: 23 },
    { value: 'olympus', label: 'Olympus', count: 18 },
    { value: 'panasonic', label: 'Panasonic', count: 15 }
  ]

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile Header with Filter Button */}
      <div className="lg:hidden bg-base-100 border-b border-base-300 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {categoryType === 'cameras' ? 'Digital Cameras' : 
             categoryType === 'lenses' ? 'Camera Lenses' : 'Accessories'}
          </h1>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="btn btn-primary btn-sm gap-2"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar 
            availableBrands={availableBrands}
            categoryType={categoryType}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4">
          {/* Category Header */}
          <div className="hidden lg:block mb-6">
            <nav className="breadcrumbs text-sm">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/store">Store</a></li>
                <li className="capitalize">{categoryType}</li>
              </ul>
            </nav>
            <h1 className="text-3xl font-bold mt-2 capitalize">
              {categoryType === 'cameras' ? 'Digital Cameras' : 
               categoryType === 'lenses' ? 'Camera Lenses' : 'Accessories'}
            </h1>
            <p className="text-base-content/70 mt-2">
              {categoryType === 'cameras' 
                ? 'Professional cameras for every need and skill level'
                : categoryType === 'lenses' 
                ? 'High-quality lenses for stunning photography'
                : 'Essential accessories for your photography setup'}
            </p>
          </div>

          {/* Subcategory Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {categoryType === 'cameras' ? (
              <>
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-center">DSLR</h3>
                    <p className="text-xs text-center text-base-content/60">Traditional mirrors</p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-center">Mirrorless</h3>
                    <p className="text-xs text-center text-base-content/60">Compact & modern</p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-center">Point & Shoot</h3>
                    <p className="text-xs text-center text-base-content/60">Easy to use</p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-center">Action Cams</h3>
                    <p className="text-xs text-center text-base-content/60">Adventure ready</p>
                  </div>
                </div>
              </>
            ) : categoryType === 'lenses' ? (
              <>
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-center">Prime</h3>
                    <p className="text-xs text-center text-base-content/60">Fixed focal</p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-center">Zoom</h3>
                    <p className="text-xs text-center text-base-content/60">Variable focal</p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-center">Macro</h3>
                    <p className="text-xs text-center text-base-content/60">Close-up shots</p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="card-body p-4">
                    <h3 className="font-semibold text-center">Telephoto</h3>
                    <p className="text-xs text-center text-base-content/60">Long distance</p>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Sort and View Controls */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <select className="select select-bordered select-sm">
                <option>Best Sellers</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Customer Rating</option>
                <option>Name: A to Z</option>
              </select>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-square btn-sm">⊞</button>
                <button className="btn btn-ghost btn-square btn-sm">☰</button>
              </div>
            </div>
            <div className="text-sm text-base-content/70">
              Showing 1-24 of 156 products
            </div>
          </div>

          {/* Product Grid Placeholder */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-sm">
                <div className="skeleton h-48 w-full"></div>
                <div className="card-body p-4">
                  <div className="skeleton h-4 w-full mb-2"></div>
                  <div className="skeleton h-4 w-3/4 mb-4"></div>
                  <div className="skeleton h-6 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm btn-active">1</button>
              <button className="join-item btn btn-sm">2</button>
              <button className="join-item btn btn-sm">3</button>
              <button className="join-item btn btn-sm">4</button>
              <button className="join-item btn btn-sm">»</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        availableBrands={availableBrands}
        categoryType={categoryType}
      />
    </div>
  )
}