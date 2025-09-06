# MedusaJS v2 Module Architecture

## Module Fundamentals

A module in MedusaJS v2 is "a reusable package of functionalities related to a single domain or integration." Modules are the primary way to:
- Integrate custom business logic without affecting existing setup
- Create reusable functionality across Medusa projects  
- Build domain-specific features with proper isolation
- Connect to third-party services and APIs

## Core Module Structure

Every module follows a consistent directory structure:

```
src/modules/your-module/
├── index.ts          # Module definition and exports
├── service.ts        # Main service extending MedusaService
├── models/           # Data models using Medusa DML
│   └── model.ts
├── services/         # Internal services (optional)
│   ├── index.ts
│   └── helper.ts
├── loaders/          # Initialization functions
│   └── loader.ts
└── migrations/       # Database migrations
    └── *.ts
```

## Service Factory Pattern

The main service extends `MedusaService` to automatically generate CRUD methods:

```typescript
import { MedusaService } from "@medusajs/framework/utils"
import BlogPost from "./models/blog-post"

type InjectedDependencies = {
  // Internal services can be injected here
}

class BlogModuleService extends MedusaService({
  BlogPost,
}) {
  constructor(container: InjectedDependencies) {
    super(...arguments)
  }

  // Custom methods can be added here
  async getPublishedPosts() {
    return await this.listBlogPosts({
      published: true
    })
  }
}

export default BlogModuleService
```

The service factory automatically generates methods like:
- `listBlogPosts(filters, config)`
- `createBlogPosts(data)`
- `updateBlogPosts(id, data)`
- `deleteBlogPosts(id)`
- `softDeleteBlogPosts(id)`
- `restoreBlogPosts(id)`

## Module Definition and Registration

The module's `index.ts` defines the module configuration:

```typescript
import BlogModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BLOG_MODULE = "blogModuleService"

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
})

export * from "./models/blog-post"
```

Register the module in `medusa-config.ts`:

```typescript
export default defineConfig({
  modules: [
    {
      resolve: "./src/modules/blog",
      key: BLOG_MODULE
    }
  ]
})
```

## Module Options and Configuration

Modules can accept configuration options for customization:

```typescript
// In medusa-config.ts
modules: [
  {
    resolve: "./src/modules/blog",
    options: {
      enableAutoPublish: true,
      maxPostLength: 5000
    }
  }
]

// In service.ts
interface ModuleOptions {
  enableAutoPublish?: boolean
  maxPostLength?: number
}

class BlogModuleService extends MedusaService({
  BlogPost,
}) {
  protected options_: ModuleOptions

  constructor(
    container: InjectedDependencies,
    options: ModuleOptions = {}
  ) {
    super(...arguments)
    this.options_ = options
  }
}
```

## Module Loaders

Loaders initialize resources when the application starts:

```typescript
// src/modules/blog/loaders/initialize.ts
import { LoaderOptions } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function blogLoader({
  container,
  options,
}: LoaderOptions) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  
  // Initialize external connections
  // Register additional services
  // Validate configuration
  
  logger.info("Blog module initialized successfully")
}

// Export in module's index.ts
export default Module(BLOG_MODULE, {
  service: BlogModuleService,
  loaders: [blogLoader]
})
```

## Multiple Services Pattern

A module can have internal services for complex functionality:

```typescript
// src/modules/blog/services/content-processor.ts
export class ContentProcessorService {
  async processMarkdown(content: string): Promise<string> {
    // Process markdown content
    return processedContent
  }
  
  async generateExcerpt(content: string, length: number = 150): Promise<string> {
    return content.substring(0, length) + "..."
  }
}

// src/modules/blog/services/index.ts
export * from "./content-processor"

// In main service.ts
import { ContentProcessorService } from "./services"

type InjectedDependencies = {
  contentProcessorService: ContentProcessorService
}

class BlogModuleService extends MedusaService({
  BlogPost,
}) {
  protected contentProcessor_: ContentProcessorService

  constructor({ contentProcessorService }: InjectedDependencies) {
    super(...arguments)
    this.contentProcessor_ = contentProcessorService
  }

  async createPost(data: CreateBlogPostData) {
    const processedContent = await this.contentProcessor_.processMarkdown(
      data.content
    )
    const excerpt = await this.contentProcessor_.generateExcerpt(
      processedContent
    )

    return await this.createBlogPosts({
      ...data,
      content: processedContent,
      excerpt
    })
  }
}
```

## Module Isolation and Interaction

Modules are isolated by design - they cannot directly access other modules' resources. Interaction happens through:

1. **Module Links**: For data model relationships
2. **Query API**: For cross-module data retrieval  
3. **Workflows**: For cross-module business logic

```typescript
// Using Query to access other modules
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

class BlogModuleService extends MedusaService({
  BlogPost,
}) {
  async getPostsWithCustomerData(customerId: string) {
    const query = this.container_.resolve(ContainerRegistrationKeys.QUERY)
    
    // Query across modules safely
    const data = await query.graph({
      entity: "blog_post",
      fields: ["*"],
      filters: { customer_id: customerId }
    })
    
    return data
  }
}
```

## Module Types

**Commerce Modules**: Built-in modules providing core commerce functionality
- Product Module (`Modules.PRODUCT`)
- Order Module (`Modules.ORDER`)
- Customer Module (`Modules.CUSTOMER`)
- Cart Module (`Modules.CART`)
- Inventory Module (`Modules.INVENTORY`)

**Infrastructure Modules**: System-level functionality
- Cache Module
- Event Module  
- File Module
- Notification Module
- Workflow Engine Module

**Custom Modules**: Domain-specific business logic modules you create

## Best Practices for Module Development

1. **Single Responsibility**: Each module should handle one domain
2. **Proper Isolation**: Don't try to access other modules directly
3. **Use Service Factory**: Extend MedusaService for automatic CRUD
4. **Transaction Management**: Use decorators for database context
5. **Error Handling**: Implement proper error boundaries
6. **Type Safety**: Define interfaces for all data structures
7. **Loader Efficiency**: Keep loaders lightweight and fast
8. **Option Validation**: Validate module options in loaders

## Common Module Patterns

**Integration Module** (for third-party services):
```typescript
class IntegrationModuleService extends MedusaService({
  Integration,
}) {
  protected client_: ThirdPartyClient

  constructor(container: InjectedDependencies, options: ModuleOptions) {
    super(...arguments)
    this.client_ = new ThirdPartyClient(options.apiKey)
  }

  async syncData() {
    const externalData = await this.client_.fetchData()
    return await this.createIntegrations(externalData)
  }
}
```

**Domain Module** (for business logic):
```typescript
class InventoryModuleService extends MedusaService({
  InventoryItem,
  InventoryMovement,
}) {
  async adjustInventory(itemId: string, quantity: number, reason: string) {
    return await this.atomicPhase_(async (transactionManager) => {
      await this.updateInventoryItems(itemId, {
        quantity: quantity
      })
      
      await this.createInventoryMovements({
        item_id: itemId,
        quantity: quantity,
        reason: reason,
        created_at: new Date()
      })
    })
  }
}
```