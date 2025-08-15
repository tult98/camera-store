// Addresses page temporarily disabled - not implemented yet
// Force dynamic rendering
export const dynamic = 'force-dynamic'
// import { Metadata } from "next"
// import { notFound } from "next/navigation"

// import AddressBook from "@modules/account/components/address-book"

// import { getDefaultRegion } from "@lib/data/regions"
// import { retrieveCustomer } from "@lib/data/customer"

// export const metadata: Metadata = {
//   title: "Addresses",
//   description: "View your addresses",
// }

export default function Addresses() {
  return (
    <div className="w-full p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Addresses Page</h1>
      <p className="text-base-content/70">
        This page is not yet implemented. Please check back later.
      </p>
    </div>
  )
}
