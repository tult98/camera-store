import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service.js';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveBanners() {
    const banners = await this.prisma.banner.findMany({
      where: {
        is_active: true,
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return banners;
  }
}
