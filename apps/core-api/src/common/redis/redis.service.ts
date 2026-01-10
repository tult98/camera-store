import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.getOrThrow<string>('REDIS_URL');
    this.client = new Redis(redisUrl);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Redis set error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Cache operation failed');
    }
  }

  async setNx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    try {
      const result = await this.client.set(key, value, 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch (error) {
      this.logger.error(`Redis setNx error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Cache operation failed');
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Redis get error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Cache operation failed');
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Redis del error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Cache operation failed');
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    try {
      await this.client.expire(key, ttlSeconds);
    } catch (error) {
      this.logger.error(`Redis expire error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Cache operation failed');
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
