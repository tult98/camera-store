# MedusaJS v2 Troubleshooting Guide

## Common Issues and Solutions

### Module Registration Problems

#### Issue: Module not found or not registered
```
Error: Module "customModule" is not registered
```

**Solutions:**
1. Check module registration in `medusa-config.ts`:
```typescript
export default defineConfig({
  modules: [
    {
      resolve: "./src/modules/custom",
      key: "customModuleService" // Make sure key matches
    }
  ]
})
```

2. Verify module export in `src/modules/custom/index.ts`:
```typescript
export const CUSTOM_MODULE = "customModuleService" // Must match config key
export default Module(CUSTOM_MODULE, {
  service: CustomModuleService,
})
```

3. Check for typos in module resolution:
```typescript
// In services or API routes
const customService = req.scope.resolve("customModuleService") // Exact match
```

#### Issue: Service factory not working
```
TypeError: Cannot read property 'listItems' of undefined
```

**Solution:** Ensure proper service factory setup:
```typescript
// Correct service factory pattern
class CustomModuleService extends MedusaService({
  CustomItem, // Model must be imported and included
}) {
  // Methods like listCustomItems are auto-generated
}
```

### Database and Migration Issues

#### Issue: Migration fails with table already exists
```
Error: relation "custom_table" already exists
```

**Solutions:**
1. Check existing migrations:
```bash
npx medusa db:generate custom-module --check
```

2. Reset development database (⚠️ NEVER in production):
```bash
# Only in development
nx run backend:reset-database
```

3. Create a rollback migration:
```typescript
export class Migration20240101120001 extends Migration {
  async up(): Promise<void> {
    // Skip if table exists
    this.addSql(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM information_schema.tables 
                      WHERE table_name = 'custom_table') THEN
          CREATE TABLE custom_table (...);
        END IF;
      END$$;
    `)
  }
}
```

#### Issue: Foreign key constraint violations
```
Error: insert or update on table violates foreign key constraint
```

**Solution:** Check relationship definitions:
```typescript
// Ensure foreign keys exist in both models
const BlogPost = model.define("blog_post", {
  id: model.id().primaryKey(),
  author_id: model.text(), // Foreign key field
  author: model.belongsTo(() => Author, {
    mappedBy: "posts"
  })
})
```

### Query and Performance Issues

#### Issue: N+1 query problem
```
[DB Query] SELECT * FROM products WHERE id = ? (executed 100 times)
```

**Solution:** Use proper relation loading:
```typescript
// Bad - causes N+1 queries
const products = await this.listProducts({})
for (const product of products) {
  const variants = await this.listVariants({ product_id: product.id })
}

// Good - single query with joins
const products = await this.listProducts({}, {
  relations: ["variants"],
  relationLoadStrategy: "joined"
})
```

#### Issue: Query context missing for pricing
```
Error: calculated_price is null
```

**Solution:** Always include pricing context:
```typescript
const result = await query.graph({
  entity: "product",
  fields: ["*", "variants.*", "variants.calculated_price.*"],
  context: {
    variants: {
      calculated_price: QueryContext({
        region_id: req.headers["region_id"],
        currency_code: req.headers["currency_code"]
      })
    }
  }
})
```

### API Route Issues

#### Issue: Route not found (404)
```
GET /api/custom/endpoint -> 404 Not Found
```

**Solutions:**
1. Check file structure matches URL:
```
src/api/custom/endpoint/route.ts -> /api/custom/endpoint
src/api/custom/[id]/route.ts -> /api/custom/:id
```

2. Ensure proper export:
```typescript
// Must export HTTP method functions
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Handler code
}
```

#### Issue: CORS errors in browser
```
Access to fetch at 'http://localhost:9000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:** Configure CORS in `medusa-config.ts`:
```typescript
export default defineConfig({
  projectConfig: {
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000,http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7001"
    }
  }
})
```

### Container and Dependency Injection Issues

#### Issue: Service not found in container
```
Error: Cannot resolve "customModuleService" from container
```

**Solutions:**
1. Check service registration timing:
```typescript
// In loaders - services might not be ready
export default async function customLoader({ container }) {
  // Use setTimeout or process.nextTick for async service resolution
  setTimeout(() => {
    const customService = container.resolve("customModuleService")
  }, 0)
}
```

2. Use proper resolution in API routes:
```typescript
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Use req.scope instead of container directly
  const customService = req.scope.resolve("customModuleService")
}
```

### Workflow Issues

#### Issue: Workflow step compensation not working
```
Error: Compensation failed for step "reserve-inventory"
```

**Solution:** Check compensation function signature:
```typescript
export const reserveInventoryStep = createStep(
  "reserve-inventory",
  async (input, { container }) => {
    // Forward step
    return new StepResponse(result)
  },
  async (input, { container }) => { // Compensation function
    // Must handle the SAME input structure as forward step
    // Undo the operation
    return new StepResponse(input)
  }
)
```

#### Issue: Workflow hanging or not completing
```
Workflow execution timeout
```

**Solutions:**
1. Check for missing `await` keywords:
```typescript
// Bad
const result = someAsyncFunction()

// Good  
const result = await someAsyncFunction()
```

2. Handle async operations in steps:
```typescript
export const processStep = createStep(
  "process",
  async (input, { container }) => {
    // Ensure all promises are resolved
    const results = await Promise.all([
      operation1(input),
      operation2(input),
      operation3(input)
    ])
    
    return new StepResponse({ results })
  }
)
```

### Development Environment Issues

#### Issue: Hot reload not working
```
Changes to code don't trigger server restart
```

**Solutions:**
1. Check file watch patterns:
```bash
# Make sure you're in the right directory
cd apps/backend
nx serve backend
```

2. Restart development server:
```bash
# Kill existing process and restart
pkill -f "medusa"
nx serve backend
```

#### Issue: Port already in use
```
Error: listen EADDRINUSE: address already in use :::9000
```

**Solution:**
```bash
# Find and kill process using port
lsof -ti:9000 | xargs kill -9

# Or use different port
PORT=9001 nx serve backend
```

### Production Deployment Issues

#### Issue: Environment variables not loaded
```
Error: Database connection failed
```

**Solution:** Check environment variable loading:
```typescript
// medusa-config.ts
import dotenv from "dotenv"

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL, // Must be set
    // Other config...
  }
})
```

#### Issue: Build failures
```
Error: Module not found or build failed
```

**Solutions:**
1. Check TypeScript errors:
```bash
nx run backend:build --verbose
```

2. Ensure all dependencies are installed:
```bash
yarn install --frozen-lockfile
```

3. Check for missing type definitions:
```typescript
// Add proper types
interface CustomType {
  id: string
  name: string
}

// Or use any temporarily
const data: any = unknownData
```

## Debug Patterns

### Logging Best Practices

```typescript
// Use container logger consistently
const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

// Single argument logging (required by MedusaJS)
logger.debug(`Processing order: ${JSON.stringify({ orderId, status })}`)
logger.info(`Order ${orderId} created successfully`)
logger.error(`Order processing failed: ${error.message}`)

// Avoid multiple arguments
logger.error("Order failed:", error) // ❌ Don't do this
logger.error(`Order failed: ${error.message}`) // ✅ Do this
```

### Database Query Debugging

```typescript
// Enable query logging in development
export default defineConfig({
  projectConfig: {
    databaseExtra: {
      ...(process.env.NODE_ENV === "development" && {
        debug: true,
        logger: (message: string) => {
          console.log("[DB Query]", message)
        }
      })
    }
  }
})

// Log query parameters in services
class CustomService extends MedusaService({ CustomModel }) {
  async customQuery(filters: any, sharedContext = {}) {
    const logger = this.container_.resolve(ContainerRegistrationKeys.LOGGER)
    logger.debug(`Executing query with filters: ${JSON.stringify(filters)}`)
    
    const result = await this.listCustomModels(filters, {}, sharedContext)
    logger.debug(`Query returned ${result.length} results`)
    
    return result
  }
}
```

### API Request Debugging

```typescript
// Log request details in API routes
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
  
  logger.debug(`API Request: ${req.method} ${req.path}`)
  logger.debug(`Query params: ${JSON.stringify(req.query)}`)
  logger.debug(`Headers: ${JSON.stringify({
    'user-agent': req.headers['user-agent'],
    'content-type': req.headers['content-type']
  })}`)
  
  try {
    // Route logic here
    const result = await someService.getData()
    logger.debug(`Response data: ${JSON.stringify(result)}`)
    res.json(result)
  } catch (error) {
    logger.error(`API Error: ${error.message}`)
    res.status(500).json({ error: "Internal server error" })
  }
}
```

### Memory and Performance Debugging

```typescript
// Monitor memory usage
class PerformanceService {
  logMemoryUsage(operation: string) {
    const usage = process.memoryUsage()
    const logger = this.container_.resolve(ContainerRegistrationKeys.LOGGER)
    
    logger.debug(`Memory usage after ${operation}: ${JSON.stringify({
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(usage.external / 1024 / 1024)}MB`
    })}`)
  }

  async monitorQuery<T>(
    queryName: string, 
    queryFn: () => Promise<T>
  ): Promise<T> {
    const start = Date.now()
    const startMemory = process.memoryUsage()
    
    try {
      const result = await queryFn()
      const duration = Date.now() - start
      const endMemory = process.memoryUsage()
      
      const logger = this.container_.resolve(ContainerRegistrationKeys.LOGGER)
      logger.debug(`Query ${queryName} completed: ${JSON.stringify({
        duration: `${duration}ms`,
        memoryDelta: `${Math.round((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024)}MB`
      })}`)
      
      return result
    } catch (error) {
      const logger = this.container_.resolve(ContainerRegistrationKeys.LOGGER)
      logger.error(`Query ${queryName} failed: ${error.message}`)
      throw error
    }
  }
}
```