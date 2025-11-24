import { Controller, Get, Query } from '@nestjs/common';
import { BrandService } from './brand.service.js';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';
import { createPaginatedResponse } from '../../../common/utils/pagination.util.js';

@Controller('store/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async findAll(@Query() pagination: PaginationQueryDto) {
    const { offset = 0, limit = 10 } = pagination;

    const { data, count } = await this.brandService.findAll({
      offset,
      limit,
    });

    return createPaginatedResponse('brands', data, count, offset, limit);
  }
}
