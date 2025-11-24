import { Injectable } from '@nestjs/common';
import { brand } from 'src/generated/prisma/client.js';
import {
  PaginatedData,
  PaginationParams,
} from '../../../common/types/pagination.types.js';
import { PrismaService } from '../../../database/prisma.service.js';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationParams): Promise<PaginatedData<brand>> {
    const { offset, limit } = pagination;

    const where = {
      deleted_at: null,
    };

    const [brands, count] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.brand.count({ where }),
    ]);

    return { data: brands, count };
  }
}
