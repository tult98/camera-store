import { HttpTypes } from "@medusajs/types"

// Shared business logic types for checkout module

// Order completion params for API calls
export interface CompleteOrderParams {
  cart: HttpTypes.StoreCart
  shippingMethodId: string
  providerId: string
}

// Checkout step types
export type CheckoutStep = "cart" | "shipping-address" | "review" | "success"

// Shipping address form data (shared between components)
export interface ShippingAddressFormData extends HttpTypes.StoreUpdateCart {
  shipping_address?: HttpTypes.StoreAddAddress
}