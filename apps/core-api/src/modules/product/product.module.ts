import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ProductCrawlProcessor } from './processors/product-crawl.processor';
import { ProductQueueService } from './product-queue.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'product-crawl',
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductCrawlProcessor, ProductQueueService],
})
export class ProductModule {}
