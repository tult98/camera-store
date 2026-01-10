import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '../../redis/redis.module.js';

interface RefreshTokenMetadata {
  userId: string;
  createdAt: number;
  userAgent?: string;
}

@Injectable()
export class TokenStorageService {
  private readonly REFRESH_PREFIX = 'auth:refresh';
  private readonly USER_TOKENS_PREFIX = 'auth:user';
  private readonly REFRESH_TTL = 7 * 24 * 60 * 60;

  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

  async storeRefreshToken(userId: string, jti: string, metadata: RefreshTokenMetadata): Promise<void> {
    const refreshKey = `${this.REFRESH_PREFIX}:${jti}`;
    const userTokensKey = `${this.USER_TOKENS_PREFIX}:${userId}:tokens`;

    await this.redis.setEx(refreshKey, this.REFRESH_TTL, JSON.stringify(metadata));

    await this.redis.sAdd(userTokensKey, jti);
    await this.redis.expire(userTokensKey, this.REFRESH_TTL);
  }

  async isRefreshTokenValid(userId: string, jti: string): Promise<boolean> {
    const refreshKey = `${this.REFRESH_PREFIX}:${jti}`;
    const data = await this.redis.get(refreshKey);

    if (!data) {
      return false;
    }

    try {
      const metadata: RefreshTokenMetadata = JSON.parse(data);
      return metadata.userId === userId;
    } catch {
      return false;
    }
  }

  async invalidateRefreshToken(userId: string, jti: string): Promise<void> {
    const refreshKey = `${this.REFRESH_PREFIX}:${jti}`;
    const userTokensKey = `${this.USER_TOKENS_PREFIX}:${userId}:tokens`;

    await this.redis.del(refreshKey);
    await this.redis.sRem(userTokensKey, jti);
  }

  async invalidateAllUserTokens(userId: string): Promise<number> {
    const userTokensKey = `${this.USER_TOKENS_PREFIX}:${userId}:tokens`;

    const jtis = await this.redis.sMembers(userTokensKey);

    if (jtis.length === 0) {
      return 0;
    }

    const refreshKeys = jtis.map((jti) => `${this.REFRESH_PREFIX}:${jti}`);
    await this.redis.del(refreshKeys);

    await this.redis.del(userTokensKey);

    return jtis.length;
  }
}
