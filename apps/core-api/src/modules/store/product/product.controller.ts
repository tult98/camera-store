import { Controller, Get, Headers, Param } from '@nestjs/common';
import { StoreProductService } from './product.service';
import { createResourceResponse } from '../../../common/utils/response.util.js';

@Controller('store/products')
export class StoreProductController {
  constructor(private readonly productService: StoreProductService) {}

  @Get(':handle')
  async findByHandle(
    @Param('handle') handle: string,
    @Headers('currency-code') currencyCode?: string
  ) {
    const product = await this.productService.findByHandle(handle, currencyCode);
    return createResourceResponse('product', product);
  }
}
