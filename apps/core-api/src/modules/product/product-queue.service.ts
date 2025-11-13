import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';

export interface CrawlJobData {
  url: string;
}

@Injectable()
export class ProductQueueService {
  constructor(
    @InjectQueue('product-crawl') private readonly crawlQueue: Queue
  ) {}

  async addCrawlJob(data: CrawlJobData) {
    const job = await this.crawlQueue.add('crawl', data);
    return {
      jobId: job.id,
      message: 'Job added to queue successfully',
    };
  }

  async getJobInfo(jobId: string) {
    const job = await this.crawlQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    const state = await job.getState();

    return {
      id: job.id,
      state,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}
