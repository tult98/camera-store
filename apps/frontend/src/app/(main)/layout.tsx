import { Metadata } from "next"
import StoreNavigation from "@modules/layout/components/store-navigation"
import StoreFooter from "@modules/layout/components/store-footer"
import LayoutBreadcrumbs from "@modules/layout/components/layout-breadcrumbs"
import { BreadcrumbProvider } from "@modules/layout/components/breadcrumb-provider"
import { RegionProvider } from "@lib/context/region-context"
import { QueryProvider } from "@lib/providers/query-provider"

import { getBaseURL } from "@lib/util/env"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <RegionProvider>
      <QueryProvider>
        <BreadcrumbProvider>
          <div className="min-h-screen bg-base-100 flex flex-col">
            <StoreNavigation />
            <LayoutBreadcrumbs />
            <main className="flex-1 content-container">{props.children}</main>
            <StoreFooter />
          </div>
        </BreadcrumbProvider>
      </QueryProvider>
    </RegionProvider>
  )
}
