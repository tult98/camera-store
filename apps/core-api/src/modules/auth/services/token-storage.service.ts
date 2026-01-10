import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '../../redis/redis.module.js';

export interface RefreshTokenMetadata {
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

    const currentTtl = await this.redis.ttl(userTokensKey);
    if (currentTtl === -1) {
      await this.redis.expire(userTokensKey, this.REFRESH_TTL);
    }
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

    const script = `
      local userTokensKey = KEYS[1]
      local refreshPrefix = ARGV[1]
      local jtis = redis.call('SMEMBERS', userTokensKey)
      local count = #jtis
      if count == 0 then
        return 0
      end
      for _, jti in ipairs(jtis) do
        redis.call('DEL', refreshPrefix .. ':' .. jti)
      end
      redis.call('DEL', userTokensKey)
      return count
    `;

    const result = (await this.redis.eval(script, {
      keys: [userTokensKey],
      arguments: [this.REFRESH_PREFIX],
    })) as number | string | null;

    if (result === null) {
      return 0;
    }

    return typeof result === 'number' ? result : Number(result);
  }
}
