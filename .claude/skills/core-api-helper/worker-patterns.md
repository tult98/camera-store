# BullMQ Background Worker Patterns

## Overview

BullMQ is used for long-running async operations. Jobs are added to Redis-backed queues and processed by worker processors.

## Complete Worker Implementation

### 1. Create Queue Service

```typescript
// product-queue.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ProductQueueService {
  constructor(@InjectQueue('product-crawl') private productCrawlQueue: Queue) {}

  async addCrawlJob(url: string): Promise<string> {
    const job = await this.productCrawlQueue.add('crawl', { url });
    return job.id;
  }

  async getJobStatus(jobId: string) {
    const job = await this.productCrawlQueue.getJob(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
    };
  }

  async retryJob(jobId: string): Promise<void> {
    const job = await this.productCrawlQueue.getJob(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    await job.retry();
  }

  async removeJob(jobId: string): Promise<void> {
    const job = await this.productCrawlQueue.getJob(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    await job.remove();
  }

  async getQueueStatus() {
    return {
      waiting: await this.productCrawlQueue.getWaitingCount(),
      active: await this.productCrawlQueue.getActiveCount(),
      completed: await this.productCrawlQueue.getCompletedCount(),
      failed: await this.productCrawlQueue.getFailedCount(),
    };
  }
}
```

### 2. Create Processor

```typescript
// processors/product-crawl.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('product-crawl')
export class ProductCrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(ProductCrawlProcessor.name);

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing job ${job.id}: ${job.data.url}`);

    try {
      await job.updateProgress(10);

      const result = await this.performCrawl(job.data.url);

      await job.updateProgress(100);
      return result;
    } catch (error) {
      this.logger.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  }

  private async performCrawl(url: string) {
    // Implementation: scrape product data
    return { product_id: '123', name: 'Example Product' };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed:`, error.message);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Job ${job.id} is now active`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number | object) {
    this.logger.log(`Job ${job.id} progress: ${progress}%`);
  }
}
```

### 3. Register Queue in Module

```typescript
// product.module.ts
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

### 4. Register BullMQ in App Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    ProductModule,
  ],
})
export class AppModule {}
```

## Job Options

### Job Priority

```typescript
await this.productCrawlQueue.add(
  'crawl',
  { url },
  {
    priority: 1, // Lower numbers = higher priority
  }
);
```

### Job Delays

```typescript
await this.productCrawlQueue.add(
  'crawl',
  { url },
  {
    delay: 5000, // Delay 5 seconds
  }
);
```

### Job Retries

```typescript
await this.productCrawlQueue.add(
  'crawl',
  { url },
  {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // Start with 2 seconds
    },
  }
);
```

### Job Removal

```typescript
await this.productCrawlQueue.add(
  'crawl',
  { url },
  {
    removeOnComplete: true,
    removeOnFail: false,
  }
);
```

### Job Timeout

```typescript
await this.productCrawlQueue.add(
  'crawl',
  { url },
  {
    timeout: 60000, // 60 seconds
  }
);
```

## Progress Tracking

### Simple Progress

```typescript
async process(job: Job): Promise<any> {
  await job.updateProgress(0);

  // Step 1
  await job.updateProgress(25);

  // Step 2
  await job.updateProgress(50);

  // Step 3
  await job.updateProgress(75);

  // Complete
  await job.updateProgress(100);

  return result;
}
```

### Detailed Progress

```typescript
async process(job: Job): Promise<any> {
  await job.updateProgress({
    step: 'fetching',
    message: 'Fetching product page',
    percentage: 10,
  });

  await job.updateProgress({
    step: 'parsing',
    message: 'Parsing product data',
    percentage: 50,
  });

  await job.updateProgress({
    step: 'saving',
    message: 'Saving to database',
    percentage: 90,
  });

  return result;
}
```

## Error Handling

### Retry on Failure

```typescript
async process(job: Job): Promise<any> {
  try {
    return await this.performCrawl(job.data.url);
  } catch (error) {
    if (error.message.includes('timeout')) {
      // Retry for timeout errors
      throw error;
    } else {
      // Don't retry for other errors
      await job.moveToFailed(error, '', true);
      return null;
    }
  }
}
```

### Custom Error Messages

```typescript
@OnWorkerEvent('failed')
onFailed(job: Job, error: Error) {
  if (error.message.includes('404')) {
    this.logger.error(`Job ${job.id} failed: Product page not found`);
  } else if (error.message.includes('timeout')) {
    this.logger.error(`Job ${job.id} failed: Request timed out`);
  } else {
    this.logger.error(`Job ${job.id} failed:`, error.message);
  }
}
```

## Job Scheduling

### Repeatable Jobs

```typescript
// Schedule job to run every hour
await this.productCrawlQueue.add(
  'scheduled-crawl',
  { url: 'https://example.com' },
  {
    repeat: {
      pattern: '0 * * * *', // Cron pattern
    },
  }
);

// Remove repeatable job
await this.productCrawlQueue.removeRepeatable('scheduled-crawl', {
  pattern: '0 * * * *',
});
```

### Common Cron Patterns

```typescript
// Every minute
repeat: {
  pattern: '* * * * *';
}

// Every hour
repeat: {
  pattern: '0 * * * *';
}

// Every day at midnight
repeat: {
  pattern: '0 0 * * *';
}

// Every Monday at 9am
repeat: {
  pattern: '0 9 * * 1';
}

// Every 15 minutes
repeat: {
  pattern: '*/15 * * * *';
}
```

## Bulk Operations

### Add Multiple Jobs

```typescript
const jobs = urls.map((url) => ({
  name: 'crawl',
  data: { url },
  opts: { attempts: 3 },
}));

await this.productCrawlQueue.addBulk(jobs);
```

### Process Jobs in Batches

```typescript
@Processor('product-crawl', {
  concurrency: 5, // Process 5 jobs simultaneously
})
export class ProductCrawlProcessor extends WorkerHost {
  // ...
}
```

## Job Data Patterns

### Complex Job Data

```typescript
interface CrawlJobData {
  url: string;
  options: {
    retry_count: number;
    priority: 'high' | 'normal' | 'low';
    metadata: Record<string, any>;
  };
}

await this.productCrawlQueue.add('crawl', {
  url: 'https://example.com',
  options: {
    retry_count: 3,
    priority: 'high',
    metadata: { source: 'manual', user_id: '123' },
  },
} as CrawlJobData);
```

### Type-Safe Job Processing

```typescript
async process(job: Job<CrawlJobData>): Promise<any> {
  const { url, options } = job.data;

  this.logger.log(`Processing ${options.priority} priority job for ${url}`);

  // Type-safe access to job data
  const result = await this.performCrawl(url);

  return result;
}
```

## Queue Events

### Listen to Queue Events

```typescript
import { OnQueueEvent, QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq';

@QueueEventsListener('product-crawl')
export class ProductCrawlQueueEvents extends QueueEventsHost {
  @OnQueueEvent('waiting')
  onWaiting(jobId: string) {
    console.log(`Job ${jobId} is waiting`);
  }

  @OnQueueEvent('completed')
  onCompleted({ jobId, returnvalue }) {
    console.log(`Job ${jobId} completed with result:`, returnvalue);
  }

  @OnQueueEvent('failed')
  onFailed({ jobId, failedReason }) {
    console.log(`Job ${jobId} failed:`, failedReason);
  }
}
```

## Bull Board Monitoring

Access the Bull Board UI at `http://localhost:3001/queues` to:

- View all queues and their status
- Monitor active, waiting, completed, and failed jobs
- Inspect job data and logs
- Retry failed jobs manually
- Clear completed jobs
- Pause/resume queues
