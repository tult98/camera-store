import { Injectable } from '@nestjs/common';
import { banner } from 'src/generated/prisma/client.js';
import { PaginatedData, PaginationParams } from '../../../common/types/pagination.types.js';
import { PrismaService } from '../../../database/prisma.service.js';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveBanners(pagination: PaginationParams): Promise<PaginatedData<banner>> {
    const { offset, limit } = pagination;

    const where = {
      is_active: true,
      deleted_at: null,
    };

    const [banners, count] = await Promise.all([
      this.prisma.banner.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      this.prisma.banner.count({ where }),
    ]);

    return { data: banners, count };
  }

  async findOneActiveBanner() {
    const banner = await this.prisma.banner.findFirst({
      where: {
        is_active: true,
        deleted_at: null,
      },
    });

    return banner;
  }
}
