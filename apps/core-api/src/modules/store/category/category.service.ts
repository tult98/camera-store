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

  async findCategoryTree() {
    const categories = await this.prisma.product_category.findMany({
      where: {
        deleted_at: null,
        is_active: true,
        parent_category_id: null,
      },
      include: {
        other_product_category: {
          where: {
            deleted_at: null,
            is_active: true,
          },
          orderBy: [{ rank: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: [{ rank: 'asc' }, { name: 'asc' }],
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      handle: category.handle,
      is_active: category.is_active,
      rank: category.rank,
      metadata: category.metadata,
      created_at: category.created_at,
      updated_at: category.updated_at,
      children: category.other_product_category.map((child) => ({
        id: child.id,
        name: child.name,
        description: child.description,
        handle: child.handle,
        is_active: child.is_active,
        rank: child.rank,
        metadata: child.metadata,
        created_at: child.created_at,
        updated_at: child.updated_at,
      })),
    }));
  }
}
