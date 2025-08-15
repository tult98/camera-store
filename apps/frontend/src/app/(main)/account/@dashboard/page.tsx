// Main account dashboard page temporarily disabled - not implemented yet
// Force dynamic rendering
export const dynamic = 'force-dynamic'

// import { Metadata } from "next"

// import Overview from "@modules/account/components/overview"
// import { notFound } from "next/navigation"
// import { retrieveCustomer } from "@lib/data/customer"
// import { listOrders } from "@lib/data/orders"

// export const metadata: Metadata = {
//   title: "Account",
//   description: "Overview of your account activity.",
// }

export default function OverviewTemplate() {
  return (
    <div className="w-full p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Account Dashboard</h1>
      <p className="text-base-content/70">
        This page is not yet implemented. Please check back later.
      </p>
    </div>
  )
}
