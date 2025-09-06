# MedusaJS v2 Module Links Guide

## Overview

Module Links in MedusaJS v2 create associations between data models from different modules while maintaining module isolation. They enable building "virtual relations" between custom data models and Commerce Module data models without breaking the modular architecture.

## Key Concepts

### Purpose and Design
- **Cross-Module Relationships**: Create data associations between different modules
- **Maintain Isolation**: Preserve module boundaries and separation of concerns  
- **Virtual Relations**: Enable flexible data relationships without tight coupling
- **Database Independence**: No foreign key constraints for maximum flexibility

### Implementation Location
- Located in `src/links/` directory
- Created using `defineLink()` function from Modules SDK
- Automatically generates link tables in the database

## Database Structure

### Link Table Characteristics
- **Naming Convention**: `module1_table1_module2_table2`
- **Structure**: Two columns storing linked record IDs
- **No Constraints**: No foreign key constraints for flexibility
- **Example**: `product_product_blog_post` for Product-BlogPost links

## Creating Module Links

### Basic Link Definition
```typescript
// src/links/product-blog.ts
import { defineLink } from "@medusajs/framework/utils"
import { ProductModule } from "@medusajs/framework/product"
import { BLOG_MODULE } from "../modules/blog"

export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: BLOG_MODULE.linkable.blog_post,
    deleteCascade: ["blog_post"]
  }
)
```

### Advanced Link Configuration
```typescript
// Many-to-many relationship with cascade deletion
export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true
  },
  {
    linkable: BLOG_MODULE.linkable.blog_post,
    isList: true,
    deleteCascade: true
  }
)
```

## Configuration Options

### Relationship Types
- **One-to-One** (default): Each record links to one other record
- **One-to-Many**: Set `isList: true` on one side
- **Many-to-Many**: Set `isList: true` on both sides

### Cascade Options
- **deleteCascade**: Automatically delete linked records when primary is deleted
- **Array notation**: `deleteCascade: ["related_entity"]` for specific entities

## Database Management

### After Creating Links
```bash
# Synchronize link definitions
nx run backend:migrate

# Or use direct command
npx medusa db:migrate
```

### Link Table Structure
```sql
-- Auto-generated table structure
CREATE TABLE product_product_blog_post (
  id VARCHAR NOT NULL PRIMARY KEY,
  product_id VARCHAR NOT NULL,
  blog_post_id VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Querying Linked Data

### Using Query API
```typescript
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

class ProductService {
  async getProductWithBlogPosts(productId: string, req: MedusaRequest) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    const result = await query.graph({
      entity: "product",
      fields: ["*", "blog_posts.*"],
      filters: { id: productId }
    })
    
    return result
  }
}
```

### In API Endpoints
```typescript
// src/api/products/[id]/blog-posts/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  const data = await query.graph({
    entity: "product",
    fields: ["id", "title", "blog_posts.*"],
    filters: { id: req.params.id }
  })
  
  res.json({ product: data[0] })
}
```

## Integration Patterns

### With Commerce Modules
```typescript
// Link custom loyalty module to customers
export default defineLink(
  Modules.CUSTOMER.linkable.customer,
  {
    linkable: LOYALTY_MODULE.linkable.loyalty_account,
    deleteCascade: true
  }
)
```

### Between Custom Modules
```typescript
// Link product attributes to custom categories
export default defineLink(
  PRODUCT_ATTRIBUTES_MODULE.linkable.attribute,
  {
    linkable: CUSTOM_CATEGORY_MODULE.linkable.category,
    isList: true
  }
)
```

## Best Practices

### When to Use Module Links
- **Cross-Module Relationships**: Need data associations between different modules
- **Extending Commerce Modules**: Add custom data relationships to built-in modules
- **Flexible Integrations**: Build loosely-coupled module integrations
- **Preserving Modularity**: Maintain module isolation while enabling data relationships

### When NOT to Use Module Links
- **Same Module Relationships**: Use data model relationships within same module
- **Simple Extensions**: Consider if a single expanded module would be simpler
- **Performance Critical**: Direct relationships may be faster for high-frequency queries

### Design Guidelines
- **Single Responsibility**: Each link should serve one clear relationship purpose
- **Naming Convention**: Use descriptive, consistent link file names
- **Documentation**: Document the business purpose of each link
- **Testing**: Include link relationships in integration tests

## Common Link Patterns

### Product Enhancement Links
```typescript
// Product reviews
export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: REVIEW_MODULE.linkable.review,
    isList: true
  }
)

// Product specifications  
export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: SPECIFICATION_MODULE.linkable.specification,
    isList: true,
    deleteCascade: true
  }
)
```

### Customer Relationship Links
```typescript
// Customer preferences
export default defineLink(
  Modules.CUSTOMER.linkable.customer,
  {
    linkable: PREFERENCE_MODULE.linkable.preference,
    deleteCascade: true
  }
)

// Customer addresses (if extending beyond built-in)
export default defineLink(
  Modules.CUSTOMER.linkable.customer,
  {
    linkable: ADDRESS_MODULE.linkable.extended_address,
    isList: true,
    deleteCascade: true
  }
)
```

## Performance Considerations

### Query Optimization
- **Field Selection**: Only select needed fields in graph queries
- **Proper Indexing**: Index commonly queried link table columns
- **Batch Operations**: Use bulk operations for multiple link creation/updates
- **Caching Strategy**: Cache frequently accessed link relationships

### Scalability Patterns
```typescript
// Efficient bulk link creation
async createProductLinks(productId: string, blogPostIds: string[]) {
  const linkData = blogPostIds.map(postId => ({
    product_id: productId,
    blog_post_id: postId
  }))
  
  // Use batch insert for better performance
  return await this.bulkCreateLinks(linkData)
}
```

## Error Handling

### Link Creation Validation
```typescript
async createProductBlogLink(productId: string, blogPostId: string) {
  // Validate entities exist before linking
  const product = await this.productService_.retrieve(productId)
  const blogPost = await this.blogService_.retrieve(blogPostId)
  
  if (!product || !blogPost) {
    throw new Error("Cannot link non-existent entities")
  }
  
  return await this.createLink(productId, blogPostId)
}
```

### Cascade Deletion Safety
```typescript
// Handle cascade deletion gracefully
async deleteProduct(productId: string) {
  try {
    // Links with deleteCascade will be automatically removed
    await this.productService_.delete(productId)
  } catch (error) {
    this.logger_.error(`Failed to delete product ${productId}: ${error.message}`)
    throw new Error("Product deletion failed")
  }
}
```