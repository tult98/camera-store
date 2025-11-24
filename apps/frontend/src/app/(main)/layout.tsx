import { RegionProvider } from "@lib/context/region-context"
import { QueryProvider } from "@lib/providers/query-provider"
import { ToastProvider } from "@lib/providers/toast-provider"
import { BreadcrumbProvider } from "@modules/layout/components/breadcrumb-provider"
import StoreFooter from "@modules/layout/components/store-footer"
import StoreHeader from "@modules/layout/components/store-header"
import StoreNavigation from "@modules/layout/components/store-navigation"
import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <RegionProvider>
        <ToastProvider>
          <BreadcrumbProvider>
            <div className="min-h-screen bg-neutral-50 flex flex-col">
              <StoreHeader />
              <StoreNavigation />
              <main className="flex-1 content-container">{props.children}</main>
              <StoreFooter />
            </div>
          </BreadcrumbProvider>
        </ToastProvider>
      </RegionProvider>
    </QueryProvider>
  )
}
