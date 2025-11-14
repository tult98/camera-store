# Core API Architecture

## Overview

The core-api is a NestJS application providing backend services for the camera store admin dashboard. It operates in two modes: HTTP server and CLI tool.

## Technology Stack

### Core Framework
- **NestJS v10**: Progressive Node.js framework
- **TypeScript**: Type-safe JavaScript
- **Node.js**: >= 20

### Queue System
- **BullMQ v5.63.1**: Redis-based job queue
- **Redis**: Required for BullMQ
- **Bull Board**: Web UI for queue monitoring

### Additional Libraries
- **Commander.js**: CLI framework
- **class-validator**: DTO validation
- **class-transformer**: DTO transformation
- **Puppeteer v24**: Headless browser for web scraping
- **AWS SDK**: S3/MinIO file uploads
- **OpenAI API**: AI-powered content generation
- **Anthropic API**: Alternative AI provider

### Build & Development
- **Nx**: Monorepo task runner
- **Port**: 3001 (HTTP server)
- **Redis**: localhost:6379 (development)

## Dual Mode Operation

### Mode 1: HTTP Server

Main application mode - RESTful API server:

```bash
nx serve core-api
# Runs on http://localhost:3001
```

**Entry Point**: `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3001);
  console.log('Core API running on http://localhost:3001');
  console.log('Queue monitoring: http://localhost:3001/queues');
}

bootstrap();
```

### Mode 2: CLI Tool

Command-line interface for standalone operations:

```bash
nx dev-cli core-api -- crawl https://example.com/product
```

**Entry Point**: `src/cli.ts`

```typescript
import { Command } from 'commander';

const program = new Command();

program
  .name('core-api-cli')
  .description('Core API CLI Tools')
  .version('1.0.0');

program
  .command('crawl')
  .description('Crawl a product from a URL')
  .argument('<url>', 'Product URL to crawl')
  .action(async (url: string) => {
    console.log(`Crawling: ${url}`);
    // Implementation
  });

program.parse();
```

## Project Structure

```
apps/core-api/
├── src/
│   ├── main.ts                              # HTTP server entry
│   ├── cli.ts                               # CLI entry
│   ├── index.ts                             # CLI export
│   ├── app.module.ts                        # Root module
│   ├── app.controller.ts                    # Basic controller
│   │
│   ├── config/                              # Configuration
│   │   └── api.config.ts
│   │
│   ├── types/                               # Shared types
│   │   └── product-data.types.ts
│   │
│   ├── modules/                             # Feature modules
│   │   └── product/
│   │       ├── product.module.ts            # NestJS module
│   │       ├── product.controller.ts        # REST endpoints
│   │       ├── product.service.ts           # Business logic
│   │       ├── product-queue.service.ts     # BullMQ queue ops
│   │       ├── processors/
│   │       │   └── product-crawl.processor.ts  # Worker
│   │       └── dto/
│   │           ├── crawl-product.dto.ts     # Request DTOs
│   │           └── job-status.dto.ts        # Response DTOs
│   │
│   └── services/                            # Pure functions (not injectable)
│       ├── scraper.service.ts               # Puppeteer scraping
│       ├── product-api.service.ts           # MedusaJS integration
│       ├── s3-upload.service.ts             # S3/MinIO uploads
│       ├── html-template-generator.service.ts
│       ├── media-processor.service.ts
│       └── description-generator.service.ts
│
├── dist/                                     # Build output
├── nest-cli.json                            # NestJS CLI config
├── tsconfig.json                            # TypeScript config
└── project.json                             # Nx project config
```

## Module Architecture

### Root Module

**app.module.ts**:

```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    // BullMQ configuration
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),

    // Bull Board UI
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),

    // Feature modules
    ProductModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
```

### Feature Module Pattern

Each feature follows this structure:

```typescript
// modules/product/product.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductQueueService } from './product-queue.service';
import { ProductCrawlProcessor } from './processors/product-crawl.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'product-crawl',
    }),
    BullBoardModule.forFeature({
      name: 'product-crawl',
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductQueueService, ProductCrawlProcessor],
  exports: [ProductService],
})
export class ProductModule {}
```

## BullMQ Queue System

### Queue Architecture

```
HTTP Request → Controller → Service → Queue Service → BullMQ Queue
                                                            ↓
                                                      Processor (Worker)
                                                            ↓
                                                    Background Job Execution
```

### Queue Configuration

```typescript
// In app.module.ts
BullModule.forRoot({
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// In feature module
BullModule.registerQueue({
  name: 'product-crawl',
});
```

### Queue Monitoring

Access Bull Board UI at:
```
http://localhost:3001/queues
```

Features:
- View all queues
- Monitor job status (active, completed, failed)
- Retry failed jobs
- Clear queues
- View job details and logs

## Service Layer Organization

### Injectable Services (NestJS)

Located in `modules/[feature]/`:
- Controllers
- Services
- Queue services
- Processors

**Characteristics**:
- Decorated with `@Injectable()`
- Use dependency injection
- Can inject other services
- Lifecycle managed by NestJS

### Pure Function Services

Located in `src/services/`:
- Scraper service
- S3 upload service
- Product API service
- Template generators

**Characteristics**:
- NOT decorated with `@Injectable()`
- Static methods or exported functions
- No dependency injection
- Can be used in CLI mode
- Stateless, functional approach

**Example**:
```typescript
// services/scraper.service.ts
export class ScraperService {
  static async scrapeProduct(url: string): Promise<ProductData> {
    // Implementation
  }
}

// Usage in processor
const productData = await ScraperService.scrapeProduct(url);
```

## Validation & DTOs

### DTO Pattern

```typescript
// dto/create-brand.dto.ts
import { IsString, IsUrl, IsOptional, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsUrl()
  @IsOptional()
  logo_url?: string;
}
```

### Global Validation Pipe

Configured in `main.ts`:

```typescript
app.useGlobalPipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
}));
```

This automatically:
- Validates all incoming requests against DTOs
- Transforms plain objects to DTO class instances
- Strips unknown properties
- Returns 400 errors for invalid data

## Integration Points

### MedusaJS Backend

Pure function service for API calls:

```typescript
// services/product-api.service.ts
export class ProductApiService {
  private static baseUrl = process.env.MEDUSA_BACKEND_URL;
  private static apiKey = process.env.MEDUSA_API_KEY;

  static async createProduct(productData: any) {
    const response = await fetch(`${this.baseUrl}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-medusa-access-token': this.apiKey,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.statusText}`);
    }

    return response.json();
  }
}
```

### S3/MinIO Storage

File upload service:

```typescript
// services/s3-upload.service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class S3UploadService {
  private static s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  });

  static async uploadImage(buffer: Buffer, key: string): Promise<string> {
    await this.s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    }));

    return `${process.env.S3_FILE_URL}/${key}`;
  }
}
```

### AI Services

OpenAI integration:

```typescript
// services/description-generator.service.ts
import OpenAI from 'openai';

export class DescriptionGeneratorService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  static async generateDescription(productData: any): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Generate product descriptions' },
        { role: 'user', content: JSON.stringify(productData) },
      ],
    });

    return response.choices[0].message.content || '';
  }
}
```

## Environment Configuration

### Required Variables

```bash
# .env

# MedusaJS Backend
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_API_KEY=your_api_key
MEDUSA_ADMIN_EMAIL=admin@example.com
MEDUSA_ADMIN_PASSWORD=password

# Queue Infrastructure
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# S3/MinIO Storage
S3_BUCKET=product-images
S3_ENDPOINT=http://localhost:9000
S3_FILE_URL=http://localhost:9000/product-images
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin

# App Configuration
PORT=3001
NODE_ENV=development
PUPPETEER_TIMEOUT=30000
PUPPETEER_HEADLESS=true
```

### Configuration Service (Optional)

```typescript
// config/api.config.ts
export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  medusa: {
    url: process.env.MEDUSA_BACKEND_URL!,
    apiKey: process.env.MEDUSA_API_KEY!,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  s3: {
    bucket: process.env.S3_BUCKET!,
    endpoint: process.env.S3_ENDPOINT!,
    fileUrl: process.env.S3_FILE_URL!,
  },
};
```

## Error Handling

### HTTP Exceptions

```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Get(':id')
async findOne(@Param('id') id: string) {
  const brand = await this.brandService.findOne(id);

  if (!brand) {
    throw new NotFoundException(`Brand with ID ${id} not found`);
  }

  return brand;
}
```

### Exception Filters (Global)

```typescript
// filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

## Logging

### NestJS Logger

```typescript
import { Logger } from '@nestjs/common';

export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  async findAll() {
    this.logger.log('Fetching all products');
    // Implementation
  }

  async create(data: any) {
    this.logger.debug(`Creating product: ${JSON.stringify(data)}`);
    // Implementation
  }
}
```

## Development Commands

```bash
# From repository root

# HTTP Server Mode
nx serve core-api                # Dev server (port 3001)
nx build core-api                # Production build
nx start core-api                # Production server

# CLI Mode
nx dev-cli core-api -- crawl <url>  # Run CLI command

# Quality Checks
nx lint core-api                 # Run ESLint
nx type-check core-api           # TypeScript check
nx test core-api                 # Run tests
```

## Performance Considerations

### Job Queue Benefits
- Non-blocking API responses
- Horizontal scalability (multiple workers)
- Automatic retries
- Job prioritization
- Rate limiting

### Redis Persistence
Configure Redis for job persistence:

```bash
# redis.conf
appendonly yes
appendfsync everysec
```

## Security

### API Key Authentication

```typescript
// guards/api-key.guard.ts
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}

// Usage
@UseGuards(ApiKeyGuard)
@Controller('brands')
export class BrandController {}
```

### Input Validation
- Always use DTOs with validation decorators
- Global ValidationPipe enabled
- Sanitize user inputs
- Never trust client data

## Testing

### Unit Tests

```typescript
// product.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### E2E Tests

```typescript
// product.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products/crawl (POST)', () => {
    return request(app.getHttpServer())
      .post('/products/crawl')
      .send({ url: 'https://example.com/product' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Key Design Decisions

### Why NestJS?
- Structured, opinionated framework
- Built-in dependency injection
- TypeScript first-class support
- Extensive ecosystem (Bull, validation, etc.)
- Excellent documentation

### Why BullMQ?
- Robust job queue for Redis
- Excellent TypeScript support
- Built-in retry and rate limiting
- Bull Board UI for monitoring
- Better than alternatives (Agenda, Bee-Queue)

### Why Dual Mode (HTTP + CLI)?
- HTTP for admin dashboard integration
- CLI for standalone operations
- Shared business logic
- Flexibility in deployment

### Why Pure Function Services?
- Usable in both HTTP and CLI modes
- No dependency on NestJS container
- Easier to test
- Simpler mental model

## Common Patterns

### Controller → Service → Queue → Processor

Most common pattern for async operations:

1. **Controller** receives request, returns job ID
2. **Service** validates and delegates to queue
3. **Queue Service** adds job to BullMQ
4. **Processor** executes job in background

### Direct Service Pattern

For synchronous operations:

1. **Controller** receives request
2. **Service** processes and returns result
3. No queue involved

## Debugging

### Bull Board
Monitor jobs at `http://localhost:3001/queues`

### Logs
Use NestJS Logger for structured logging

### Redis CLI
```bash
redis-cli
> KEYS *  # View all keys
> HGETALL bull:product-crawl:123  # View job data
```

### NestJS DevTools
Coming soon in NestJS v10+
