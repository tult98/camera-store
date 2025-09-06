# MedusaJS v2 Admin Extensions Guide

## Admin Extensions Fundamentals

Admin extensions in MedusaJS v2 allow you to customize and extend the admin dashboard with custom widgets, routes, and UI components. They integrate seamlessly with the existing admin interface using React and React Query patterns.

### Core Characteristics
- **React-Based**: Built with React components and hooks
- **React Query Integration**: Uses React Query for data fetching and state management
- **Type Safety**: Full TypeScript support with proper typing
- **Hot Module Replacement**: Real-time development with HMR support
- **Admin API Integration**: Direct access to admin API endpoints

## Basic Widget Structure

### Simple Widget Creation

```typescript
// src/admin/widgets/hello-world.tsx
import { defineWidgetConfig } from "@medusajs/admin-shared"

const HelloWorldWidget = () => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Hello World Widget</h2>
      <p>This is a custom admin widget!</p>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default HelloWorldWidget
```

### Widget with Data Fetching

```typescript
// src/admin/widgets/product-reviews.tsx
import { defineWidgetConfig } from "@medusajs/admin-shared"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"

const ProductReviewsWidget = ({ data: product }) => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["product-reviews", product.id],
    queryFn: async () => {
      const response = await sdk.admin.custom.get(`/products/${product.id}/reviews`)
      return response.data.reviews
    },
    enabled: !!product.id
  })

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="animate-pulse">Loading reviews...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <p className="text-red-500">Error loading reviews</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
      {reviews?.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{review.customer_name}</span>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet</p>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductReviewsWidget
```

## Widget Zones and Placement

### Available Widget Zones

```typescript
// Common widget zones
export const WIDGET_ZONES = {
  // Product pages
  "product.details.before": "Before product details",
  "product.details.after": "After product details", 
  "product.list.before": "Before product list",
  "product.list.after": "After product list",
  
  // Order pages
  "order.details.before": "Before order details",
  "order.details.after": "After order details",
  "order.list.before": "Before order list",
  "order.list.after": "After order list",
  
  // Customer pages
  "customer.details.before": "Before customer details",
  "customer.details.after": "After customer details",
  "customer.list.before": "Before customer list",
  "customer.list.after": "After customer list",
  
  // Dashboard
  "dashboard.overview.before": "Before dashboard overview",
  "dashboard.overview.after": "After dashboard overview"
}

// Zone-specific widget
export const config = defineWidgetConfig({
  zone: ["product.details.after", "product.list.after"], // Multiple zones
})
```

### Conditional Widget Display

```typescript
// src/admin/widgets/inventory-alerts.tsx
import { defineWidgetConfig } from "@medusajs/admin-shared"

const InventoryAlertsWidget = ({ data: product }) => {
  // Only show for products with variants
  if (!product.variants?.length) {
    return null
  }

  const lowStockVariants = product.variants.filter(
    variant => variant.inventory_quantity < 10
  )

  if (lowStockVariants.length === 0) {
    return null
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
      <h4 className="text-yellow-800 font-semibold mb-2">⚠️ Low Stock Alert</h4>
      <ul className="space-y-1">
        {lowStockVariants.map((variant) => (
          <li key={variant.id} className="text-yellow-700 text-sm">
            {variant.title}: {variant.inventory_quantity} remaining
          </li>
        ))}
      </ul>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default InventoryAlertsWidget
```

## Custom Routes

### Creating Custom Admin Routes

```typescript
// src/admin/routes/analytics/page.tsx
import { RouteConfig } from "@medusajs/admin-shared"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"

const AnalyticsPage = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await sdk.admin.custom.get("/analytics/dashboard")
      return response.data
    }
  })

  if (isLoading) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold">${analytics?.totalRevenue || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
          <p className="text-2xl font-bold">{analytics?.totalOrders || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">New Customers</h3>
          <p className="text-2xl font-bold">{analytics?.newCustomers || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
          <p className="text-2xl font-bold">{analytics?.conversionRate || 0}%</p>
        </div>
      </div>
      
      {/* Charts and additional analytics here */}
    </div>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Analytics",
    icon: "ChartBarIcon" // Heroicons icon name
  }
}

export default AnalyticsPage
```

### Nested Route Structure

```typescript
// src/admin/routes/inventory/page.tsx
const InventoryPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Inventory Management</h1>
      <p>Main inventory dashboard</p>
    </div>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Inventory",
    icon: "CubeIcon"
  }
}

export default InventoryPage

// src/admin/routes/inventory/alerts/page.tsx
const InventoryAlertsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Inventory Alerts</h1>
      <p>Low stock and out of stock alerts</p>
    </div>
  )
}

// No config needed for nested routes - they inherit from parent
export default InventoryAlertsPage
```

## Data Mutations and Forms

### Creating and Updating Data

```typescript
// src/admin/widgets/quick-product-editor.tsx
import { defineWidgetConfig } from "@medusajs/admin-shared"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { sdk } from "../lib/sdk"

const QuickProductEditor = ({ data: product }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(product.title || "")
  const [description, setDescription] = useState(product.description || "")
  
  const queryClient = useQueryClient()
  
  const updateProductMutation = useMutation({
    mutationFn: async (updates: { title: string; description: string }) => {
      const response = await sdk.admin.product.update(product.id, updates)
      return response.product
    },
    onSuccess: () => {
      // Invalidate and refetch product data
      queryClient.invalidateQueries(["products", product.id])
      setIsEditing(false)
    },
    onError: (error) => {
      console.error("Failed to update product:", error)
    }
  })

  const handleSave = () => {
    updateProductMutation.mutate({
      title,
      description
    })
  }

  if (!isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Quick Edit</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Title:</span> {product.title}
          </div>
          <div>
            <span className="font-medium">Description:</span> {product.description}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Quick Edit</h3>
        <div className="space-x-2">
          <button
            onClick={() => {
              setIsEditing(false)
              setTitle(product.title || "")
              setDescription(product.description || "")
            }}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateProductMutation.isPending}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
          >
            {updateProductMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default QuickProductEditor
```

## Advanced Patterns

### Widget with External API Integration

```typescript
// src/admin/widgets/shipping-rates.tsx
import { defineWidgetConfig } from "@medusajs/admin-shared"
import { useQuery } from "@tanstack/react-query"

const ShippingRatesWidget = ({ data: order }) => {
  const { data: shippingRates, isLoading } = useQuery({
    queryKey: ["shipping-rates", order.shipping_address?.postal_code],
    queryFn: async () => {
      if (!order.shipping_address?.postal_code) return null
      
      // Call external shipping API
      const response = await fetch("/admin/shipping/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postal_code: order.shipping_address.postal_code,
          weight: order.total_weight || 1000, // grams
        })
      })
      
      return response.json()
    },
    enabled: !!order.shipping_address?.postal_code
  })

  if (!order.shipping_address?.postal_code) {
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Shipping Options</h3>
      
      {isLoading ? (
        <div>Loading shipping rates...</div>
      ) : shippingRates?.rates?.length > 0 ? (
        <div className="space-y-3">
          {shippingRates.rates.map((rate) => (
            <div key={rate.service} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{rate.service}</span>
                <p className="text-sm text-gray-600">{rate.delivery_days} business days</p>
              </div>
              <span className="font-bold">${rate.rate}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No shipping rates available</p>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default ShippingRatesWidget
```

### Widget with Real-time Updates

```typescript
// src/admin/widgets/order-status-tracker.tsx
import { defineWidgetConfig } from "@medusajs/admin-shared"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

const OrderStatusTracker = ({ data: order }) => {
  const { data: statusHistory, refetch } = useQuery({
    queryKey: ["order-status-history", order.id],
    queryFn: async () => {
      const response = await sdk.admin.custom.get(`/orders/${order.id}/status-history`)
      return response.data.history
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  // Listen for real-time updates via WebSocket
  useEffect(() => {
    const ws = new WebSocket(`wss://your-api.com/orders/${order.id}/status`)
    
    ws.onmessage = (event) => {
      const statusUpdate = JSON.parse(event.data)
      if (statusUpdate.order_id === order.id) {
        refetch() // Refetch data when status changes
      }
    }
    
    return () => ws.close()
  }, [order.id, refetch])

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Status History</h3>
      
      <div className="space-y-3">
        {statusHistory?.map((status, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${
              index === 0 ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{status.status}</span>
                <span className="text-sm text-gray-500">
                  {new Date(status.created_at).toLocaleDateString()}
                </span>
              </div>
              {status.note && (
                <p className="text-sm text-gray-600 mt-1">{status.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default OrderStatusTracker
```

## Testing Admin Extensions

### Testing Widgets

```typescript
// src/admin/widgets/__tests__/product-reviews.test.tsx
import { render, screen, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ProductReviewsWidget from "../product-reviews"

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const renderWithQueryClient = (component) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe("ProductReviewsWidget", () => {
  const mockProduct = {
    id: "prod_123",
    title: "Test Product"
  }

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it("displays loading state initially", () => {
    renderWithQueryClient(<ProductReviewsWidget data={mockProduct} />)
    expect(screen.getByText("Loading reviews...")).toBeInTheDocument()
  })

  it("displays reviews when loaded", async () => {
    const mockReviews = [
      {
        id: "review_1",
        customer_name: "John Doe",
        rating: 5,
        comment: "Great product!"
      }
    ]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reviews: mockReviews })
    })

    renderWithQueryClient(<ProductReviewsWidget data={mockProduct} />)

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
      expect(screen.getByText("Great product!")).toBeInTheDocument()
    })
  })

  it("displays error state on fetch failure", async () => {
    global.fetch.mockRejectedValueOnce(new Error("API Error"))

    renderWithQueryClient(<ProductReviewsWidget data={mockProduct} />)

    await waitFor(() => {
      expect(screen.getByText("Error loading reviews")).toBeInTheDocument()
    })
  })
})
```