import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { HttpTypes } from "@medusajs/types"
import { BreadcrumbItem } from "./index"
import {
  generateProductBreadcrumbs,
  generateCategoryBreadcrumbs,
  generateCollectionBreadcrumbs,
  generateSearchBreadcrumbs,
  generateAccountBreadcrumbs,
  generateCheckoutBreadcrumbs,
  generatePathBreadcrumbs
} from "./utils"

type BreadcrumbContext = 
  | { type: 'product'; product: HttpTypes.StoreProduct }
  | { type: 'category'; categoryName: string; categoryHandle: string; parentCategories?: Array<{ name: string; handle: string }> }
  | { type: 'collection'; collection: HttpTypes.StoreCollection }
  | { type: 'search'; query?: string; categoryFilter?: string; resultsCount?: number }
  | { type: 'account'; currentPage: string; pageTitle?: string }
  | { type: 'checkout'; currentStep: "information" | "shipping" | "payment" | "confirmation" }
  | { type: 'custom'; items: BreadcrumbItem[] }
  | { type: 'auto'; customTitles?: Record<string, string> }

interface UseBreadcrumbsOptions {
  loading?: boolean
  maxItems?: number
  variant?: "default" | "compact" | "minimal"
  showHome?: boolean
}

export const useBreadcrumbs = (
  context?: BreadcrumbContext,
  options: UseBreadcrumbsOptions = {}
) => {
  const pathname = usePathname()

  const breadcrumbItems = useMemo(() => {
    if (!context) {
      // Auto-generate from pathname if no context provided
      return generatePathBreadcrumbs(pathname)
    }

    switch (context.type) {
      case 'product':
        return generateProductBreadcrumbs(context.product)
      
      case 'category':
        return generateCategoryBreadcrumbs(
          context.categoryName,
          context.categoryHandle,
          context.parentCategories
        )
      
      case 'collection':
        return generateCollectionBreadcrumbs(context.collection)
      
      case 'search':
        return generateSearchBreadcrumbs(
          context.query,
          context.categoryFilter,
          context.resultsCount
        )
      
      case 'account':
        return generateAccountBreadcrumbs(
          context.currentPage,
          context.pageTitle
        )
      
      case 'checkout':
        return generateCheckoutBreadcrumbs(context.currentStep)
      
      case 'custom':
        return context.items
      
      case 'auto':
        return generatePathBreadcrumbs(pathname, context.customTitles)
      
      default:
        return []
    }
  }, [context, pathname])

  const breadcrumbProps = useMemo(() => ({
    items: breadcrumbItems,
    loading: options.loading || false,
    maxItems: options.maxItems,
    variant: options.variant || "default" as const,
    showHome: options.showHome ?? true
  }), [breadcrumbItems, options])

  return {
    breadcrumbItems,
    breadcrumbProps,
    // Helper to check if we're on a specific page type
    isProductPage: pathname.startsWith('/products/'),
    isCategoryPage: pathname.startsWith('/categories/'),
    isCollectionPage: pathname.startsWith('/collections/'),
    isAccountPage: pathname.startsWith('/account/'),
    isCheckoutPage: pathname.startsWith('/checkout/'),
    isSearchPage: pathname.includes('/search') || pathname.includes('?q=')
  }
}

// Convenience hooks for specific page types
export const useProductBreadcrumbs = (product: HttpTypes.StoreProduct, options: UseBreadcrumbsOptions = {}) => {
  return useBreadcrumbs({ type: 'product', product }, options)
}

export const useCategoryBreadcrumbs = (
  categoryName: string,
  categoryHandle: string,
  parentCategories?: Array<{ name: string; handle: string }>,
  options: UseBreadcrumbsOptions = {}
) => {
  return useBreadcrumbs({ type: 'category', categoryName, categoryHandle, parentCategories }, options)
}

export const useCollectionBreadcrumbs = (collection: HttpTypes.StoreCollection, options: UseBreadcrumbsOptions = {}) => {
  return useBreadcrumbs({ type: 'collection', collection }, options)
}

export const useSearchBreadcrumbs = (
  query?: string,
  categoryFilter?: string,
  resultsCount?: number,
  options: UseBreadcrumbsOptions = {}
) => {
  return useBreadcrumbs({ type: 'search', query, categoryFilter, resultsCount }, options)
}

export const useAccountBreadcrumbs = (currentPage: string, pageTitle?: string, options: UseBreadcrumbsOptions = {}) => {
  return useBreadcrumbs({ type: 'account', currentPage, pageTitle }, options)
}

export const useCheckoutBreadcrumbs = (
  currentStep: "information" | "shipping" | "payment" | "confirmation",
  options: UseBreadcrumbsOptions = {}
) => {
  return useBreadcrumbs({ type: 'checkout', currentStep }, options)
}