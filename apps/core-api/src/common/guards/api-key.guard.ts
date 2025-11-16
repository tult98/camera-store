import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
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
