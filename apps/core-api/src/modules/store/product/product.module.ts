import { Module } from '@nestjs/common';
import { StoreProductController } from './product.controller';
import { StoreProductService } from './product.service';

@Module({
  controllers: [StoreProductController],
  providers: [StoreProductService],
})
export class StoreProductModule {}
