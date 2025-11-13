import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CrawlProductDto } from './dto/crawl-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('crawl')
  async crawlProduct(@Body() crawlProductDto: CrawlProductDto) {
    return this.productService.crawlProduct(crawlProductDto.url);
  }

  @Get('jobs/:jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.productService.getJobStatus(jobId);
  }
}
