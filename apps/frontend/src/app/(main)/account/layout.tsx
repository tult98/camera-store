import { Toaster } from "@medusajs/ui"

export default function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  return (
    <div className="min-h-screen p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Account Section</h1>
      <p className="text-base-content/70">
        Account pages are not yet implemented. Please check back later.
      </p>
      <Toaster />
    </div>
  )
}
