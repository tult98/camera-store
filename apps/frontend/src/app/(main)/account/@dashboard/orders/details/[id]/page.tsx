// Order details page temporarily disabled - not implemented yet
// Force dynamic rendering
export const dynamic = 'force-dynamic'
// import { retrieveOrder } from "@lib/data/orders"
// import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
// import { Metadata } from "next"
// import { notFound } from "next/navigation"

// type Props = {
//   params: Promise<{ id: string }>
// }

// export async function generateMetadata(props: Props): Promise<Metadata> {
//   const params = await props.params
//   const order = await retrieveOrder(params.id).catch(() => null)

//   if (!order) {
//     notFound()
//   }

//   return {
//     title: `Order #${order.display_id}`,
//     description: `View your order`,
//   }
// }

export default function OrderDetailPage() {
  return (
    <div className="w-full p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Details Page</h1>
      <p className="text-base-content/70">
        This page is not yet implemented. Please check back later.
      </p>
    </div>
  )
}
