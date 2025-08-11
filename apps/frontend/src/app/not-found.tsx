import { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import StoreNavigation from "@modules/layout/components/store-navigation"
import StoreFooter from "@modules/layout/components/store-footer"
import { RegionProvider } from "@lib/context/region-context"

export const metadata: Metadata = {
  title: "404 - Page Not Found | PHCameras",
  description: "The page you're looking for doesn't exist. Return to our homepage to explore our camera collection.",
}

export default function NotFound() {
  return (
    <RegionProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <StoreNavigation />
        
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-6xl font-semibold text-blue-500 mb-8">404</h1>
            </div>

            {/* Error Text */}
            <div className="mb-12">
              <h2 className="text-4xl font-semibold text-gray-900 mb-6">
                Page not found
              </h2>
              <p className="text-xl text-gray-500">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Go back home
              </Link>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium inline-flex items-center transition-colors"
              >
                Contact support
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
        
        <StoreFooter />
      </div>
    </RegionProvider>
  )
}
