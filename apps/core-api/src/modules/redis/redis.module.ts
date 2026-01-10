import { Module, Global, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('RedisModule');
        const client: RedisClientType = createClient({
          url: configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
          socket: {
            reconnectStrategy: (retries: number) => {
              if (retries > 10) {
                logger.error('Redis reconnection limit reached, giving up');
                return new Error('Redis reconnection limit reached');
              }
              const delay = Math.min(retries * 100, 3000);
              logger.warn(`Redis reconnecting in ${delay}ms (attempt ${retries})`);
              return delay;
            },
          },
        });

        client.on('error', (err) => {
          logger.error(`Redis Client Error: ${err.message}`, err.stack);
        });

        client.on('reconnecting', () => {
          logger.warn('Redis client reconnecting...');
        });

        client.on('ready', () => {
          logger.log('Redis client connected and ready');
        });

        try {
          await client.connect();
          return client;
        } catch (error) {
          const err = error as Error;
          logger.error(`Failed to connect to Redis: ${err.message}`, err.stack);
          throw error;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnModuleDestroy {
  private readonly logger = new Logger(RedisModule.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

  async onModuleDestroy() {
    try {
      if (this.redis && (this.redis as any).isOpen) {
        await this.redis.quit();
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error while shutting down Redis client: ${err.message}`, err.stack);
    }
  }
}
