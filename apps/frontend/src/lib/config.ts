import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env["MEDUSA_BACKEND_URL"]) {
  MEDUSA_BACKEND_URL = process.env["MEDUSA_BACKEND_URL"]
}

const publishableKey = process.env["NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"]
if (!publishableKey) {
  throw new Error("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required")
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey,
})

export { cameraStoreApi } from "./api-client"
