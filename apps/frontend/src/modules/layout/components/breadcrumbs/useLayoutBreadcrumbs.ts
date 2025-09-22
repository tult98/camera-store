"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo } from "react"
import { useBreadcrumbContext } from "../breadcrumb-provider"
import { BreadcrumbItem } from "./index"
import {
  generateCategoryBreadcrumbs,
  generateCheckoutBreadcrumbs,
  generatePathBreadcrumbs,
  generateProductBreadcrumbs
} from "./utils"

type BreadcrumbContext =
  | { type: "product"; product: HttpTypes.StoreProduct }
  | {
      type: "category"
      categoryName: string
      categoryHandle: string
      parentCategories?: Array<{ name: string; handle: string }>
    }
  | {
      type: "checkout"
      currentStep: "cart" | "shipping-address" | "review" | "success"
    }
  | { type: "custom"; items: BreadcrumbItem[] }
  | { type: "auto"; customTitles?: Record<string, string> }

interface UseLayoutBreadcrumbsOptions {
  loading?: boolean
  variant?: "default" | "compact" | "minimal"
  showHome?: boolean
  maxItems?: number
}

/**
 * Hook to set breadcrumbs in the layout context
 * This replaces individual page-level breadcrumb rendering
 */
export const useLayoutBreadcrumbs = (
  context?: BreadcrumbContext,
  options: UseLayoutBreadcrumbsOptions = {}
) => {
  const pathname = usePathname()
  const breadcrumbContext = useBreadcrumbContext()

  useEffect(() => {
    // Set loading state
    if (options.loading !== undefined) {
      breadcrumbContext.setLoading(options.loading)
    }

    // Set variant if provided
    if (options.variant) {
      breadcrumbContext.setVariant(options.variant)
    }

    // Set showHome if provided
    if (options.showHome !== undefined) {
      breadcrumbContext.setShowHome(options.showHome)
    }

    // Set maxItems if provided
    if (options.maxItems !== undefined) {
      breadcrumbContext.setMaxItems(options.maxItems)
    }
  }, [options.loading, options.variant, options.showHome, options.maxItems])

  useEffect(() => {
    // Generate breadcrumb items
    let items: BreadcrumbItem[] = []

    if (!context) {
      // Auto-generate from pathname if no context provided
      items = generatePathBreadcrumbs(pathname)
    } else {
      switch (context.type) {
        case "product":
          items = generateProductBreadcrumbs(context.product)
          break

        case "category":
          items = generateCategoryBreadcrumbs(
            context.categoryName,
            context.categoryHandle,
            context.parentCategories
          )
          break

        case "checkout":
          items = generateCheckoutBreadcrumbs(context.currentStep)
          break

        case "custom":
          items = context.items
          break

        case "auto":
          items = generatePathBreadcrumbs(pathname, context.customTitles)
          break

        default:
          items = []
      }
    }

    // Set the breadcrumb items in the context
    breadcrumbContext.setItems(items)
  }, [context, pathname])

  // Memoize helper functions to prevent infinite re-renders
  const clearBreadcrumbs = useCallback(() => {
    breadcrumbContext.setItems([])
  }, [breadcrumbContext.setItems])

  const setBreadcrumbs = useCallback(
    (items: BreadcrumbItem[]) => {
      breadcrumbContext.setItems(items)
    },
    [breadcrumbContext.setItems]
  )

  const setLoadingHelper = useCallback(
    (loading: boolean) => {
      breadcrumbContext.setLoading(loading)
    },
    [breadcrumbContext.setLoading]
  )

  const setVariantHelper = useCallback(
    (variant: "default" | "compact" | "minimal") => {
      breadcrumbContext.setVariant(variant)
    },
    [breadcrumbContext.setVariant]
  )

  // Return helper to clear breadcrumbs (useful for pages that shouldn't show them)
  return {
    clearBreadcrumbs,
    setBreadcrumbs,
    setLoading: setLoadingHelper,
    setVariant: setVariantHelper,
  }
}

// Convenience hooks for specific page types
export const useProductBreadcrumbs = (
  product: HttpTypes.StoreProduct,
  options: UseLayoutBreadcrumbsOptions = {}
) => {
  const context = useMemo(
    () => ({ type: "product" as const, product }),
    [product]
  )
  const memoizedOptions = useMemo(
    () => options,
    [options.loading, options.variant, options.showHome, options.maxItems]
  )
  return useLayoutBreadcrumbs(context, memoizedOptions)
}

export const useCategoryBreadcrumbs = (
  categoryName: string,
  categoryHandle: string,
  parentCategories?: Array<{ name: string; handle: string }>,
  options: UseLayoutBreadcrumbsOptions = {}
) => {
  const context = useMemo(
    () => ({
      type: "category" as const,
      categoryName,
      categoryHandle,
      parentCategories,
    }),
    [categoryName, categoryHandle, parentCategories]
  )
  const memoizedOptions = useMemo(
    () => options,
    [options.loading, options.variant, options.showHome, options.maxItems]
  )
  return useLayoutBreadcrumbs(context, memoizedOptions)
}

export const useCheckoutBreadcrumbs = (
  currentStep: "cart" | "shipping-address" | "review" | "success",
  options: UseLayoutBreadcrumbsOptions = {}
) => {
  const context = useMemo(
    () => ({
      type: "checkout" as const,
      currentStep,
    }),
    [currentStep]
  )
  const memoizedOptions = useMemo(
    () => options,
    [options.loading, options.variant, options.showHome, options.maxItems]
  )
  return useLayoutBreadcrumbs(context, memoizedOptions)
}
