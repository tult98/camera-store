# MedusaJS v2 Database Patterns Guide

## Database Operations with MikroORM

MedusaJS v2 uses MikroORM as the Object-Relational Mapping (ORM) tool. Understanding proper database patterns is crucial for building performant and maintainable applications.

### Core Query Patterns

#### Basic Query Operations

```typescript
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/framework/utils"

class BlogModuleService extends MedusaService({
  BlogPost,
}) {
  // For standard queries
  @InjectManager()
  async findBlogPost(
    id: string,
    @MedusaContext() sharedContext = {}
  ) {
    return await this.blogPostService_.retrieve(id, {
      relations: ["author"]
    }, sharedContext)
  }

  // For transactional operations
  @InjectTransactionManager()
  async publishPost(
    id: string,
    @MedusaContext() sharedContext = {}
  ) {
    const post = await this.blogPostService_.retrieve(id, {}, sharedContext)
    
    return await this.blogPostService_.update(
      id,
      { published: true, published_at: new Date() },
      sharedContext
    )
  }
}
```

#### Complex Query Building

```typescript
class ProductService extends MedusaService({ Product }) {
  async searchProducts(searchTerm: string, sharedContext = {}) {
    // Use searchable fields for full-text search
    const query = this.repository_.createQueryBuilder("product")
      .where("product.title ILIKE :search", { search: `%${searchTerm}%` })
      .orWhere("product.description ILIKE :search", { search: `%${searchTerm}%` })
      .orderBy("product.created_at", "DESC")
      .limit(20)

    return await query.getMany()
  }

  async getProductsWithMetrics(filters = {}, sharedContext = {}) {
    // Efficient query with specific field selection
    return await this.listProducts(
      filters,
      {
        select: ["id", "title", "published", "created_at"],
        relations: ["author"],
        order: { created_at: "DESC" },
        take: 50  // Limit results
      },
      sharedContext
    )
  }
}
```

## Query Context and Pricing

### Pricing Context Pattern

Always include pricing context when querying products to ensure accurate price calculations:

```typescript
// Backend API endpoint
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  const result = await query.graph({
    entity: "product",
    fields: ["*", "variants.*", "variants.calculated_price.*"],
    filters: { categories: { id: categoryId } },
    context: {
      variants: {
        calculated_price: QueryContext({
          region_id: req.headers["region_id"],
          currency_code: req.headers["currency_code"]
        })
      }
    }
  })
  
  return result
}
```

### Graph Query Patterns

```typescript
// Cross-module queries using Graph API
class OrderService {
  async getOrderWithFullDetails(orderId: string, req: MedusaRequest) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    return await query.graph({
      entity: "order",
      fields: [
        "*",
        "customer.*",
        "items.*",
        "items.product.*",
        "items.variant.*",
        "shipping_address.*",
        "billing_address.*"
      ],
      filters: { id: orderId },
      context: {
        items: {
          variant: {
            calculated_price: QueryContext({
              region_id: req.headers["region_id"],
              currency_code: req.headers["currency_code"]
            })
          }
        }
      }
    })
  }
}
```

## Transaction Management

### Atomic Transactions

```typescript
class OrderService extends MedusaService({
  Order,
  OrderItem,
}) {
  async createOrderWithItems(orderData: CreateOrderData, sharedContext = {}) {
    return await this.atomicPhase_(async (transactionManager) => {
      // Create order
      const order = await this.createOrders({
        customer_id: orderData.customer_id,
        currency_code: orderData.currency_code,
        region_id: orderData.region_id
      }, sharedContext)

      // Create order items within same transaction
      const items = await Promise.all(
        orderData.items.map(item => 
          this.createOrderItems({
            order_id: order.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            unit_price: item.unit_price
          }, sharedContext)
        )
      )

      return { order, items }
    }, sharedContext)
  }
}
```

### Manual Transaction Management

```typescript
class InventoryService extends MedusaService({
  InventoryItem,
  InventoryMovement,
}) {
  async adjustInventory(itemId: string, quantity: number, reason: string) {
    const manager = this.container_.resolve("manager")
    
    return await manager.transaction(async (transactionManager) => {
      const sharedContext = { transactionManager }
      
      // Update inventory item
      await this.updateInventoryItems(itemId, {
        quantity: quantity
      }, sharedContext)
      
      // Create movement record
      await this.createInventoryMovements({
        item_id: itemId,
        quantity: quantity,
        reason: reason,
        created_at: new Date()
      }, sharedContext)
      
      return { success: true }
    })
  }
}
```

## Performance Optimization Patterns

### Batch Operations

```typescript
class ProductService extends MedusaService({ Product }) {
  // Efficient batch operations
  async createMultipleProducts(productsData: CreateProductData[], sharedContext = {}) {
    // Use bulk insert for better performance
    return await this.createProducts(productsData, sharedContext)
  }

  async updateMultipleProducts(updates: { id: string; data: any }[], sharedContext = {}) {
    return await this.atomicPhase_(async (transactionManager) => {
      const results = await Promise.all(
        updates.map(({ id, data }) => 
          this.updateProducts(id, data, sharedContext)
        )
      )
      return results
    }, sharedContext)
  }
}
```

### Pagination Patterns

```typescript
class BlogService extends MedusaService({ BlogPost }) {
  async getPaginatedPosts(
    page = 1, 
    limit = 20, 
    filters = {}, 
    sharedContext = {}
  ) {
    const offset = (page - 1) * limit
    
    const [posts, total] = await Promise.all([
      this.listBlogPosts(filters, {
        skip: offset,
        take: limit,
        order: { created_at: "DESC" }
      }, sharedContext),
      this.listBlogPosts(filters, { count: true }, sharedContext)
    ])

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}
```

### Query Optimization

```typescript
class OptimizedService extends MedusaService({ BlogPost }) {
  // Optimized relationship loading
  async getPostWithFullDetails(id: string, sharedContext = {}) {
    return await this.retrieveBlogPost(id, {
      relations: ["author", "categories", "comments"],
      relationLoadStrategy: "joined"  // Single query vs N+1
    }, sharedContext)
  }

  // Efficient field selection
  async getPostSummaries(filters = {}, sharedContext = {}) {
    return await this.listBlogPosts(filters, {
      select: ["id", "title", "excerpt", "created_at"],
      order: { created_at: "DESC" },
      take: 100
    }, sharedContext)
  }
}
```

## Advanced Query Patterns

### Aggregation Queries

```typescript
class AnalyticsService {
  async getOrderStatistics(dateRange: { start: Date; end: Date }, sharedContext = {}) {
    const manager = this.container_.resolve("manager")
    
    const result = await manager.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total) as total_revenue,
        AVG(total) as average_order_value,
        COUNT(DISTINCT customer_id) as unique_customers
      FROM orders 
      WHERE created_at BETWEEN $1 AND $2
        AND status = 'completed'
    `, [dateRange.start, dateRange.end])
    
    return result[0]
  }

  async getTopProducts(limit = 10, sharedContext = {}) {
    const manager = this.container_.resolve("manager")
    
    return await manager.query(`
      SELECT 
        p.id,
        p.title,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.unit_price) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
      GROUP BY p.id, p.title
      ORDER BY total_sold DESC
      LIMIT $1
    `, [limit])
  }
}
```

### Custom Repository Methods

```typescript
// Custom repository with specialized queries
@Repository()
class ProductRepository extends MedusaRepository<Product> {
  async findProductsWithLowStock(threshold = 10): Promise<Product[]> {
    return this.createQueryBuilder("product")
      .innerJoinAndSelect("product.variants", "variant")
      .where("variant.inventory_quantity < :threshold", { threshold })
      .getMany()
  }

  async findProductsByPriceRange(
    minPrice: number, 
    maxPrice: number,
    currency = "usd"
  ): Promise<Product[]> {
    return this.createQueryBuilder("product")
      .innerJoinAndSelect("product.variants", "variant")
      .innerJoinAndSelect("variant.prices", "price")
      .where("price.currency_code = :currency", { currency })
      .andWhere("price.amount BETWEEN :minPrice AND :maxPrice", {
        minPrice: minPrice * 100, // Convert to cents
        maxPrice: maxPrice * 100
      })
      .getMany()
  }

  async getProductSalesData(productId: string): Promise<any> {
    return this.manager.query(`
      SELECT 
        DATE_TRUNC('month', o.created_at) as month,
        SUM(oi.quantity) as units_sold,
        SUM(oi.quantity * oi.unit_price) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.product_id = $1
        AND o.status = 'completed'
      GROUP BY DATE_TRUNC('month', o.created_at)
      ORDER BY month DESC
    `, [productId])
  }
}
```

## Soft Deletion Patterns

### Handling Soft Deleted Records

```typescript
class BlogModuleService extends MedusaService({ BlogPost }) {
  // Soft delete (sets deleted_at timestamp)
  async archivePost(id: string, sharedContext = {}) {
    return await this.softDeleteBlogPosts(id, sharedContext)
  }

  // Restore soft-deleted record
  async restorePost(id: string, sharedContext = {}) {
    return await this.restoreBlogPosts(id, sharedContext)
  }

  // Include soft-deleted records in queries
  async getAllPosts(includeDeleted = false, sharedContext = {}) {
    const config = includeDeleted 
      ? { withDeleted: true }
      : {}
    
    return await this.listBlogPosts({}, config, sharedContext)
  }

  // Permanently delete records
  async permanentlyDeletePost(id: string, sharedContext = {}) {
    const manager = this.container_.resolve("manager")
    
    return await manager.transaction(async (transactionManager) => {
      // First soft delete to trigger any cascade operations
      await this.softDeleteBlogPosts(id, { transactionManager })
      
      // Then permanently remove
      await transactionManager.nativeDelete("BlogPost", { id })
    })
  }
}
```

## Database Migrations

### Migration Patterns

```typescript
// Complex migration with data transformation
export class Migration20240101120000 extends Migration {
  async up(): Promise<void> {
    // Create new table
    this.addSql(`
      create table if not exists "product_reviews" (
        "id" varchar not null,
        "product_id" varchar not null,
        "customer_id" varchar not null,
        "rating" integer not null,
        "comment" text,
        "verified_purchase" boolean not null default false,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "product_reviews_pkey" primary key ("id")
      );
    `)
    
    // Add indexes for performance
    this.addSql(`create index "product_reviews_product_id_idx" on "product_reviews" ("product_id");`)
    this.addSql(`create index "product_reviews_rating_idx" on "product_reviews" ("rating");`)
    this.addSql(`create index "product_reviews_created_at_idx" on "product_reviews" ("created_at");`)
    
    // Migrate existing data
    this.addSql(`
      INSERT INTO product_reviews (id, product_id, customer_id, rating, comment)
      SELECT 
        gen_random_uuid(),
        product_id,
        customer_id,
        CASE 
          WHEN feedback_score >= 4 THEN 5
          WHEN feedback_score >= 3 THEN 4
          WHEN feedback_score >= 2 THEN 3
          WHEN feedback_score >= 1 THEN 2
          ELSE 1
        END as rating,
        feedback_text
      FROM legacy_product_feedback
      WHERE feedback_text IS NOT NULL;
    `)
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "product_reviews" cascade;`)
  }
}
```

## Connection Management

### Database Connection Patterns

```typescript
// Custom connection configuration
export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseExtra: {
      pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
      // Enable query logging in development
      ...(process.env.NODE_ENV === "development" && {
        debug: true,
        logger: (message: string) => {
          console.log("[DB Query]", message)
        }
      })
    }
  }
})
```

### Health Check Patterns

```typescript
// Database health check service
class DatabaseHealthService {
  private manager: EntityManager

  constructor({ manager }: { manager: EntityManager }) {
    this.manager = manager
  }

  async checkHealth(): Promise<{ status: string; details: any }> {
    try {
      // Simple query to test connection
      const result = await this.manager.query("SELECT 1 as health_check")
      
      // Test transaction capability
      await this.manager.transaction(async (transactionManager) => {
        await transactionManager.query("SELECT 1")
      })

      return {
        status: "healthy",
        details: {
          connection: "active",
          transactions: "working",
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        status: "unhealthy",
        details: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }
    }
  }
}
```