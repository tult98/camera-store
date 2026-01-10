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
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test-jwt-secret'),
  getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
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
      expect(result).not.toHaveProperty('refreshToken');
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
});
