import axios from "axios"

const coreApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CORE_API_URL || "http://localhost:3001",
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_CORE_API_KEY || "",
  },
})

coreApiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log("API Error:", JSON.stringify(error.response.data, null, 2))
    return Promise.reject(error.response.data)
  }
)

export { coreApiClient }
