import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuthService } from '../modules/auth/auth.service.js';
import { CreateUserCommand } from './commands/create-user.command.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
  ],
  providers: [
    {
      provide: AuthService,
      useFactory: (prisma: PrismaService, config: ConfigService) => {
        return new AuthService(prisma, new JwtService(), config);
      },
      inject: [PrismaService, ConfigService],
    },
    CreateUserCommand,
  ],
})
export class CliModule {}
