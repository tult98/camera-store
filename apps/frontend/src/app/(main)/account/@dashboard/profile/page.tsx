// Profile page temporarily disabled - not implemented yet
// Force dynamic rendering
export const dynamic = 'force-dynamic'
// import { Metadata } from "next"

// import ProfilePhone from "@modules/account//components/profile-phone"
// import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
// import ProfileEmail from "@modules/account/components/profile-email"
// import ProfileName from "@modules/account/components/profile-name"
// import ProfilePassword from "@modules/account/components/profile-password"

// import { notFound } from "next/navigation"
// import { listRegions } from "@lib/data/regions"
// import { retrieveCustomer } from "@lib/data/customer"

// export const metadata: Metadata = {
//   title: "Profile",
//   description: "View and edit your Medusa Store profile.",
// }

export default function Profile() {
  return (
    <div className="w-full p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <p className="text-base-content/70">
        This page is not yet implemented. Please check back later.
      </p>
    </div>
  )
}

// const Divider = () => {
//   return <div className="w-full h-px bg-gray-200" />
// }
