import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('product-crawl')
export class ProductCrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(ProductCrawlProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} with data:`, job.data);

    console.log('========================================');
    console.log('🚀 Product Crawl Job Started!');
    console.log('Job ID:', job.id);
    console.log('Job Data:', JSON.stringify(job.data, null, 2));
    console.log('========================================');

    await new Promise((resolve) => setTimeout(resolve, 10000));

    return {
      success: true,
      message: 'Product crawl job completed successfully!',
      jobId: job.id,
      processedAt: new Date().toISOString(),
    };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`✅ Job ${job.id} completed!`);
    console.log('✅ Job completed:', job.id);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`❌ Job ${job.id} failed:`, error.message);
    console.error('❌ Job failed:', job.id, error.message);
  }
}
