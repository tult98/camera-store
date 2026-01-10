import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisClientType } from 'redis';
import { DatabaseModule } from '../database/database.module.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuthService } from '../modules/auth/auth.service.js';
import { TokenStorageService } from '../modules/auth/services/token-storage.service.js';
import { REDIS_CLIENT, RedisModule } from '../modules/redis/redis.module.js';
import { CreateUserCommand } from './commands/create-user.command.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    RedisModule,
  ],
  providers: [
    {
      provide: AuthService,
      useFactory: (prisma: PrismaService, config: ConfigService, redis: RedisClientType) => {
        const tokenStorageService = new TokenStorageService(redis);
        return new AuthService(prisma, new JwtService(), config, tokenStorageService);
      },
      inject: [PrismaService, ConfigService, REDIS_CLIENT],
    },
    CreateUserCommand,
  ],
})
export class CliModule {}
