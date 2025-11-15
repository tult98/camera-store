# Database Patterns with Prisma

## Overview

Prisma is configured to connect to the shared PostgreSQL database (the same database used by the MedusaJS backend). The core-api uses Prisma primarily for **read-only queries** since the MedusaJS backend owns the database migrations.

## Database Configuration

The DATABASE_URL is configured in `apps/core-api/.env`:

```bash
DATABASE_URL="postgresql://postgres:password@host:port/database"
```

## File Structure

```
apps/core-api/
├── prisma/
│   └── schema.prisma              # Prisma schema (auto-generated from db pull)
├── prisma.config.ts               # Prisma configuration
├── src/
│   ├── database/
│   │   ├── prisma.service.ts     # PrismaService (extends PrismaClient)
│   │   └── database.module.ts    # DatabaseModule (global)
│   └── generated/
│       └── prisma/                # Generated Prisma Client (gitignored)
└── .env                           # Contains DATABASE_URL
```

## Available Commands

### Using Nx

```bash
# Generate Prisma Client (run after schema changes)
nx run core-api:prisma:generate

# Pull latest database schema from the database
nx run core-api:prisma:pull

# Open Prisma Studio (database GUI)
nx run core-api:prisma:studio

# Format the Prisma schema file
nx run core-api:prisma:format
```

### Using npx directly

```bash
cd apps/core-api

# Generate Prisma Client
npx prisma generate

# Pull database schema
npx prisma db pull

# Open Prisma Studio
npx prisma studio

# Format schema
npx prisma format
```

## PrismaService Setup

The `PrismaService` is globally available through dependency injection.

### Service Implementation

```typescript
// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Module Registration

```typescript
// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
```

Add to `app.module.ts`:

```typescript
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    // ... other imports
  ],
})
export class AppModule {}
```

## Usage in Services

### Basic Injection

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts() {
    return await this.prisma.product.findMany();
  }
}
```

## Query Patterns

### Find Many with Filters

```typescript
async getPublishedProducts() {
  return await this.prisma.product.findMany({
    where: {
      status: 'published',
      deleted_at: null,
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 20,
  });
}
```

### Find Unique

```typescript
async getProductById(id: string) {
  return await this.prisma.product.findUnique({
    where: { id },
  });
}
```

### Find First

```typescript
async getProductByHandle(handle: string) {
  return await this.prisma.product.findFirst({
    where: { handle },
  });
}
```

### Include Relations

```typescript
async getProductWithVariants(id: string) {
  return await this.prisma.product.findUnique({
    where: { id },
    include: {
      product_variants: true,
      product_images: true,
      product_categories: {
        include: {
          category: true,
        },
      },
    },
  });
}
```

### Select Specific Fields

```typescript
async getProductNames() {
  return await this.prisma.product.findMany({
    select: {
      id: true,
      title: true,
      handle: true,
    },
  });
}
```

### Pagination

```typescript
async getProductsPaginated(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    this.prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    this.prisma.product.count(),
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### Count

```typescript
async countPublishedProducts() {
  return await this.prisma.product.count({
    where: {
      status: 'published',
    },
  });
}
```

### Aggregation

```typescript
async getProductStats() {
  return await this.prisma.product.aggregate({
    _count: { id: true },
    _avg: { weight: true },
    _sum: { weight: true },
    _min: { created_at: true },
    _max: { created_at: true },
  });
}
```

### Group By

```typescript
async getProductsByStatus() {
  return await this.prisma.product.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
  });
}
```

### Raw Queries

For complex queries not supported by Prisma's query builder:

```typescript
async getCustomQuery() {
  return await this.prisma.$queryRaw`
    SELECT p.*, COUNT(pv.id) as variant_count
    FROM product p
    LEFT JOIN product_variant pv ON p.id = pv.product_id
    WHERE p.status = 'published'
    GROUP BY p.id
  `;
}
```

### Transactions

```typescript
async performMultipleOperations() {
  return await this.prisma.$transaction(async (prisma) => {
    const products = await prisma.product.findMany({
      where: { status: 'draft' },
    });

    const count = await prisma.product.count({
      where: { status: 'published' },
    });

    return { products, count };
  });
}
```

## Advanced Patterns

### Dynamic Filters

```typescript
interface ProductFilters {
  status?: string;
  category_id?: string;
  search?: string;
}

async getFilteredProducts(filters: ProductFilters) {
  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.category_id) {
    where.product_categories = {
      some: {
        category_id: filters.category_id,
      },
    };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return await this.prisma.product.findMany({ where });
}
```

### Cursor-Based Pagination

```typescript
async getProductsCursor(cursor?: string, limit: number = 20) {
  const products = await this.prisma.product.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { created_at: 'desc' },
  });

  return {
    data: products,
    nextCursor: products.length === limit ? products[products.length - 1].id : null,
  };
}
```

### Batch Operations

```typescript
async getProductsByIds(ids: string[]) {
  return await this.prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}
```

### Soft Deletes

```typescript
async getActiveProducts() {
  return await this.prisma.product.findMany({
    where: {
      deleted_at: null,
    },
  });
}
```

## Schema Synchronization

When the backend team adds new migrations:

1. Pull the latest schema from the database:
```bash
nx run core-api:prisma:pull
```

2. Regenerate the Prisma Client:
```bash
nx run core-api:prisma:generate
```

3. Verify the changes in `prisma/schema.prisma`

## Read-Only Best Practices

Since the MedusaJS backend owns database migrations (using MikroORM), the core-api should primarily use Prisma for:

### Recommended Use Cases

- **Queries** (SELECT operations)
- **Reporting** and analytics
- **Background jobs** that read data
- **Data aggregation** for dashboards
- **Complex joins** not easily done through MedusaJS APIs

### Avoid

- **Migrations**: Never create migrations in core-api to prevent conflicts with the backend
- **Direct writes**: Prefer using MedusaJS workflows or APIs for data modifications
- **Schema changes**: All schema changes should be made through MedusaJS backend

### When to Write Data

If you must write data in core-api:

1. Use MedusaJS remote query when possible
2. Document the reason for direct writes
3. Coordinate with the backend team
4. Consider using workflows instead

## Prisma Studio

Open Prisma Studio for a GUI to browse and query your database:

```bash
nx run core-api:prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- Browse all tables
- View and filter data
- Execute queries
- Inspect relationships

## Error Handling

### Handle Not Found

```typescript
async getProductOrThrow(id: string) {
  const product = await this.prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  return product;
}
```

### Handle Unique Constraint Violations

```typescript
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

async createRecord(data: any) {
  try {
    return await this.prisma.product.create({ data });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Record already exists');
      }
    }
    throw error;
  }
}
```

## Troubleshooting

### "Cannot find module '../generated/prisma'"

Run Prisma generate:
```bash
nx run core-api:prisma:generate
```

### "Environment variable DATABASE_URL not found"

Make sure `DATABASE_URL` is set in `apps/core-api/.env` and that `dotenv/config` is imported in `prisma.config.ts`.

### Schema out of sync

If the backend has new migrations:
```bash
nx run core-api:prisma:pull
nx run core-api:prisma:generate
```

### Connection errors

Check that:
- PostgreSQL is running
- DATABASE_URL has correct credentials
- Database exists and is accessible
- Network connectivity is available

## Generated Files

The Prisma Client is generated in `src/generated/prisma/` and is already added to `.gitignore`. Never commit generated files.

After running `prisma generate`, you'll have access to:
- Type-safe database client
- Auto-generated types for all models
- IntelliSense support in your IDE
