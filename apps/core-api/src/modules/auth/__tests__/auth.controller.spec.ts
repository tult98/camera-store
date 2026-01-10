import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { AuthController } from '../auth.controller';
import { JwtAuthGuard } from '../auth.guard';
import { AuthService, LoginResponse, TokenPair } from '../auth.service';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenPayload } from '../types';

const mockJwtAuthGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    logoutAllDevices: jest.fn(),
    validateRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return access token and user, and set refresh token cookie', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRequest = {
        headers: { 'user-agent': 'test-browser' },
      } as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const loginResponse: LoginResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        refreshJti: 'mock-jti',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      mockAuthService.login.mockResolvedValue(loginResponse);

      const result = await controller.login(loginDto, mockRequest, mockResponse);

      expect(result).toEqual({
        accessToken: 'mock-access-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password, 'test-browser');
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
        'mock-refresh-token',
        expect.any(Object)
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockRequest = {
        headers: { 'user-agent': 'test-browser' },
      } as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto, mockRequest, mockResponse)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should return new access token and set new refresh token cookie', async () => {
      const mockRequest = {
        cookies: { [REFRESH_TOKEN_COOKIE_NAME]: 'old-refresh-token' },
        headers: { 'user-agent': 'test-browser' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const tokenPair: TokenPair = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        refreshJti: 'new-jti',
      };

      mockAuthService.refresh.mockResolvedValue(tokenPair);

      const result = await controller.refresh(mockRequest, mockResponse);

      expect(result).toEqual({ accessToken: 'new-access-token' });
      expect(mockAuthService.refresh).toHaveBeenCalledWith('old-refresh-token', 'test-browser');
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
        'new-refresh-token',
        expect.any(Object)
      );
    });

    it('should throw UnauthorizedException when refresh token cookie is missing', async () => {
      const mockRequest = {
        cookies: {},
        headers: {},
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      await expect(controller.refresh(mockRequest, mockResponse)).rejects.toThrow(UnauthorizedException);
      await expect(controller.refresh(mockRequest, mockResponse)).rejects.toThrow('Refresh token not found');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const mockRequest = {
        cookies: { [REFRESH_TOKEN_COOKIE_NAME]: 'invalid-token' },
        headers: { 'user-agent': 'test-browser' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      mockAuthService.refresh.mockRejectedValue(new UnauthorizedException('Invalid refresh token'));

      await expect(controller.refresh(mockRequest, mockResponse)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should invalidate refresh token and clear cookie', async () => {
      const mockRequest = {
        user: { userId: 'user-123', email: 'test@example.com' },
        cookies: { [REFRESH_TOKEN_COOKIE_NAME]: 'refresh-token' },
      } as unknown as Request;

      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      const mockPayload: RefreshTokenPayload = {
        sub: 'user-123',
        jti: 'token-jti',
        type: 'refresh',
      };

      mockAuthService.validateRefreshToken.mockResolvedValue(mockPayload);
      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(mockRequest, mockResponse);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.validateRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(mockAuthService.logout).toHaveBeenCalledWith('user-123', 'token-jti');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN_COOKIE_NAME, expect.any(Object));
    });

    it('should clear cookie even if no refresh token is present', async () => {
      const mockRequest = {
        user: { userId: 'user-123', email: 'test@example.com' },
        cookies: {},
      } as unknown as Request;

      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.logout(mockRequest, mockResponse);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.validateRefreshToken).not.toHaveBeenCalled();
      expect(mockAuthService.logout).not.toHaveBeenCalled();
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN_COOKIE_NAME, expect.any(Object));
    });

    it('should throw UnauthorizedException when user is not authenticated', async () => {
      const mockRequest = {
        cookies: {},
      } as unknown as Request;

      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      await expect(controller.logout(mockRequest, mockResponse)).rejects.toThrow(UnauthorizedException);
      await expect(controller.logout(mockRequest, mockResponse)).rejects.toThrow('User not authenticated');
    });

    it('should clear cookie and succeed even when validateRefreshToken throws', async () => {
      const mockRequest = {
        user: { userId: 'user-123', email: 'test@example.com' },
        cookies: { [REFRESH_TOKEN_COOKIE_NAME]: 'invalid-refresh-token' },
      } as unknown as Request;

      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      mockAuthService.validateRefreshToken.mockRejectedValue(new Error('Token validation failed'));

      const result = await controller.logout(mockRequest, mockResponse);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.validateRefreshToken).toHaveBeenCalledWith('invalid-refresh-token');
      expect(mockAuthService.logout).not.toHaveBeenCalled();
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN_COOKIE_NAME, expect.any(Object));
    });
  });

  describe('logout-all', () => {
    it('should invalidate all tokens and clear cookie', async () => {
      const mockRequest = {
        user: { userId: 'user-123', email: 'test@example.com' },
      } as unknown as Request;

      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      mockAuthService.logoutAllDevices.mockResolvedValue(3);

      const result = await controller.logoutAllDevices(mockRequest, mockResponse);

      expect(result).toEqual({
        message: 'Logged out from all devices successfully',
        revokedCount: 3,
      });
      expect(mockAuthService.logoutAllDevices).toHaveBeenCalledWith('user-123');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN_COOKIE_NAME, expect.any(Object));
    });

    it('should throw UnauthorizedException when user is not authenticated', async () => {
      const mockRequest = {} as unknown as Request;

      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      await expect(controller.logoutAllDevices(mockRequest, mockResponse)).rejects.toThrow(UnauthorizedException);
      await expect(controller.logoutAllDevices(mockRequest, mockResponse)).rejects.toThrow('User not authenticated');
    });
  });

  describe('me', () => {
    it('should return user info from request', async () => {
      const mockRequest = {
        user: {
          userId: 'user-123',
          email: 'test@example.com',
        },
      } as Request;

      const result = await controller.me(mockRequest);

      expect(result).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException when user is not in request', async () => {
      const mockRequest = {} as Request;

      await expect(controller.me(mockRequest)).rejects.toThrow(UnauthorizedException);
      await expect(controller.me(mockRequest)).rejects.toThrow('User not authenticated');
    });
  });
});
