import { HttpTypes } from "@medusajs/types"
import { BreadcrumbItem } from "./index"

export interface BreadcrumbConfig {
  includeHome?: boolean
  maxItems?: number
  variant?: "default" | "compact" | "minimal"
}

/**
 * Generate breadcrumbs for a product page
 */
export const generateProductBreadcrumbs = (
  product: HttpTypes.StoreProduct,
  config: BreadcrumbConfig = {}
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = []

  // Add category breadcrumbs if available
  if (product.categories && product.categories.length > 0) {
    // Get the primary category (first one)
    const primaryCategory = product.categories[0]
    
    // Add parent categories if they exist (assuming nested structure)
    if (primaryCategory.parent_category) {
      breadcrumbs.push({
        title: primaryCategory.parent_category.name,
        href: `/categories/${primaryCategory.parent_category.handle}`
      })
    }
    
    breadcrumbs.push({
      title: primaryCategory.name,
      href: `/categories/${primaryCategory.handle}`
    })
  } else if (product.collection) {
    // Fallback to collection if no categories
    breadcrumbs.push({
      title: product.collection.title,
      href: `/collections/${product.collection.handle}`
    })
  }

  // Add the current product (no href as it's the current page)
  breadcrumbs.push({
    title: product.title,
    isActive: true
  })

  return breadcrumbs
}

/**
 * Generate breadcrumbs for a category page
 */
export const generateCategoryBreadcrumbs = (
  categoryName: string,
  categoryHandle: string,
  parentCategories: Array<{ name: string; handle: string }> = []
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = []

  // Add parent categories
  parentCategories.forEach((parent) => {
    breadcrumbs.push({
      title: parent.name,
      href: `/categories/${parent.handle}`
    })
  })

  // Add current category (no href as it's the current page)
  breadcrumbs.push({
    title: categoryName,
    isActive: true
  })

  return breadcrumbs
}

/**
 * Generate breadcrumbs for a collection page
 */
export const generateCollectionBreadcrumbs = (
  collection: HttpTypes.StoreCollection
): BreadcrumbItem[] => {
  return [
    {
      title: "Collections",
      href: "/collections"
    },
    {
      title: collection.title,
      isActive: true
    }
  ]
}

/**
 * Generate breadcrumbs for search results
 */
export const generateSearchBreadcrumbs = (
  query?: string,
  categoryFilter?: string,
  resultsCount?: number
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = []

  if (categoryFilter) {
    breadcrumbs.push({
      title: categoryFilter,
      href: `/categories/${categoryFilter.toLowerCase().replace(/\s+/g, '-')}`
    })
  }

  if (query) {
    breadcrumbs.push({
      title: `Search: "${query}"${resultsCount !== undefined ? ` (${resultsCount})` : ''}`,
      isActive: true
    })
  } else {
    breadcrumbs.push({
      title: "Search Results",
      isActive: true
    })
  }

  return breadcrumbs
}

/**
 * Generate breadcrumbs for account pages
 */
export const generateAccountBreadcrumbs = (
  currentPage: string,
  pageTitle?: string
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Account",
      href: "/account"
    }
  ]

  if (currentPage !== "dashboard") {
    breadcrumbs.push({
      title: pageTitle || currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
      isActive: true
    })
  } else {
    breadcrumbs[0].isActive = true
  }

  return breadcrumbs
}

/**
 * Generate breadcrumbs for checkout flow
 */
export const generateCheckoutBreadcrumbs = (
  currentStep: "information" | "shipping" | "payment" | "confirmation"
): BreadcrumbItem[] => {
  const steps = [
    { key: "information", title: "Information", href: "/checkout" },
    { key: "shipping", title: "Shipping", href: "/checkout/shipping" },
    { key: "payment", title: "Payment", href: "/checkout/payment" },
    { key: "confirmation", title: "Confirmation" }
  ]

  return [
    {
      title: "Cart",
      href: "/cart"
    },
    ...steps.map((step, index) => ({
      title: step.title,
      href: step.key === currentStep ? undefined : step.href,
      isActive: step.key === currentStep
    }))
  ]
}

/**
 * Generate generic breadcrumbs from a path
 */
export const generatePathBreadcrumbs = (
  pathname: string,
  customTitles: Record<string, string> = {}
): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const title = customTitles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    
    breadcrumbs.push({
      title,
      href: index === segments.length - 1 ? undefined : href,
      isActive: index === segments.length - 1
    })
  })

  return breadcrumbs
}

/**
 * Utility to format category name for display
 */
export const formatCategoryName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}