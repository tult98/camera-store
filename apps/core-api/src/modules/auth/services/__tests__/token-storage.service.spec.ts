import { Test, TestingModule } from '@nestjs/testing';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '../../../redis/redis.module';
import { TokenStorageService } from '../token-storage.service';

const mockRedisClient = {
  setEx: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  sAdd: jest.fn(),
  sRem: jest.fn(),
  sMembers: jest.fn(),
  expire: jest.fn(),
};

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenStorageService,
        {
          provide: REDIS_CLIENT,
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<TokenStorageService>(TokenStorageService);
  });

  describe('storeRefreshToken', () => {
    it('should store refresh token with metadata in Redis', async () => {
      const userId = 'user-123';
      const jti = 'token-abc';
      const metadata = {
        userId,
        createdAt: Date.now(),
        userAgent: 'Chrome/120',
      };

      mockRedisClient.setEx.mockResolvedValue('OK');
      mockRedisClient.sAdd.mockResolvedValue(1);
      mockRedisClient.expire.mockResolvedValue(1);

      await service.storeRefreshToken(userId, jti, metadata);

      expect(mockRedisClient.setEx).toHaveBeenCalledWith(
        'auth:refresh:token-abc',
        7 * 24 * 60 * 60,
        JSON.stringify(metadata)
      );
      expect(mockRedisClient.sAdd).toHaveBeenCalledWith('auth:user:user-123:tokens', jti);
      expect(mockRedisClient.expire).toHaveBeenCalledWith('auth:user:user-123:tokens', 7 * 24 * 60 * 60);
    });
  });

  describe('isRefreshTokenValid', () => {
    it('should return true for valid refresh token', async () => {
      const userId = 'user-123';
      const jti = 'token-abc';
      const metadata = {
        userId,
        createdAt: Date.now(),
      };

      mockRedisClient.get.mockResolvedValue(JSON.stringify(metadata));

      const result = await service.isRefreshTokenValid(userId, jti);

      expect(result).toBe(true);
      expect(mockRedisClient.get).toHaveBeenCalledWith('auth:refresh:token-abc');
    });

    it('should return false if token does not exist', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.isRefreshTokenValid('user-123', 'token-abc');

      expect(result).toBe(false);
    });

    it('should return false if userId does not match', async () => {
      const metadata = {
        userId: 'user-456',
        createdAt: Date.now(),
      };

      mockRedisClient.get.mockResolvedValue(JSON.stringify(metadata));

      const result = await service.isRefreshTokenValid('user-123', 'token-abc');

      expect(result).toBe(false);
    });

    it('should return false if metadata is invalid JSON', async () => {
      mockRedisClient.get.mockResolvedValue('invalid-json');

      const result = await service.isRefreshTokenValid('user-123', 'token-abc');

      expect(result).toBe(false);
    });
  });

  describe('invalidateRefreshToken', () => {
    it('should delete refresh token from Redis and remove from user tokens set', async () => {
      const userId = 'user-123';
      const jti = 'token-abc';

      mockRedisClient.del.mockResolvedValue(1);
      mockRedisClient.sRem.mockResolvedValue(1);

      await service.invalidateRefreshToken(userId, jti);

      expect(mockRedisClient.del).toHaveBeenCalledWith('auth:refresh:token-abc');
      expect(mockRedisClient.sRem).toHaveBeenCalledWith('auth:user:user-123:tokens', jti);
    });
  });

  describe('invalidateAllUserTokens', () => {
    it('should delete all refresh tokens for a user', async () => {
      const userId = 'user-123';
      const jtis = ['token-1', 'token-2', 'token-3'];

      mockRedisClient.sMembers.mockResolvedValue(jtis);
      mockRedisClient.del.mockResolvedValue(3);

      const result = await service.invalidateAllUserTokens(userId);

      expect(result).toBe(3);
      expect(mockRedisClient.sMembers).toHaveBeenCalledWith('auth:user:user-123:tokens');
      expect(mockRedisClient.del).toHaveBeenCalledWith([
        'auth:refresh:token-1',
        'auth:refresh:token-2',
        'auth:refresh:token-3',
      ]);
      expect(mockRedisClient.del).toHaveBeenCalledWith('auth:user:user-123:tokens');
    });

    it('should return 0 if user has no tokens', async () => {
      mockRedisClient.sMembers.mockResolvedValue([]);

      const result = await service.invalidateAllUserTokens('user-123');

      expect(result).toBe(0);
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });
  });
});
