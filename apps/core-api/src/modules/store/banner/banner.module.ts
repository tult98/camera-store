import { Module } from '@nestjs/common';
import { BannerController, BannersController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  controllers: [BannerController, BannersController],
  providers: [BannerService],
})
export class BannerModule {}
