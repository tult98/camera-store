---
name: core-api-helper
description: Expert guidance for the core-api application (NestJS) at apps/core-api/. Use when working with files in apps/core-api, building REST endpoints, background workers with BullMQ.
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Core API Helper

This skill provides implementation guidance for the **core-api** application located at `apps/core-api/`.

## When to Use This Skill

Use this skill when:
- Building REST API endpoints with NestJS controllers and services
- Creating background workers for async operations using BullMQ
- Implementing CLI commands for automation tasks
- Providing API contracts to the admin-dashboard frontend
- Working with any files in `apps/core-api/`

## Technology Stack

- **Framework**: NestJS v10 (TypeScript)
- **Database**: Prisma (read-only queries to shared PostgreSQL database)
- **Queue System**: BullMQ v5.63.1 with Redis
- **Queue Monitoring**: Bull Board (web UI at `/queues`)
- **Validation**: class-validator + class-transformer
- **Web Scraping**: Puppeteer v24 (for product crawler)
- **File Storage**: AWS SDK (S3/MinIO compatible)
- **Dev Server**: Port 3001

## Quick Start

### Development Commands

From repository root:

```bash
nx serve core-api           # Start dev server (port 3001)
nx build core-api           # Production build
nx start core-api           # Production server
nx dev-cli core-api -- <command>  # Run CLI command
nx lint core-api            # Run ESLint
nx type-check core-api      # TypeScript check
```

### Monitor Background Jobs

Access Bull Board queue monitoring at:
```
http://localhost:3001/queues
```

View job status, retry failed jobs, clear queues, and monitor performance.

## Feature Development

For complete module structure and organization patterns, see [architecture.md](architecture.md).

### Building REST APIs

For REST endpoint implementation, see [endpoint-patterns.md](endpoint-patterns.md):
- Complete CRUD examples with controllers, services, and DTOs
- Validation patterns with class-validator
- Error handling and custom exceptions
- Query parameters (pagination, filtering)
- File upload patterns
- Response transformation
- API contract documentation for admin-dashboard

### Background Workers

For async operations with BullMQ, see [worker-patterns.md](worker-patterns.md):
- Queue service setup and configuration
- Processor implementation with progress tracking
- Job options (priority, delays, retries, timeouts)
- Error handling and retry strategies
- Job scheduling with cron patterns
- Bulk operations and concurrency
- CLI commands for queue management
- Bull Board monitoring at `http://localhost:3001/queues`

### Database Operations

For database queries with Prisma, see [database-patterns.md](database-patterns.md):
- Prisma setup and configuration
- PrismaService dependency injection
- Read-only query patterns
- Schema synchronization with MedusaJS backend
- Prisma Studio for database GUI
- Common query examples and best practices

## Environment Configuration

```bash
# .env
# Database
DATABASE_URL="postgresql://postgres:password@host:port/database"

# Queue Infrastructure
REDIS_HOST=localhost
REDIS_PORT=6379

# S3/MinIO
S3_BUCKET=product-images
S3_ENDPOINT=http://localhost:9000
S3_FILE_URL=http://localhost:9000/product-images
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin

# App Config
PORT=3001
NODE_ENV=development
```

## Best Practices

- Always define DTOs with validation decorators
- Use proper HTTP status codes
- Provide clear error messages (never expose internals)
- Log operations with NestJS Logger
- Register queues in Bull Board for monitoring
- Test endpoints manually at `http://localhost:3001`
- When collaborating with admin-dashboard, provide complete API contracts
