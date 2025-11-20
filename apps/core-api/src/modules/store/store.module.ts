import { Module } from '@nestjs/common';
import { BannerModule } from './banner/banner.module';
import { CategoryModule } from './category/category.module';
import { StoreProductModule } from './product/product.module';

@Module({
  imports: [BannerModule, CategoryModule, StoreProductModule],
})
export class StoreModule {}
