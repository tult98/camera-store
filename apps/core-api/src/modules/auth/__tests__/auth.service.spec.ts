import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, CreateUserInput } from '../auth.service';
import { PrismaService } from '../../../database/prisma.service';

jest.mock('../utils/password.util', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed-password-mock'),
}));

type MockPrismaService = {
  user: { findFirst: jest.Mock; create: jest.Mock };
  auth_identity: { create: jest.Mock };
  provider_identity: { create: jest.Mock };
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
    create: jest.fn(),
  },
  $transaction: jest.fn((callback: (tx: MockPrismaService) => unknown) => callback(mockPrismaService)),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
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
});
