import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  const createMockContext = (authHeader?: string): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: authHeader,
          },
        }),
      }),
    } as ExecutionContext;
  };

  it('should allow access with valid token', async () => {
    const mockPayload = {
      sub: 'user-123',
      email: 'test@example.com',
      type: 'access',
    };
    mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

    const context = createMockContext('Bearer valid-token');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: 'test-jwt-secret',
      issuer: 'core-api',
    });
  });

  it('should throw UnauthorizedException for missing token', async () => {
    const context = createMockContext();

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for invalid token format', async () => {
    const context = createMockContext('InvalidFormat token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const context = createMockContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for wrong issuer', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid issuer'));

    const context = createMockContext('Bearer token-with-wrong-issuer');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for invalid token type', async () => {
    const mockPayload = {
      sub: 'user-123',
      email: 'test@example.com',
      type: 'refresh',
    };
    mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

    const context = createMockContext('Bearer refresh-token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should attach user to request on successful authentication', async () => {
    const mockPayload = {
      sub: 'user-123',
      email: 'test@example.com',
      type: 'access',
    };
    mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

    const mockRequest: { headers: { authorization: string }; user?: { userId: string; email: string } } = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    await guard.canActivate(context);

    expect(mockRequest).toHaveProperty('user');
    expect(mockRequest.user).toEqual({
      userId: 'user-123',
      email: 'test@example.com',
    });
  });
});
