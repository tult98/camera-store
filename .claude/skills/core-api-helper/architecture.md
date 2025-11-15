# Core API Architecture

## Directory Structure

```
apps/core-api/src/
├── main.ts                              # NestJS HTTP server entry
├── app.module.ts                        # Root module
├── app.controller.ts                    # Basic controller
├── config/
│   └── api.config.ts                    # Configuration
├── types/
│   └── *.types.ts                       # Shared types
├── modules/                             # Feature modules
│   └── [feature]/
│       ├── [feature].module.ts          # NestJS module
│       ├── [feature].controller.ts      # REST endpoints
│       ├── [feature].service.ts         # Business logic
│       ├── [feature]-queue.service.ts   # BullMQ queue management
│       ├── processors/
│       │   └── [feature].processor.ts   # BullMQ worker
│       └── dto/
│           ├── create-[feature].dto.ts  # Request DTOs
│           └── [feature]-response.dto.ts # Response DTOs
└── services/                            # Reusable services (pure functions)
    └── *.service.ts                     # Not NestJS injectable
```

## Module Pattern

Each feature module follows this structure:

```
modules/product/
├── product.module.ts          # Register controller, services, queue
├── product.controller.ts      # HTTP endpoints
├── product.service.ts         # Business logic (delegates to queue)
├── product-queue.service.ts   # BullMQ queue operations
├── processors/
│   └── product-crawl.processor.ts  # Background worker
└── dto/
    ├── crawl-product.dto.ts        # Request validation
    └── job-status-response.dto.ts  # Response format
```

## Separation of Concerns

### Controllers
- Handle HTTP requests and responses
- Validate input using DTOs
- Delegate business logic to services
- Return standardized responses

### Services
- Implement business logic
- Coordinate with other services
- Interact with databases or external APIs
- Delegate long-running tasks to queues

### Queue Services
- Manage BullMQ queues
- Add jobs to queues
- Track job status
- Provide queue utilities

### Processors
- Execute background jobs
- Update job progress
- Handle errors and retries
- Log job lifecycle events

### DTOs (Data Transfer Objects)
- Define request/response shapes
- Provide validation rules
- Document API contracts
- Enable type safety

## Services Directory

The `services/` directory contains reusable utility services that are NOT NestJS injectable providers. These are pure functions or classes for:

- File processing
- Data transformation
- Third-party API clients
- Shared business logic

Example:
```typescript
// services/image-processor.service.ts
export class ImageProcessor {
  static async resize(buffer: Buffer, width: number): Promise<Buffer> {
    // Implementation
  }
}
```

## Configuration Pattern

Configuration is centralized in `config/` directory:

```typescript
// config/api.config.ts
export const apiConfig = {
  port: process.env.PORT || 3001,
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  s3: {
    bucket: process.env.S3_BUCKET || 'product-images',
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
};
```

## Module Dependencies

When a module depends on another:

```typescript
// brand.module.ts
import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [ProductModule], // Import dependent module
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],   // Export for other modules
})
export class BrandModule {}
```

## Testing Structure

```
modules/[feature]/
├── __tests__/
│   ├── [feature].controller.spec.ts
│   ├── [feature].service.spec.ts
│   └── [feature].processor.spec.ts
```

Example test:
```typescript
// __tests__/brand.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

describe('BrandController', () => {
  let controller: BrandController;
  let service: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        {
          provide: BrandService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BrandController>(BrandController);
    service = module.get<BrandService>(BrandService);
  });

  it('should return all brands', async () => {
    const result = [{ id: '1', name: 'Canon' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
  });
});
```
