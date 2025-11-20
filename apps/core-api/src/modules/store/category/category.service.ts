import { Injectable } from '@nestjs/common';
import { product_category } from 'src/generated/prisma/client.js';
import {
  PaginatedData,
  PaginationParams,
} from '../../../common/types/pagination.types.js';
import { PrismaService } from '../../../database/prisma.service.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findFeaturedCategories(
    pagination: PaginationParams
  ): Promise<PaginatedData<product_category>> {
    const { offset, limit } = pagination;

    const where = {
      deleted_at: null,
      is_active: true,
      metadata: {
        path: ['is_featured'],
        equals: true,
      },
    };

    const [categories, count] = await Promise.all([
      this.prisma.product_category.findMany({
        where,
        skip: offset,
        take: limit,
      }),
      this.prisma.product_category.count({ where }),
    ]);

    return { data: categories, count };
  }
}
