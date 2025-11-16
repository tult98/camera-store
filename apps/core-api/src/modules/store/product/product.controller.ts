import { Controller, Get, Headers, Param } from '@nestjs/common';
import { StoreProductService } from './product.service';

@Controller('store/products')
export class StoreProductController {
  constructor(private readonly productService: StoreProductService) {}

  @Get(':handle')
  async findByHandle(
    @Param('handle') handle: string,
    @Headers('currency-code') currencyCode?: string
  ) {
    return this.productService.findByHandle(handle, currencyCode);
  }
}
