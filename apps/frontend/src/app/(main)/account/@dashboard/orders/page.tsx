// Orders page temporarily disabled - not implemented yet
// Force dynamic rendering
export const dynamic = 'force-dynamic'
// import { Metadata } from "next"

// import OrderOverview from "@modules/account/components/order-overview"
// import { notFound } from "next/navigation"
// import { listOrders } from "@lib/data/orders"
// import Divider from "@modules/common/components/divider"
// import TransferRequestForm from "@modules/account/components/transfer-request-form"

// export const metadata: Metadata = {
//   title: "Orders",
//   description: "Overview of your previous orders.",
// }

export default function Orders() {
  return (
    <div className="w-full p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Orders Page</h1>
      <p className="text-base-content/70">
        This page is not yet implemented. Please check back later.
      </p>
    </div>
  )
}
