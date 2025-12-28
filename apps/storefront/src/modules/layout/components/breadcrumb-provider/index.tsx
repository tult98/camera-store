"use client"

import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react'
import { BreadcrumbItem } from "../breadcrumbs/index"

interface BreadcrumbContextType {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  variant: "default" | "compact" | "minimal"
  setVariant: (variant: "default" | "compact" | "minimal") => void
  showHome: boolean
  setShowHome: (showHome: boolean) => void
  maxItems?: number
  setMaxItems: (maxItems?: number) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext)
  if (context === undefined) {
    throw new Error('useBreadcrumbContext must be used within a BreadcrumbProvider')
  }
  return context
}

interface BreadcrumbProviderProps {
  children: ReactNode
  defaultVariant?: "default" | "compact" | "minimal"
  defaultShowHome?: boolean
  defaultMaxItems?: number
}

export const BreadcrumbProvider = ({
  children,
  defaultVariant = "default",
  defaultShowHome = true,
  defaultMaxItems
}: BreadcrumbProviderProps) => {
  const [items, setItemsState] = useState<BreadcrumbItem[]>([])
  const [loading, setLoadingState] = useState(false)
  const [variant, setVariantState] = useState<"default" | "compact" | "minimal">(defaultVariant)
  const [showHome, setShowHomeState] = useState(defaultShowHome)
  const [maxItems, setMaxItemsState] = useState<number | undefined>(defaultMaxItems)

  const setItems = useCallback((items: BreadcrumbItem[]) => {
    setItemsState(items)
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setLoadingState(loading)
  }, [])

  const setVariant = useCallback((variant: "default" | "compact" | "minimal") => {
    setVariantState(variant)
  }, [])

  const setShowHome = useCallback((showHome: boolean) => {
    setShowHomeState(showHome)
  }, [])

  const setMaxItems = useCallback((maxItems?: number) => {
    setMaxItemsState(maxItems)
  }, [])

  const contextValue = useMemo(() => ({
    items,
    setItems,
    loading,
    setLoading,
    variant,
    setVariant,
    showHome,
    setShowHome,
    maxItems,
    setMaxItems
  }), [
    items,
    setItems,
    loading,
    setLoading,
    variant,
    setVariant,
    showHome,
    setShowHome,
    maxItems,
    setMaxItems
  ])

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {children}
    </BreadcrumbContext.Provider>
  )
}