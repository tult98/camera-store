import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS } from './constants.js';
import { SkipAuth } from './decorators/skip-auth.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginResponseBody, LogoutAllResponseBody, LogoutResponseBody, RefreshResponseBody } from './types.js';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseBody> {
    const userAgent = req.headers['user-agent'];
    const loginResponse = await this.authService.login(dto.email, dto.password, userAgent);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, loginResponse.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return {
      accessToken: loginResponse.accessToken,
      user: loginResponse.user,
    };
  }

  @SkipAuth()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<RefreshResponseBody> {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const userAgent = req.headers['user-agent'];
    const tokenPair = await this.authService.refresh(refreshToken, userAgent);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokenPair.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return {
      accessToken: tokenPair.accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<LogoutResponseBody> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (refreshToken) {
      try {
        const payload = await this.authService.validateRefreshToken(refreshToken);
        await this.authService.logout(req.user.userId, payload.jti);
      } catch (error) {
        console.error('Error validating refresh token during logout:', error);
      }
    }

    this.clearRefreshTokenCookie(res);

    return {
      message: 'Logged out successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAllDevices(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LogoutAllResponseBody> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const revokedCount = await this.authService.logoutAllDevices(req.user.userId);

    this.clearRefreshTokenCookie(res);

    return {
      message: 'Logged out from all devices successfully',
      revokedCount,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request): Promise<{ userId: string; email: string }> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return {
      userId: req.user.userId,
      email: req.user.email,
    };
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
    });
  }
}
