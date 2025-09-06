# MedusaJS v2 Workflows Guide

## Workflow Fundamentals

Workflows in MedusaJS v2 orchestrate complex, multi-step business processes. They provide a declarative way to define steps, handle failures, and manage compensation logic for robust business operations.

### Key Characteristics
- **Step-Based Architecture**: Break complex operations into discrete, manageable steps
- **Automatic Compensation**: Built-in rollback mechanisms for failure scenarios
- **Async Support**: Handle long-running operations with proper async patterns
- **Transaction Safety**: Ensure data consistency across multiple operations
- **Retry Logic**: Built-in retry mechanisms for transient failures

### Basic Workflow Structure

```typescript
// src/workflows/create-order-workflow.ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { validateOrderStep, createOrderStep, sendConfirmationStep } from "./steps"

export const createOrderWorkflow = createWorkflow(
  "create-order",
  function (input: CreateOrderInput) {
    const validatedOrder = validateOrderStep(input)
    const order = createOrderStep(validatedOrder)
    const confirmation = sendConfirmationStep(order)
    
    return new WorkflowResponse({
      order,
      confirmation
    })
  }
)
```

## Workflow Steps

### Creating Workflow Steps

```typescript
// src/workflows/steps/validate-order.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CreateOrderInput } from "../types"

export const validateOrderStep = createStep(
  "validate-order",
  async (input: CreateOrderInput, { container }) => {
    const productService = container.resolve("productModuleService")
    
    // Validate products exist and have sufficient inventory
    for (const item of input.items) {
      const product = await productService.retrieveProductVariant(item.variant_id)
      
      if (!product) {
        throw new Error(`Product variant ${item.variant_id} not found`)
      }
      
      if (product.inventory_quantity < item.quantity) {
        throw new Error(`Insufficient inventory for ${product.title}`)
      }
    }
    
    return new StepResponse(input)
  },
  async (input: CreateOrderInput, { container }) => {
    // Compensation function - nothing to undo for validation
    return new StepResponse(input)
  }
)
```

### Steps with Compensation Logic

```typescript
// src/workflows/steps/reserve-inventory.ts
export const reserveInventoryStep = createStep(
  "reserve-inventory",
  async (input: OrderInput, { container }) => {
    const inventoryService = container.resolve("inventoryModuleService")
    const reservations: string[] = []
    
    // Reserve inventory for each item
    for (const item of input.items) {
      const reservation = await inventoryService.createReservation({
        inventory_item_id: item.inventory_item_id,
        location_id: input.location_id,
        quantity: item.quantity
      })
      
      reservations.push(reservation.id)
    }
    
    return new StepResponse({ reservations, input })
  },
  async (data: { reservations: string[], input: OrderInput }, { container }) => {
    // Compensation: Release reserved inventory
    const inventoryService = container.resolve("inventoryModuleService")
    
    for (const reservationId of data.reservations) {
      await inventoryService.deleteReservation(reservationId)
    }
    
    return new StepResponse(data)
  }
)
```

## Advanced Workflow Patterns

### Parallel Step Execution

```typescript
// src/workflows/process-order-workflow.ts
import { parallelize } from "@medusajs/framework/workflows-sdk"

export const processOrderWorkflow = createWorkflow(
  "process-order",
  function (input: OrderInput) {
    const validatedOrder = validateOrderStep(input)
    
    // Execute multiple steps in parallel
    const parallelResults = parallelize(
      reserveInventoryStep(validatedOrder),
      calculateTaxStep(validatedOrder),
      processPaymentStep(validatedOrder)
    )
    
    const order = createOrderStep({
      ...validatedOrder,
      ...parallelResults
    })
    
    return new WorkflowResponse({ order })
  }
)
```

### Conditional Step Execution

```typescript
// src/workflows/fulfillment-workflow.ts
export const fulfillmentWorkflow = createWorkflow(
  "fulfillment",
  function (input: FulfillmentInput) {
    const order = validateOrderStep(input.order_id)
    
    // Conditional step execution
    const shippingRequired = when(order, (order) => order.requires_shipping)
      .then(() => {
        const shipping = calculateShippingStep(order)
        return createShipmentStep(shipping)
      })
    
    const digitalItems = when(order, (order) => order.has_digital_items)
      .then(() => {
        return deliverDigitalItemsStep(order)
      })
    
    return new WorkflowResponse({
      order,
      shipping: shippingRequired,
      digital: digitalItems
    })
  }
)
```

### Transform Steps

```typescript
// src/workflows/steps/transform-order-data.ts
import { transform } from "@medusajs/framework/workflows-sdk"

export const processOrderWorkflow = createWorkflow(
  "process-order",
  function (input: RawOrderInput) {
    // Transform input data
    const transformedInput = transform(input, (data) => ({
      customer_id: data.customerId,
      items: data.cart_items.map(item => ({
        variant_id: item.variantId,
        quantity: item.qty,
        unit_price: item.price
      })),
      shipping_address: {
        first_name: data.shipping.firstName,
        last_name: data.shipping.lastName,
        address_1: data.shipping.address,
        city: data.shipping.city,
        postal_code: data.shipping.zipCode
      }
    }))
    
    const order = createOrderStep(transformedInput)
    
    return new WorkflowResponse({ order })
  }
)
```

## Workflow Execution

### Running Workflows

```typescript
// In API routes or services
import { createOrderWorkflow } from "../workflows/create-order-workflow"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { result } = await createOrderWorkflow(req.scope).run({
      input: req.body
    })
    
    res.status(201).json({
      order: result.order,
      confirmation: result.confirmation
    })
  } catch (error) {
    res.status(400).json({
      message: "Order creation failed",
      error: error.message
    })
  }
}
```

### Workflow with Transaction Context

```typescript
// Execute workflow within transaction
export const createOrderWithTransaction = async (
  orderData: CreateOrderInput,
  container: MedusaContainer
) => {
  const manager = container.resolve("manager")
  
  return await manager.transaction(async (transactionManager) => {
    const { result } = await createOrderWorkflow(container).run({
      input: orderData,
      context: {
        transactionManager
      }
    })
    
    return result.order
  })
}
```

## Error Handling and Compensation

### Automatic Compensation Triggers

```typescript
// src/workflows/steps/process-payment.ts
export const processPaymentStep = createStep(
  "process-payment",
  async (input: PaymentInput, { container }) => {
    const paymentService = container.resolve("paymentModuleService")
    
    try {
      const payment = await paymentService.capturePayment({
        payment_id: input.payment_id,
        amount: input.amount
      })
      
      return new StepResponse({ payment })
    } catch (error) {
      // Step failure triggers automatic compensation
      throw new Error(`Payment processing failed: ${error.message}`)
    }
  },
  async (data: { payment: any }, { container }) => {
    // Compensation: Refund the payment
    const paymentService = container.resolve("paymentModuleService")
    
    if (data.payment?.id) {
      await paymentService.refundPayment({
        payment_id: data.payment.id,
        amount: data.payment.amount,
        reason: "workflow_compensation"
      })
    }
    
    return new StepResponse(data)
  }
)
```

### Manual Compensation Triggers

```typescript
// src/workflows/order-cancellation-workflow.ts
export const cancelOrderWorkflow = createWorkflow(
  "cancel-order",
  function (input: { order_id: string }) {
    const order = retrieveOrderStep(input.order_id)
    
    // Manually trigger compensation for specific workflows
    const compensatePayment = compensate("process-payment", {
      payment_id: order.payment_id
    })
    
    const compensateInventory = compensate("reserve-inventory", {
      reservations: order.inventory_reservations
    })
    
    const cancelledOrder = updateOrderStatusStep({
      ...order,
      status: "cancelled"
    })
    
    return new WorkflowResponse({
      order: cancelledOrder,
      compensations: [compensatePayment, compensateInventory]
    })
  }
)
```

## Workflow Hooks and Events

### Pre and Post Hooks

```typescript
// src/workflows/hooks/order-hooks.ts
import { WorkflowHooks } from "@medusajs/framework/workflows-sdk"

export const orderWorkflowHooks: WorkflowHooks = {
  onStepBegin: async ({ step, input, container }) => {
    const logger = container.resolve("logger")
    logger.info(`Starting step: ${step.name}`)
  },
  
  onStepSuccess: async ({ step, result, container }) => {
    const logger = container.resolve("logger")
    logger.info(`Completed step: ${step.name}`)
  },
  
  onStepFailure: async ({ step, error, container }) => {
    const logger = container.resolve("logger")
    logger.error(`Step failed: ${step.name}`, { error: error.message })
  },
  
  onWorkflowComplete: async ({ workflow, result, container }) => {
    const eventBus = container.resolve("eventBusModuleService")
    await eventBus.emit("order.workflow_completed", {
      workflow_id: workflow.id,
      result
    })
  }
}

// Apply hooks to workflow
export const createOrderWorkflow = createWorkflow(
  "create-order",
  function (input: CreateOrderInput) {
    // Workflow definition
  },
  {
    hooks: orderWorkflowHooks
  }
)
```

## Testing Workflows

### Unit Testing Steps

```typescript
// src/workflows/__tests__/validate-order-step.test.ts
import { validateOrderStep } from "../steps/validate-order"

describe("validateOrderStep", () => {
  let container: any
  
  beforeEach(() => {
    container = {
      resolve: jest.fn()
    }
  })
  
  it("should validate order successfully", async () => {
    const mockProductService = {
      retrieveProductVariant: jest.fn().mockResolvedValue({
        id: "variant_1",
        title: "Test Product",
        inventory_quantity: 10
      })
    }
    
    container.resolve.mockReturnValue(mockProductService)
    
    const input = {
      items: [{
        variant_id: "variant_1",
        quantity: 2
      }]
    }
    
    const result = await validateOrderStep.invoke(input, { container })
    
    expect(result.output).toEqual(input)
    expect(mockProductService.retrieveProductVariant).toHaveBeenCalledWith("variant_1")
  })
  
  it("should throw error for insufficient inventory", async () => {
    const mockProductService = {
      retrieveProductVariant: jest.fn().mockResolvedValue({
        id: "variant_1",
        title: "Test Product",
        inventory_quantity: 1
      })
    }
    
    container.resolve.mockReturnValue(mockProductService)
    
    const input = {
      items: [{
        variant_id: "variant_1",
        quantity: 5
      }]
    }
    
    await expect(validateOrderStep.invoke(input, { container }))
      .rejects.toThrow("Insufficient inventory")
  })
})
```

### Integration Testing Workflows

```typescript
// src/workflows/__tests__/create-order-workflow.test.ts
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createOrderWorkflow } from "../create-order-workflow"

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Create Order Workflow", () => {
      let container: any
      
      beforeEach(async () => {
        container = getContainer()
      })
      
      it("should create order successfully", async () => {
        const input = {
          customer_id: "customer_1",
          items: [{
            variant_id: "variant_1",
            quantity: 1
          }]
        }
        
        const { result } = await createOrderWorkflow(container).run({
          input
        })
        
        expect(result.order).toBeDefined()
        expect(result.order.customer_id).toBe("customer_1")
        expect(result.order.items).toHaveLength(1)
      })
      
      it("should compensate on payment failure", async () => {
        // Mock payment service to fail
        const paymentService = container.resolve("paymentModuleService")
        jest.spyOn(paymentService, "capturePayment").mockRejectedValue(
          new Error("Payment declined")
        )
        
        const input = {
          customer_id: "customer_1",
          items: [{
            variant_id: "variant_1",
            quantity: 1
          }]
        }
        
        await expect(createOrderWorkflow(container).run({ input }))
          .rejects.toThrow("Payment declined")
          
        // Verify compensation was triggered
        // Check that inventory was released, etc.
      })
    })
  }
})
```

## Best Practices

### Workflow Design Principles

1. **Idempotency**: Each step should be idempotent to handle retries safely
2. **Atomic Operations**: Keep steps focused on single, atomic operations
3. **Proper Compensation**: Always implement compensation logic for steps that modify state
4. **Error Context**: Provide meaningful error messages with context
5. **Logging**: Add appropriate logging for debugging and monitoring

### Performance Considerations

```typescript
// Optimize workflow performance
export const efficientOrderWorkflow = createWorkflow(
  "efficient-order",
  function (input: OrderInput) {
    // Batch operations when possible
    const batchValidation = validateMultipleProductsStep(input.items)
    
    // Use parallel execution for independent operations
    const parallelOps = parallelize(
      reserveInventoryStep(batchValidation),
      calculateTaxStep(batchValidation),
      validatePaymentMethodStep(input.payment)
    )
    
    // Sequential operations that depend on previous steps
    const order = createOrderStep(parallelOps)
    const payment = processPaymentStep({
      ...parallelOps,
      order_id: order.id
    })
    
    return new WorkflowResponse({ order, payment })
  }
)
```