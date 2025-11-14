# Core API Worker Patterns (BullMQ)

## Overview

BullMQ workers handle asynchronous background jobs in the core-api. This pattern is used for long-running tasks like web scraping, data processing, and API integrations.

## Worker Architecture

```
HTTP Request → Controller → Service → Queue Service → BullMQ Queue
                                                            ↓
                                                    Redis (Job Storage)
                                                            ↓
                                                    Processor (Worker)
                                                            ↓
                                                    Job Execution
                                                            ↓
                                                    Result/Error
```

## Complete Worker Setup

### 1. Queue Service

Manages job creation and status retrieval:

```typescript
// modules/product/product-queue.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ProductQueueService {
  constructor(
    @InjectQueue('product-crawl') private productCrawlQueue: Queue,
  ) {}

  async addCrawlJob(url: string): Promise<string> {
    const job = await this.productCrawlQueue.add(
      'crawl',  // Job name
      { url },  // Job data
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    return job.id;
  }

  async getJobStatus(jobId: string) {
    const job = await this.productCrawlQueue.getJob(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    const state = await job.getState();
    const progress = job.progress;
    const returnvalue = job.returnvalue;
    const failedReason = job.failedReason;

    return {
      id: job.id,
      state,
      progress,
      returnvalue,
      failedReason,
    };
  }

  async removeJob(jobId: string): Promise<void> {
    const job = await this.productCrawlQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  async retryJob(jobId: string): Promise<void> {
    const job = await this.productCrawlQueue.getJob(jobId);
    if (job) {
      await job.retry();
    }
  }
}
```

### 2. Processor (Worker)

Executes the actual background job:

```typescript
// modules/product/processors/product-crawl.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

interface CrawlJobData {
  url: string;
}

interface CrawlJobResult {
  product_id: string;
  title: string;
  images: string[];
}

@Processor('product-crawl')
export class ProductCrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(ProductCrawlProcessor.name);

  async process(job: Job<CrawlJobData>): Promise<CrawlJobResult> {
    this.logger.log(`Processing job ${job.id}: ${job.data.url}`);

    try {
      // Step 1: Scrape product data
      await job.updateProgress(10);
      const productData = await this.scrapeProduct(job.data.url);

      // Step 2: Upload images
      await job.updateProgress(40);
      const imageUrls = await this.uploadImages(productData.images);

      // Step 3: Generate description
      await job.updateProgress(70);
      const description = await this.generateDescription(productData);

      // Step 4: Create product in Medusa
      await job.updateProgress(90);
      const product = await this.createProduct({
        ...productData,
        images: imageUrls,
        description,
      });

      await job.updateProgress(100);

      return {
        product_id: product.id,
        title: product.title,
        images: imageUrls,
      };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed:`, error);
      throw error;  // Re-throw to mark job as failed
    }
  }

  private async scrapeProduct(url: string) {
    // Implementation
    return { title: 'Product', images: [] };
  }

  private async uploadImages(images: any[]) {
    // Implementation
    return [];
  }

  private async generateDescription(data: any) {
    // Implementation
    return '';
  }

  private async createProduct(data: any) {
    // Implementation
    return { id: '123', title: data.title };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number) {
    this.logger.debug(`Job ${job.id} progress: ${progress}%`);
  }
}
```

### 3. Module Registration

Register queue and processor in the module:

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
    // Register the queue
    BullModule.registerQueue({
      name: 'product-crawl',
    }),

    // Add to Bull Board monitoring
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

### 4. Controller Integration

Expose endpoints to trigger and check jobs:

```typescript
// modules/product/product.controller.ts
import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductQueueService } from './product-queue.service';
import { CrawlProductDto } from './dto/crawl-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productQueueService: ProductQueueService) {}

  @Post('crawl')
  @HttpCode(HttpStatus.ACCEPTED)
  async crawlProduct(@Body() dto: CrawlProductDto) {
    const jobId = await this.productQueueService.addCrawlJob(dto.url);
    return { jobId };
  }

  @Get('jobs/:jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.productQueueService.getJobStatus(jobId);
  }
}
```

## Job Options

### Retry Configuration

```typescript
const job = await queue.add('job-name', data, {
  attempts: 3,  // Retry up to 3 times
  backoff: {
    type: 'exponential',  // or 'fixed'
    delay: 2000,  // Initial delay (ms)
  },
});
```

### Priority

```typescript
const job = await queue.add('job-name', data, {
  priority: 1,  // Lower number = higher priority
});
```

### Delay

```typescript
const job = await queue.add('job-name', data, {
  delay: 5000,  // Start job after 5 seconds
});
```

### Timeout

```typescript
@Processor('product-crawl', {
  concurrency: 5,  // Process up to 5 jobs concurrently
  limiter: {
    max: 10,  // Max 10 jobs
    duration: 1000,  // Per second
  },
})
export class ProductCrawlProcessor extends WorkerHost {
  async process(job: Job) {
    // Job implementation
  }
}
```

### Remove on Complete/Fail

```typescript
const job = await queue.add('job-name', data, {
  removeOnComplete: true,  // Remove job after completion
  removeOnFail: false,  // Keep failed jobs for debugging
});
```

## Progress Tracking

### Update Progress in Processor

```typescript
async process(job: Job) {
  await job.updateProgress(0);

  // Step 1
  await doStep1();
  await job.updateProgress(25);

  // Step 2
  await doStep2();
  await job.updateProgress(50);

  // Step 3
  await doStep3();
  await job.updateProgress(75);

  // Step 4
  await doStep4();
  await job.updateProgress(100);

  return result;
}
```

### Listen to Progress Events

```typescript
@OnWorkerEvent('progress')
onProgress(job: Job, progress: number) {
  this.logger.debug(`Job ${job.id} is ${progress}% complete`);
}
```

## Worker Events

### Available Events

```typescript
import { OnWorkerEvent } from '@nestjs/bullmq';

@Processor('queue-name')
export class MyProcessor extends WorkerHost {
  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Job ${job.id} is now active`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    console.log(`Job ${job.id} completed with result:`, result);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} failed:`, error.message);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number) {
    console.log(`Job ${job.id} progress: ${progress}%`);
  }

  @OnWorkerEvent('drained')
  onDrained() {
    console.log('Queue is drained (no more jobs to process)');
  }

  @OnWorkerEvent('error')
  onError(error: Error) {
    console.error('Worker error:', error);
  }
}
```

## Error Handling

### Retry Strategy

```typescript
const job = await queue.add('job-name', data, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
});

// Job will be retried:
// - 1st retry: after 2 seconds
// - 2nd retry: after 4 seconds
// - 3rd retry: after 8 seconds
```

### Custom Error Handling

```typescript
async process(job: Job) {
  try {
    const result = await this.doWork(job.data);
    return result;
  } catch (error) {
    this.logger.error(`Job ${job.id} error:`, error);

    // Decide whether to retry
    if (error instanceof RecoverableError) {
      // Let BullMQ retry
      throw error;
    } else {
      // Mark as failed permanently
      await job.moveToFailed(error, 'token', true);
    }
  }
}
```

### Failed Job Handling

```typescript
@OnWorkerEvent('failed')
async onFailed(job: Job, error: Error) {
  this.logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts`);

  // Send notification
  await this.notificationService.sendFailureAlert({
    jobId: job.id,
    error: error.message,
    data: job.data,
  });

  // Log to external service
  await this.errorTracker.log({
    jobId: job.id,
    error: error.stack,
  });
}
```

## Job States

Jobs can be in the following states:

- **waiting**: Job is in the queue, waiting to be processed
- **active**: Job is currently being processed
- **completed**: Job finished successfully
- **failed**: Job failed after all retry attempts
- **delayed**: Job is delayed (will start later)
- **paused**: Queue is paused

### Checking Job State

```typescript
const job = await queue.getJob(jobId);
const state = await job.getState();

if (state === 'completed') {
  const result = job.returnvalue;
}

if (state === 'failed') {
  const error = job.failedReason;
}
```

## Advanced Patterns

### Job Chaining

Execute jobs in sequence:

```typescript
async process(job: Job) {
  const result1 = await this.step1(job.data);

  // Add next job in the chain
  await this.nextQueue.add('step2', {
    ...result1,
    previousJobId: job.id,
  });

  return result1;
}
```

### Scheduled Jobs

```typescript
// Add job to run at specific time
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

await queue.add('job-name', data, {
  delay: tomorrow.getTime() - Date.now(),
});
```

### Repeatable Jobs (Cron)

```typescript
// Add job that repeats every day at 2 AM
await queue.add('daily-job', data, {
  repeat: {
    cron: '0 2 * * *',
  },
});

// Or use interval
await queue.add('hourly-job', data, {
  repeat: {
    every: 3600000,  // Every hour (in ms)
  },
});
```

### Bulk Jobs

```typescript
const jobs = [
  { name: 'job1', data: { url: 'https://example.com/1' } },
  { name: 'job2', data: { url: 'https://example.com/2' } },
  { name: 'job3', data: { url: 'https://example.com/3' } },
];

await queue.addBulk(jobs);
```

### Job Dependencies

```typescript
// Parent job
const parentJob = await queue.add('parent', data);

// Child jobs that depend on parent
await queue.add('child1', data, {
  parent: {
    id: parentJob.id,
    queue: queue.qualifiedName,
  },
});
```

## Monitoring & Debugging

### Bull Board UI

Access at `http://localhost:3001/queues`:

- View all queues
- See job counts by state
- Inspect individual jobs
- Retry failed jobs
- Clear queues
- Pause/resume queues

### Queue Metrics

```typescript
// In queue service
async getQueueMetrics() {
  const waiting = await this.queue.getWaitingCount();
  const active = await this.queue.getActiveCount();
  const completed = await this.queue.getCompletedCount();
  const failed = await this.queue.getFailedCount();
  const delayed = await this.queue.getDelayedCount();

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
  };
}
```

### Job Logs

```typescript
@Processor('product-crawl')
export class ProductCrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(ProductCrawlProcessor.name);

  async process(job: Job) {
    this.logger.log(`Starting job ${job.id}`);
    this.logger.debug(`Job data: ${JSON.stringify(job.data)}`);

    // Log important steps
    this.logger.log(`Scraping URL: ${job.data.url}`);
    const data = await this.scrapeProduct(job.data.url);

    this.logger.log(`Upload ${data.images.length} images`);
    const urls = await this.uploadImages(data.images);

    this.logger.log(`Job ${job.id} completed`);
    return { urls };
  }
}
```

## Testing Workers

### Unit Tests

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ProductCrawlProcessor } from './product-crawl.processor';
import { Job } from 'bullmq';

describe('ProductCrawlProcessor', () => {
  let processor: ProductCrawlProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCrawlProcessor],
    }).compile();

    processor = module.get<ProductCrawlProcessor>(ProductCrawlProcessor);
  });

  it('should process a crawl job', async () => {
    const job = {
      id: '123',
      data: { url: 'https://example.com/product' },
      updateProgress: jest.fn(),
    } as unknown as Job;

    const result = await processor.process(job);

    expect(result).toHaveProperty('product_id');
    expect(job.updateProgress).toHaveBeenCalledWith(100);
  });
});
```

### Integration Tests

```typescript
import { Test } from '@nestjs/testing';
import { BullModule } from '@nestjs/bullmq';
import { ProductQueueService } from './product-queue.service';

describe('ProductQueueService (integration)', () => {
  let service: ProductQueueService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        BullModule.forRoot({
          connection: {
            host: 'localhost',
            port: 6379,
          },
        }),
        BullModule.registerQueue({
          name: 'product-crawl-test',
        }),
      ],
      providers: [ProductQueueService],
    }).compile();

    service = module.get<ProductQueueService>(ProductQueueService);
  });

  it('should add a job to the queue', async () => {
    const jobId = await service.addCrawlJob('https://example.com');
    expect(jobId).toBeDefined();

    const status = await service.getJobStatus(jobId);
    expect(status.state).toBe('waiting');
  });
});
```

## Best Practices

### ✅ Do's

- Use progress updates for long-running jobs
- Log important steps for debugging
- Handle errors gracefully with retries
- Clean up resources in finally blocks
- Use worker events for monitoring
- Set appropriate job timeouts
- Monitor queue metrics

### ❌ Don'ts

- Don't process heavy jobs synchronously in HTTP endpoints
- Don't store large data in job payload (use references)
- Don't forget to handle errors (they'll retry forever)
- Don't skip progress updates (users need feedback)
- Don't ignore failed jobs (they need attention)
- Don't run without Bull Board monitoring

## Common Patterns Summary

### Simple Background Job

```typescript
// 1. Add job
const jobId = await queue.add('job-name', { data });

// 2. Process job
async process(job: Job) {
  return await doWork(job.data);
}

// 3. Check status
const status = await queue.getJobStatus(jobId);
```

### Long-Running Job with Progress

```typescript
async process(job: Job) {
  await job.updateProgress(0);

  for (let i = 0; i < steps.length; i++) {
    await processStep(steps[i]);
    await job.updateProgress((i + 1) / steps.length * 100);
  }

  return result;
}
```

### Job with Retry Logic

```typescript
const jobId = await queue.add('job-name', data, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
});
```

### Scheduled Job

```typescript
await queue.add('daily-report', {}, {
  repeat: { cron: '0 9 * * *' },  // 9 AM daily
});
```

## Summary

- **BullMQ** provides robust background job processing
- **Processors** execute jobs asynchronously
- **Queue Services** manage job lifecycle
- **Progress tracking** keeps users informed
- **Error handling** with automatic retries
- **Bull Board** for monitoring and debugging
- **Events** for job lifecycle hooks
- **Redis** required for job storage
