import { Module } from '@nestjs/common';
import { BannerModule } from './banner/banner.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { StoreProductModule } from './product/product.module';

@Module({
  imports: [BannerModule, BrandModule, CategoryModule, StoreProductModule],
})
export class StoreModule {}
