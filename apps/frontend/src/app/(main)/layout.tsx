import { Metadata } from "next"
import StoreNavigation from "@modules/layout/components/store-navigation"
import StoreFooter from "@modules/layout/components/store-footer"
import { RegionProvider } from "@lib/context/region-context"

import { getBaseURL } from "@lib/util/env"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <RegionProvider>
      <div className="min-h-screen bg-base-100 flex flex-col">
        <StoreNavigation />
        <main className="flex-1 content-container">{props.children}</main>
        <StoreFooter />
      </div>
    </RegionProvider>
  )
}
