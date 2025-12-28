import { HttpTypes } from "@medusajs/types"
import { BreadcrumbItem } from "./index"

/**
 * Generate breadcrumbs for a product page
 */
export const generateProductBreadcrumbs = (
  product: HttpTypes.StoreProduct
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = []

  // Add category breadcrumbs if available
  if (product.categories && product.categories.length > 0) {
    // Get the primary category (first one)
    const primaryCategory = product.categories[0]
    
    // Add parent categories if they exist (assuming nested structure)
    if (primaryCategory.parent_category && 
        primaryCategory.parent_category.name && 
        primaryCategory.parent_category.handle) {
      breadcrumbs.push({
        title: primaryCategory.parent_category.name,
        href: `/categories/${primaryCategory.parent_category.handle}`
      })
    }
    
    breadcrumbs.push({
      title: primaryCategory.name,
      href: `/categories/${primaryCategory.handle}`
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
  _categoryHandle: string,
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
 * Generate breadcrumbs for checkout flow
 */
export const generateCheckoutBreadcrumbs = (
  currentStep: "cart" | "shipping-address" | "review" | "success"
): BreadcrumbItem[] => {
  const steps = [
    { key: "cart", title: "Cart", href: "/checkout?step=cart" },
    { key: "shipping-address", title: "Shipping", href: "/checkout?step=shipping-address" },
    { key: "review", title: "Review", href: "/checkout?step=review" },
    { key: "success", title: "Complete", href: undefined }
  ]

  return steps
    .slice(0, steps.findIndex(s => s.key === currentStep) + 1)
    .map((step, index, arr) => ({
      title: step.title,
      href: index === arr.length - 1 ? undefined : step.href,
      isActive: index === arr.length - 1
    }))
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

