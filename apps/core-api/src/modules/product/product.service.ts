import { Injectable } from '@nestjs/common';
import { ProductQueueService } from './product-queue.service';

@Injectable()
export class ProductService {
  constructor(private readonly productQueueService: ProductQueueService) {}

  async crawlProduct(url: string) {
    return this.productQueueService.addCrawlJob({ url });
  }

  async getJobStatus(jobId: string) {
    return this.productQueueService.getJobInfo(jobId);
  }
}
