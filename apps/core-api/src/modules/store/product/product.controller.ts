import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';
import { createPaginatedResponse } from '../../../common/utils/pagination.util.js';
import { createResourceResponse } from '../../../common/utils/response.util.js';
import { StoreProductService } from './product.service';

@Controller('store/products')
export class StoreProductController {
  constructor(private readonly productService: StoreProductService) {}

  @Get()
  async findAll(@Query() pagination: PaginationQueryDto, @Headers('currency-code') currencyCode?: string) {
    const { offset = 0, limit = 10 } = pagination;
    const { data, count } = await this.productService.findAll({ offset, limit }, currencyCode);

    return createPaginatedResponse('products', data, count, offset, limit);
  }

  @Get('featured')
  async findFeatured(@Query() pagination: PaginationQueryDto, @Headers('currency-code') currencyCode?: string) {
    const { offset = 0, limit = 10 } = pagination;

    const { data, count } = await this.productService.findFeaturedProducts({ offset, limit }, currencyCode);

    return createPaginatedResponse('products', data, count, offset, limit);
  }

  @Get(':handle')
  async findByHandle(@Param('handle') handle: string, @Headers('currency-code') currencyCode?: string) {
    const product = await this.productService.findByHandle(handle, currencyCode);
    return createResourceResponse('product', product);
  }
}
