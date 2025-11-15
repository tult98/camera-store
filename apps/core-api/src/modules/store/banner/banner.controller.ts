import { Controller, Get } from '@nestjs/common';
import { BannerService } from './banner.service';

@Controller('store/banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async findAll() {
    return this.bannerService.findActiveBanners();
  }
}
