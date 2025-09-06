# MedusaJS v2 Data Models Guide

## Data Model Fundamentals

Data models in MedusaJS v2 represent database tables using Medusa's Data Modeling Language (DML). They are the foundation for storing and managing data within modules, providing a type-safe, declarative approach to database schema definition.

### Core Characteristics
- **Database Representation**: Each data model represents a single database table
- **DML-Based**: Uses Medusa's Data Modeling Language for definitions
- **Module-Scoped**: Defined within a module's `models/` directory
- **Auto-Generated Properties**: Automatically includes `created_at`, `updated_at`, and `deleted_at`
- **Snake Case Convention**: Table names use snake_case format

### Basic Model Definition

```typescript
import { model } from "@medusajs/framework/utils"

const BlogPost = model.define("blog_post", {
  id: model.id().primaryKey(),
  title: model.text(),
  content: model.text(),
  published: model.boolean().default(false),
})

export default BlogPost
```

## Property Types and Configuration

### Available Property Types

**Identifier Properties**:
```typescript
id: model.id().primaryKey()  // Auto-generated unique string ID
```

**Text Properties**:
```typescript
title: model.text()                    // String property
description: model.text().nullable()   // Optional string
slug: model.text().unique()           // Unique string
searchable_content: model.text().searchable()  // Full-text searchable
```

**Numeric Properties**:
```typescript
quantity: model.number()              // Integer property
rating: model.float()                 // Decimal number (less precise)
price: model.bigNumber()              // High-precision (recommended for money)
weight: model.number().nullable()     // Optional number
```

**Boolean Properties**:
```typescript
is_active: model.boolean().default(true)     // Boolean with default
is_featured: model.boolean().nullable()      // Optional boolean
```

**Enumeration Properties**:
```typescript
status: model.enum(["draft", "published", "archived"]).default("draft")
priority: model.enum(["low", "medium", "high"])
```

**Date and Time Properties**:
```typescript
published_at: model.dateTime().nullable()    // Timestamp property
expires_at: model.dateTime()                 // Required timestamp
```

**Complex Data Properties**:
```typescript
metadata: model.json()                       // JSON object storage
tags: model.array()                         // Array of strings
```

### Property Configuration Methods

**Database Constraints**:
```typescript
email: model.text().unique()                 // Unique constraint
code: model.text().index()                   // Database index
name: model.text().searchable()              // Full-text search index
```

**Value Constraints**:
```typescript
price: model.bigNumber().nullable()          // Allow null values
status: model.enum(["active", "inactive"]).default("active")  // Default value
```

**Validation and Checks**:
```typescript
// Length constraints (implemented via database checks)
title: model.text().checks(c => c.length <= 255)
description: model.text().checks(c => c.length <= 1000)
```

### Default Model Properties

Every data model automatically includes:
```typescript
// These are added automatically, don't define them
created_at: model.dateTime().default("now")
updated_at: model.dateTime().default("now") 
deleted_at: model.dateTime().nullable()      // For soft deletion
```

## Data Model Relationships

### Same-Module Relationships

**One-to-Many Relationship**:
```typescript
// Author model
const Author = model.define("author", {
  id: model.id().primaryKey(),
  name: model.text(),
  posts: model.hasMany(() => BlogPost, {
    mappedBy: "author"
  })
})

// BlogPost model
const BlogPost = model.define("blog_post", {
  id: model.id().primaryKey(),
  title: model.text(),
  author: model.belongsTo(() => Author, {
    mappedBy: "posts"
  }),
  author_id: model.text()  // Foreign key
})
```

**One-to-One Relationship**:
```typescript
// User model
const User = model.define("user", {
  id: model.id().primaryKey(),
  email: model.text().unique(),
  profile: model.hasOne(() => UserProfile, {
    mappedBy: "user"
  })
})

// UserProfile model
const UserProfile = model.define("user_profile", {
  id: model.id().primaryKey(),
  bio: model.text().nullable(),
  user: model.belongsTo(() => User, {
    mappedBy: "profile"
  }),
  user_id: model.text()
})
```

**Many-to-Many Relationship**:
```typescript
// Product model
const Product = model.define("product", {
  id: model.id().primaryKey(),
  title: model.text(),
  categories: model.manyToMany(() => Category, {
    mappedBy: "products",
    pivotTable: "product_categories"  // Optional custom table name
  })
})

// Category model
const Category = model.define("category", {
  id: model.id().primaryKey(),
  name: model.text(),
  products: model.manyToMany(() => Product, {
    mappedBy: "categories"
  })
})
```

### Cascading Operations

```typescript
const Author = model.define("author", {
  id: model.id().primaryKey(),
  name: model.text(),
  posts: model.hasMany(() => BlogPost, {
    mappedBy: "author",
    cascade: ["soft-remove", "remove"]  // Cascade soft and hard deletes
  })
})
```

## Database Migrations

### Automatic Migration Generation

```bash
# Generate migration for new data model
npx medusa db:generate blog-module

# Apply migrations
npx medusa db:migrate

# Rollback last migration
npx medusa db:rollback blog-module
```

### Manual Migration Creation

```typescript
// src/modules/blog/migrations/Migration20240101120000_create_blog_post.ts
import { Migration } from "@mikro-orm/migrations"

export class Migration20240101120000 extends Migration {
  async up(): Promise<void> {
    // Create table
    this.addSql(`
      create table if not exists "blog_post" (
        "id" varchar not null,
        "title" varchar not null,
        "content" text,
        "published" boolean not null default false,
        "author_id" varchar,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "blog_post_pkey" primary key ("id")
      );
    `)
    
    // Add indexes
    this.addSql(`create index "blog_post_published_idx" on "blog_post" ("published");`)
    this.addSql(`create index "blog_post_author_id_idx" on "blog_post" ("author_id");`)
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "blog_post" cascade;`)
  }
}
```

### Migration Best Practices

1. **Naming Convention**: Use timestamp prefix `Migration20240101120000_description.ts`
2. **Execution Order**: Migrations run in ascending filename order
3. **Rollback Safety**: Always implement proper `down()` methods
4. **Index Strategy**: Add indexes for frequently queried columns
5. **Data Migration**: Use separate migration scripts for complex data transformations

## Service Integration Patterns

### Service Factory Integration

```typescript
import { MedusaService } from "@medusajs/framework/utils"
import BlogPost from "./models/blog-post"
import Author from "./models/author"

class BlogModuleService extends MedusaService({
  BlogPost,
  Author,
}) {
  // Automatically generated methods:
  // - listBlogPosts(filters, config, sharedContext)
  // - retrieveBlogPost(id, config, sharedContext)
  // - createBlogPosts(data, sharedContext)
  // - updateBlogPosts(id, data, sharedContext)
  // - deleteBlogPosts(id, sharedContext)
  // - softDeleteBlogPosts(id, sharedContext)
  // - restoreBlogPosts(id, sharedContext)

  async getPublishedPosts(config = {}, sharedContext = {}) {
    return await this.listBlogPosts(
      { published: true },
      { 
        relations: ["author"],
        order: { created_at: "DESC" },
        ...config
      },
      sharedContext
    )
  }

  async createPostWithAuthor(postData: CreateBlogPostData, sharedContext = {}) {
    return await this.atomicPhase_(async (transactionManager) => {
      const author = await this.createAuthors({
        name: postData.authorName,
        email: postData.authorEmail
      }, sharedContext)

      return await this.createBlogPosts({
        ...postData,
        author_id: author.id
      }, sharedContext)
    }, sharedContext)
  }
}

export default BlogModuleService
```

## Advanced Data Model Patterns

### Soft Deletion Handling

```typescript
class BlogModuleService extends MedusaService({
  BlogPost,
}) {
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
}
```

### JSON Property Patterns

```typescript
// Model with JSON metadata
const Product = model.define("product", {
  id: model.id().primaryKey(),
  title: model.text(),
  specifications: model.json(),  // Stored as JSON
  tags: model.array()           // Array of strings
})

// Service methods for JSON handling
class ProductService extends MedusaService({ Product }) {
  async updateSpecifications(
    id: string, 
    specs: Record<string, any>, 
    sharedContext = {}
  ) {
    const product = await this.retrieveProduct(id, {}, sharedContext)
    
    return await this.updateProducts(id, {
      specifications: {
        ...product.specifications,
        ...specs
      }
    }, sharedContext)
  }

  async addTag(id: string, tag: string, sharedContext = {}) {
    const product = await this.retrieveProduct(id, {}, sharedContext)
    const currentTags = product.tags || []
    
    if (!currentTags.includes(tag)) {
      return await this.updateProducts(id, {
        tags: [...currentTags, tag]
      }, sharedContext)
    }
    
    return product
  }
}
```

## Cross-Module Data Access

While data models are module-scoped, cross-module access uses the Query API:

```typescript
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

class BlogService extends MedusaService({ BlogPost }) {
  async getPostWithProductData(postId: string, req: MedusaRequest) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    // Query across modules using module links
    const result = await query.graph({
      entity: "blog_post",
      fields: ["*", "linked_products.*", "linked_products.variants.*"],
      filters: { id: postId },
      context: {
        linked_products: {
          variants: {
            calculated_price: QueryContext({
              region_id: req.headers["region_id"],
              currency_code: req.headers["currency_code"]
            })
          }
        }
      }
    })

    return result[0]
  }
}
```