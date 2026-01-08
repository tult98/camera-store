import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SKIP_AUTH_KEY } from '../../modules/auth/decorators/skip-auth.decorator.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('API_KEY');

    if (!validApiKey) {
      throw new Error('API_KEY environment variable is not configured');
    }

    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
