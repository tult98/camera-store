import type { 
  MedusaNextFunction, 
  MedusaRequest, 
  MedusaResponse,
  MiddlewaresConfig 
} from "@medusajs/framework"
import { validateAndTransformBody } from "@medusajs/framework/http"
import express from "express"
import path from "path"
import { CategoryProductsSchema } from "./store/category-products/route"

const staticMiddleware = (
  req: MedusaRequest, 
  res: MedusaResponse, 
  next: MedusaNextFunction
) => {
  // Serve static files from the /static directory
  const staticPath = path.join(process.cwd(), "static")
  return express.static(staticPath)(req as any, res as any, next)
}

const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/static/*",
      middlewares: [staticMiddleware],
    },
    {
      matcher: "/store/category-products",
      method: "POST",
      middlewares: [
        validateAndTransformBody(CategoryProductsSchema),
      ],
    },
  ],
}

export default config