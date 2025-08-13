import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export default async function StorePage(props: Params) {
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  // For single-region store, use Vietnam country code (matching the region)
  const defaultCountryCode = "vn"

  return (
    <StoreTemplate
      {...(sortBy && { sortBy })}
      {...(page && { page })}
      countryCode={defaultCountryCode}
    />
  )
}
