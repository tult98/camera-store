import { Module } from '@nestjs/common';
import { BannerModule } from './banner/banner.module';
import { StoreProductModule } from './product/product.module';

@Module({
  imports: [BannerModule, StoreProductModule],
})
export class StoreModule {}
