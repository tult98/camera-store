"use client"

import { useBreadcrumbContext } from "../breadcrumb-provider"
import Breadcrumbs from "../breadcrumbs"

const LayoutBreadcrumbs = () => {
  const { items, loading, variant, showHome, maxItems } = useBreadcrumbContext()

  // Don't render if no breadcrumb items are set
  if (!items.length && !loading) {
    return null
  }

  return (
    <Breadcrumbs
      items={items}
      loading={loading}
      variant={variant}
      showHome={showHome}
      maxItems={maxItems}
    />
  )
}

export default LayoutBreadcrumbs