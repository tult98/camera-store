import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
if (!process.env.MEDUSA_BACKEND_URL) {
  throw new Error("MEDUSA_BACKEND_URL is required")
}

if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required")
}

export const sdk = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

export { cameraStoreApi } from "./api-client"
