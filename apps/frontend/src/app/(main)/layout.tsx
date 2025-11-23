import { RegionProvider } from "@lib/context/region-context"
import { QueryProvider } from "@lib/providers/query-provider"
import { ToastProvider } from "@lib/providers/toast-provider"
import { BreadcrumbProvider } from "@modules/layout/components/breadcrumb-provider"
import StoreFooter from "@modules/layout/components/store-footer"
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
            <div className="min-h-screen bg-base-100 flex flex-col">
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
