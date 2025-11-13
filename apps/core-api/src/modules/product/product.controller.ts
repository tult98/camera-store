import { Body, Controller, Post } from '@nestjs/common';
import { CrawlProductDto } from './dto/crawl-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('crawl')
  async crawlProduct(@Body() crawlProductDto: CrawlProductDto) {
    return this.productService.crawlProduct(crawlProductDto.url);
  }
}
