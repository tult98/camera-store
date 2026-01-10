import { Module, Global, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        const client: RedisClientType = createClient({
          url: configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
        });

        client.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnModuleDestroy {
  constructor(private readonly redis: RedisClientType) {}

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
