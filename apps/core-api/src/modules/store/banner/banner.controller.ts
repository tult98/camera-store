import { Controller, Get, Query } from '@nestjs/common';
import { BannerService } from './banner.service';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';
import { createPaginatedResponse } from '../../../common/utils/pagination.util.js';

@Controller('store/banners')
export class BannersController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async findAll(@Query() pagination: PaginationQueryDto) {
    const { offset = 0, limit = 10 } = pagination;
    const { data, count } = await this.bannerService.findActiveBanners({
      offset,
      limit,
    });

    return createPaginatedResponse('banners', data, count, offset, limit);
  }
}

@Controller('store/banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async findOneActiveBanner() {
    return this.bannerService.findOneActiveBanner();
  }
}
