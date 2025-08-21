import type { 
  MedusaNextFunction, 
  MedusaRequest, 
  MedusaResponse,
  MiddlewaresConfig 
} from "@medusajs/framework"
import express from "express"
import path from "path"

const staticMiddleware = (
  req: MedusaRequest, 
  res: MedusaResponse, 
  next: MedusaNextFunction
) => {
  // Serve static files from the /static directory
  const staticPath = path.join(process.cwd(), "static")
  return express.static(staticPath)(req as any, res as any, next)
}

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/static/*",
      middlewares: [staticMiddleware],
    },
  ],
}