import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './auth.guard.js';
import { AuthService, LoginResponse } from './auth.service.js';
import { SkipAuth } from './decorators/skip-auth.decorator.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('me')
  @SkipAuth()
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request): Promise<{ userId: string; email: string }> {
    return {
      userId: req.user!.userId,
      email: req.user!.email,
    };
  }
}
