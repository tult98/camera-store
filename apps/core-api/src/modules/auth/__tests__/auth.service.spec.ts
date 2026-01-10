import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('../../../database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('../utils/password.util', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed-password-mock'),
  verifyPassword: jest.fn(),
}));

import { PrismaService } from '../../../database/prisma.service';
import { AuthService, CreateUserInput } from '../auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { verifyPassword } from '../utils/password.util';

type MockPrismaService = {
  user: { findFirst: jest.Mock; create: jest.Mock };
  auth_identity: { create: jest.Mock };
  provider_identity: { findFirst: jest.Mock; create: jest.Mock };
  $transaction: jest.Mock;
};

const mockPrismaService: MockPrismaService = {
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  auth_identity: {
    create: jest.fn(),
  },
  provider_identity: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  $transaction: jest.fn((callback: (tx: MockPrismaService) => unknown) => callback(mockPrismaService)),
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test-jwt-secret'),
  getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
};

const mockTokenStorageService = {
  storeRefreshToken: jest.fn().mockResolvedValue(undefined),
  isRefreshTokenValid: jest.fn().mockResolvedValue(true),
  invalidateRefreshToken: jest.fn().mockResolvedValue(undefined),
  invalidateAllUserTokens: jest.fn().mockResolvedValue(0),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: TokenStorageService, useValue: mockTokenStorageService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('createUser', () => {
    const validInput: CreateUserInput = {
      email: 'test@example.com',
      password: 'securepassword123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create a user successfully', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.createUser(validInput);

      expect(result).toMatchObject({
        email: validInput.email,
        firstName: validInput.firstName,
        lastName: validInput.lastName,
      });
      expect(result.id).toBeDefined();
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw error for invalid email format', async () => {
      const invalidInput = { ...validInput, email: 'invalid-email' };

      await expect(service.createUser(invalidInput)).rejects.toThrow('Invalid email format');
    });

    it('should throw error for password less than 8 characters', async () => {
      const invalidInput = { ...validInput, password: 'short' };

      await expect(service.createUser(invalidInput)).rejects.toThrow('Password must be at least 8 characters');
    });

    it('should throw error if user already exists', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({ id: 'existing-id' });

      await expect(service.createUser(validInput)).rejects.toThrow(
        `User with email "${validInput.email}" already exists`
      );
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
    };

    const mockProviderIdentity = {
      provider_metadata: { password: 'hashed-password' },
      auth_identity: {
        app_metadata: { user_id: 'user-123' },
        deleted_at: null,
      },
    };

    beforeEach(() => {
      mockJwtService.signAsync.mockResolvedValue('mock-access-token');
    });

    it('should login successfully with valid credentials', async () => {
      mockPrismaService.provider_identity.findFirst.mockResolvedValue(mockProviderIdentity);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      (verifyPassword as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test@example.com', 'password123');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('refreshJti');
      expect(result.user).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.first_name,
        lastName: mockUser.last_name,
      });
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaService.provider_identity.findFirst.mockResolvedValue(null);

      await expect(service.login('nonexistent@example.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockPrismaService.provider_identity.findFirst.mockResolvedValue(mockProviderIdentity);
      (verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for missing password hash', async () => {
      const identityWithoutPassword = {
        ...mockProviderIdentity,
        provider_metadata: {},
      };
      mockPrismaService.provider_identity.findFirst.mockResolvedValue(identityWithoutPassword);

      await expect(service.login('test@example.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for missing user_id', async () => {
      const identityWithoutUserId = {
        ...mockProviderIdentity,
        auth_identity: {
          app_metadata: {},
          deleted_at: null,
        },
      };
      mockPrismaService.provider_identity.findFirst.mockResolvedValue(identityWithoutUserId);
      (verifyPassword as jest.Mock).mockResolvedValue(true);

      await expect(service.login('test@example.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('should normalize email to lowercase', async () => {
      mockPrismaService.provider_identity.findFirst.mockResolvedValue(mockProviderIdentity);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      (verifyPassword as jest.Mock).mockResolvedValue(true);

      await service.login('TEST@EXAMPLE.COM', 'password123');

      expect(mockPrismaService.provider_identity.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            entity_id: 'test@example.com',
          }),
        })
      );
    });
  });

  describe('validateRefreshToken', () => {
    const mockRefreshToken = 'valid-refresh-token';
    const mockPayload = {
      sub: 'user-123',
      jti: 'token-jti',
      type: 'refresh' as const,
    };

    beforeEach(() => {
      mockJwtService.signAsync.mockResolvedValue(mockRefreshToken);
      mockConfigService.getOrThrow.mockReturnValue('test-refresh-secret');
    });

    it('should validate a valid refresh token', async () => {
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockTokenStorageService.isRefreshTokenValid.mockResolvedValue(true);

      const result = await service.validateRefreshToken(mockRefreshToken);

      expect(result).toEqual(mockPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(mockRefreshToken, {
        secret: 'test-refresh-secret',
        issuer: 'core-api',
      });
      expect(mockTokenStorageService.isRefreshTokenValid).toHaveBeenCalledWith('user-123', 'token-jti');
    });

    it('should throw UnauthorizedException for invalid token type', async () => {
      const invalidPayload = { ...mockPayload, type: 'access' as const };
      mockJwtService.verifyAsync.mockResolvedValue(invalidPayload);

      await expect(service.validateRefreshToken(mockRefreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.validateRefreshToken(mockRefreshToken)).rejects.toThrow('Invalid token type');
    });

    it('should throw UnauthorizedException for revoked token', async () => {
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockTokenStorageService.isRefreshTokenValid.mockResolvedValue(false);

      await expect(service.validateRefreshToken(mockRefreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.validateRefreshToken(mockRefreshToken)).rejects.toThrow('Token has been revoked');
    });

    it('should throw UnauthorizedException and log error for JWT verification failure', async () => {
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error').mockImplementation();
      mockJwtService.verifyAsync.mockRejectedValue(new Error('JWT verification failed'));

      await expect(service.validateRefreshToken(mockRefreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.validateRefreshToken(mockRefreshToken)).rejects.toThrow('Invalid refresh token');
      expect(loggerErrorSpy).toHaveBeenCalledWith('Error validating refresh token:', expect.any(Error));

      loggerErrorSpy.mockRestore();
    });

    it('should throw UnauthorizedException and log error for Redis errors', async () => {
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error').mockImplementation();
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockTokenStorageService.isRefreshTokenValid.mockRejectedValue(new Error('Redis connection failed'));

      await expect(service.validateRefreshToken(mockRefreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.validateRefreshToken(mockRefreshToken)).rejects.toThrow('Invalid refresh token');
      expect(loggerErrorSpy).toHaveBeenCalledWith('Error validating refresh token:', expect.any(Error));

      loggerErrorSpy.mockRestore();
    });
  });

  describe('refresh', () => {
    const mockRefreshToken = 'valid-refresh-token';
    const mockPayload = {
      sub: 'user-123',
      jti: 'old-token-jti',
      type: 'refresh' as const,
    };
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
    };

    beforeEach(() => {
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockTokenStorageService.isRefreshTokenValid.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('new-token');
      mockConfigService.getOrThrow.mockReturnValue('test-secret');
    });

    it('should refresh tokens successfully', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.refresh(mockRefreshToken, 'test-user-agent');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('refreshJti');
      expect(mockTokenStorageService.storeRefreshToken).toHaveBeenCalled();
      expect(mockTokenStorageService.invalidateRefreshToken).toHaveBeenCalledWith('user-123', 'old-token-jti');
    });

    it('should generate new tokens before invalidating old token', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      const callOrder: string[] = [];

      mockJwtService.signAsync.mockImplementation(() => {
        callOrder.push('generateToken');
        return Promise.resolve('new-token');
      });

      mockTokenStorageService.storeRefreshToken.mockImplementation(() => {
        callOrder.push('storeToken');
        return Promise.resolve();
      });

      mockTokenStorageService.invalidateRefreshToken.mockImplementation(() => {
        callOrder.push('invalidateToken');
        return Promise.resolve();
      });

      await service.refresh(mockRefreshToken, 'test-user-agent');

      expect(callOrder.indexOf('generateToken')).toBeLessThan(callOrder.indexOf('invalidateToken'));
      expect(callOrder.indexOf('storeToken')).toBeLessThan(callOrder.indexOf('invalidateToken'));
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.refresh(mockRefreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.refresh(mockRefreshToken)).rejects.toThrow('User not found');
      expect(mockTokenStorageService.invalidateRefreshToken).not.toHaveBeenCalled();
    });

    it('should throw error if token validation fails', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refresh(mockRefreshToken)).rejects.toThrow(UnauthorizedException);
      expect(mockTokenStorageService.invalidateRefreshToken).not.toHaveBeenCalled();
    });

    it('should not invalidate old token if new token generation fails', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockRejectedValueOnce(new Error('Token generation failed'));

      await expect(service.refresh(mockRefreshToken)).rejects.toThrow();
      expect(mockTokenStorageService.invalidateRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should invalidate refresh token', async () => {
      await service.logout('user-123', 'token-jti');

      expect(mockTokenStorageService.invalidateRefreshToken).toHaveBeenCalledWith('user-123', 'token-jti');
    });

    it('should handle errors from token storage service', async () => {
      mockTokenStorageService.invalidateRefreshToken.mockRejectedValue(new Error('Redis error'));

      await expect(service.logout('user-123', 'token-jti')).rejects.toThrow('Redis error');
    });
  });

  describe('logoutAllDevices', () => {
    it('should invalidate all user tokens', async () => {
      mockTokenStorageService.invalidateAllUserTokens.mockResolvedValue(3);

      const result = await service.logoutAllDevices('user-123');

      expect(result).toBe(3);
      expect(mockTokenStorageService.invalidateAllUserTokens).toHaveBeenCalledWith('user-123');
    });

    it('should return 0 if no tokens to invalidate', async () => {
      mockTokenStorageService.invalidateAllUserTokens.mockResolvedValue(0);

      const result = await service.logoutAllDevices('user-123');

      expect(result).toBe(0);
    });

    it('should handle errors from token storage service', async () => {
      mockTokenStorageService.invalidateAllUserTokens.mockRejectedValue(new Error('Redis error'));

      await expect(service.logoutAllDevices('user-123')).rejects.toThrow('Redis error');
    });
  });
});
