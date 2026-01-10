import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService, LoginResponse, RefreshResponse } from './auth.service.js';
import { SkipAuth } from './decorators/skip-auth.decorator.js';
import { LoginDto, RefreshTokenDto } from './dto/login.dto.js';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto): Promise<RefreshResponse> {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshTokenDto): Promise<{ success: boolean }> {
    await this.authService.logout(dto.refreshToken);
    return { success: true };
  }
}
