"use client"

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'
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
  const [items, setItems] = useState<BreadcrumbItem[]>([])
  const [loading, setLoading] = useState(false)
  const [variant, setVariant] = useState<"default" | "compact" | "minimal">(defaultVariant)
  const [showHome, setShowHome] = useState(defaultShowHome)
  const [maxItems, setMaxItems] = useState<number | undefined>(defaultMaxItems)

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
    loading,
    variant,
    showHome,
    maxItems
  ])

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {children}
    </BreadcrumbContext.Provider>
  )
}