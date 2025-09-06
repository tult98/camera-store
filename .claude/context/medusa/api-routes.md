# MedusaJS v2 API Routes Guide

## API Routes Fundamentals

API routes in MedusaJS v2 are REST endpoints that expose commerce features to external applications. They follow a file-based routing system and provide type-safe request/response handling.

### Core Characteristics
- **File-Based Routing**: Routes are defined by the directory structure in `src/api/`
- **HTTP Method Support**: Each route file can export handlers for different HTTP methods
- **Type Safety**: Uses `MedusaRequest` and `MedusaResponse` for type-safe operations
- **Framework Integration**: Seamless integration with MedusaJS container system
- **Middleware Support**: Built-in and custom middleware for cross-cutting concerns

### Basic Route Structure

```typescript
// src/api/hello-world/route.ts
import type {
  MedusaRequest,
  MedusaResponse
} from "@medusajs/framework/http"

export const GET = (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  res.json({
    message: "Hello World!"
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Handle POST requests
  res.json({
    message: "Data created",
    data: req.body
  })
}
```

### Supported HTTP Methods

```typescript
// All supported HTTP methods
export const GET = (req: MedusaRequest, res: MedusaResponse) => { /* ... */ }
export const POST = (req: MedusaRequest, res: MedusaResponse) => { /* ... */ }
export const PUT = (req: MedusaRequest, res: MedusaResponse) => { /* ... */ }
export const PATCH = (req: MedusaRequest, res: MedusaResponse) => { /* ... */ }
export const DELETE = (req: MedusaRequest, res: MedusaResponse) => { /* ... */ }
export const OPTIONS = (req: MedusaRequest, res: MedusaResponse) => { /* ... */ }
export const HEAD = (req: MedusaRequest, res: MedusaResponse) => { /* ... */ }
```

## Path Parameters and Dynamic Routing

### Creating Dynamic Routes

Use square brackets `[param]` for dynamic path parameters:

```typescript
// src/api/products/[id]/route.ts
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  
  // Resolve product service from container
  const productService = req.scope.resolve("productModuleService")
  
  try {
    const product = await productService.retrieveProduct(id)
    res.json({ product })
  } catch (error) {
    res.status(404).json({ 
      message: "Product not found",
      type: "not_found"
    })
  }
}
```

### Nested Path Parameters

```typescript
// src/api/products/[id]/variants/[variant_id]/route.ts
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id: productId, variant_id: variantId } = req.params
  
  const productService = req.scope.resolve("productModuleService")
  
  const variant = await productService.retrieveProductVariant(
    variantId,
    { 
      relations: ["product"],
      filters: { product_id: productId }
    }
  )
  
  res.json({ variant })
}
```

## Request Data Handling

### Query Parameters

```typescript
// src/api/products/route.ts
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const {
    limit = 20,
    offset = 0,
    q: searchTerm,
    category_id,
    ...filters
  } = req.query
  
  const productService = req.scope.resolve("productModuleService")
  
  const products = await productService.listProducts(
    {
      ...filters,
      ...(category_id && { category_id }),
      ...(searchTerm && { title: { $ilike: `%${searchTerm}%` } })
    },
    {
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      relations: ["variants", "images"]
    }
  )
  
  res.json({ products, count: products.length })
}
```

### Request Body with Type Safety

```typescript
// Define request body type
type CreateProductRequest = {
  title: string
  description?: string
  price: number
  category_id?: string
}

// src/api/products/route.ts
export const POST = async (
  req: MedusaRequest<CreateProductRequest>,
  res: MedusaResponse
) => {
  const { title, description, price, category_id } = req.body
  
  const productService = req.scope.resolve("productModuleService")
  
  const product = await productService.createProducts({
    title,
    description,
    variants: [{
      title: `${title} - Default`,
      prices: [{
        amount: price * 100, // Convert to cents
        currency_code: "usd"
      }]
    }],
    ...(category_id && { category_id })
  })
  
  res.status(201).json({ product })
}
```

## Request Validation with Zod

### Setting Up Validation Schemas

```typescript
// src/api/products/validators.ts
import { z } from "zod"

export const CreateProductSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  category_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
})

export const ProductQuerySchema = z.object({
  limit: z.preprocess(
    (val) => parseInt(val as string),
    z.number().min(1).max(100).default(20)
  ),
  offset: z.preprocess(
    (val) => parseInt(val as string),
    z.number().min(0).default(0)
  ),
  q: z.string().optional(),
  category_id: z.string().uuid().optional(),
  published: z.preprocess(
    (val) => val === "true",
    z.boolean().optional()
  )
})

export type CreateProductRequest = z.infer<typeof CreateProductSchema>
export type ProductQueryRequest = z.infer<typeof ProductQuerySchema>
```

### Applying Validation Middleware

```typescript
// src/api/products/route.ts
import {
  validateAndTransformBody,
  validateAndTransformQuery
} from "@medusajs/framework/http"
import { CreateProductSchema, ProductQuerySchema } from "./validators"

// Validate query parameters
export const GET = validateAndTransformQuery(
  ProductQuerySchema,
  async (req: MedusaRequest, res: MedusaResponse) => {
    const { limit, offset, q, category_id, published } = req.validatedQuery
    
    const productService = req.scope.resolve("productModuleService")
    
    const products = await productService.listProducts(
      {
        ...(category_id && { category_id }),
        ...(published !== undefined && { published }),
        ...(q && { 
          $or: [
            { title: { $ilike: `%${q}%` } },
            { description: { $ilike: `%${q}%` } }
          ]
        })
      },
      {
        take: limit,
        skip: offset,
        relations: ["variants", "images"]
      }
    )
    
    res.json({ products })
  }
)

// Validate request body
export const POST = validateAndTransformBody(
  CreateProductSchema,
  async (req: MedusaRequest, res: MedusaResponse) => {
    const validatedData = req.validatedBody
    
    const productService = req.scope.resolve("productModuleService")
    
    try {
      const product = await productService.createProducts({
        ...validatedData,
        variants: [{
          title: `${validatedData.title} - Default`,
          prices: [{
            amount: validatedData.price * 100,
            currency_code: "usd"
          }]
        }]
      })
      
      res.status(201).json({ product })
    } catch (error) {
      res.status(400).json({
        message: "Failed to create product",
        error: error.message
      })
    }
  }
)
```

## CORS Configuration

### Global CORS Setup

```typescript
// medusa-config.ts
export default defineConfig({
  projectConfig: {
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:8000"
    }
  }
})
```

### Disabling CORS for Specific Routes

```typescript
// src/api/webhooks/stripe/route.ts
export const CORS = false // Disable CORS for this route

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Handle webhook without CORS restrictions
  res.json({ received: true })
}
```

## Error Handling Patterns

### Structured Error Responses

```typescript
// src/api/utils/errors.ts
export class APIError extends Error {
  constructor(
    public message: string,
    public status: number = 400,
    public type: string = "invalid_request",
    public details?: any
  ) {
    super(message)
    this.name = "APIError"
  }
}

export const handleAPIError = (error: any, res: MedusaResponse) => {
  const logger = res.locals.container?.resolve("logger")
  
  if (error instanceof APIError) {
    res.status(error.status).json({
      type: error.type,
      message: error.message,
      ...(error.details && { details: error.details })
    })
  } else {
    logger?.error("Unexpected API error:", error)
    res.status(500).json({
      type: "internal_server_error",
      message: "An internal server error occurred"
    })
  }
}
```

## Authentication and Authorization

### Protected Routes Pattern

```typescript
// src/api/admin/products/route.ts
import { authenticate } from "@medusajs/framework/http"

// Apply authentication middleware
export const GET = authenticate("admin", ["products:read"], async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Route accessible only to authenticated admin users with products:read permission
  const productService = req.scope.resolve("productModuleService")
  const products = await productService.listProducts({})
  
  res.json({ products })
})

export const POST = authenticate("admin", ["products:create"], async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Route requires products:create permission
  const productService = req.scope.resolve("productModuleService")
  const product = await productService.createProducts(req.body)
  
  res.status(201).json({ product })
})
```

## Advanced Patterns

### Working with Modules and Services

```typescript
// src/api/products/[id]/reviews/route.ts
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../../../../modules/review"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id: productId } = req.params
  const { limit = 10, offset = 0 } = req.query
  
  // Access custom module
  const reviewService = req.scope.resolve(REVIEW_MODULE)
  
  // Use Query API for cross-module data
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  const reviews = await query.graph({
    entity: "review",
    fields: ["*", "customer.first_name", "customer.last_name"],
    filters: { product_id: productId },
    pagination: {
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    },
    order: { created_at: "DESC" }
  })
  
  res.json({ reviews })
}
```

### Webhook Handling

```typescript
// src/api/webhooks/stripe/route.ts
import Stripe from "stripe"

// Disable CORS and parse raw body for webhook verification
export const CORS = false
export const bodyParser = false

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const sig = req.headers['stripe-signature'] as string
    const payload = req.body
    
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    
    const orderService = req.scope.resolve("orderModuleService")
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        // Handle successful payment
        await orderService.updateOrders(
          paymentIntent.metadata.order_id,
          { payment_status: 'captured' }
        )
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    res.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(400).json({ error: 'Webhook validation failed' })
  }
}
```

## Performance and Security Best Practices

### Input Sanitization

```typescript
// src/api/utils/sanitization.ts
export const sanitizeString = (input: string, maxLength = 255): string => {
  return input
    .replace(/[<>"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, maxLength)   // Enforce length limits
    .trim()
}

export const sanitizeSearchTerm = (term: string): string => {
  return term
    .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Allow only alphanumeric, spaces, hyphens, underscores
    .substring(0, 100)
    .trim()
}

// Use in routes
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const searchTerm = req.query.q 
    ? sanitizeSearchTerm(req.query.q as string) 
    : undefined
    
  // Use sanitized input in queries
  const products = await productService.listProducts({
    ...(searchTerm && { title: { $ilike: `%${searchTerm}%` } })
  })
  
  res.json({ products })
}
```