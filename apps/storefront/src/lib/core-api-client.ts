import axios from "axios"

const coreApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CORE_API_URL || "http://localhost:3001",
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_CORE_API_KEY || "",
  },
})

export { coreApiClient }
