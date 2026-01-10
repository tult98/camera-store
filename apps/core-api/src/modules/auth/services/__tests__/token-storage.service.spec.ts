import { Test, TestingModule } from '@nestjs/testing';
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
  ttl: jest.fn(),
  eval: jest.fn(),
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
    it('should store refresh token with metadata in Redis and set TTL if not exists', async () => {
      const userId = 'user-123';
      const jti = 'token-abc';
      const metadata = {
        userId,
        createdAt: Date.now(),
        userAgent: 'Chrome/120',
      };

      mockRedisClient.setEx.mockResolvedValue('OK');
      mockRedisClient.sAdd.mockResolvedValue(1);
      mockRedisClient.ttl.mockResolvedValue(-1);
      mockRedisClient.expire.mockResolvedValue(1);

      await service.storeRefreshToken(userId, jti, metadata);

      expect(mockRedisClient.setEx).toHaveBeenCalledWith(
        'auth:refresh:token-abc',
        7 * 24 * 60 * 60,
        JSON.stringify(metadata)
      );
      expect(mockRedisClient.sAdd).toHaveBeenCalledWith('auth:user:user-123:tokens', jti);
      expect(mockRedisClient.ttl).toHaveBeenCalledWith('auth:user:user-123:tokens');
      expect(mockRedisClient.expire).toHaveBeenCalledWith('auth:user:user-123:tokens', 7 * 24 * 60 * 60);
    });

    it('should not reset TTL if user tokens set already has TTL', async () => {
      const userId = 'user-123';
      const jti = 'token-abc';
      const metadata = {
        userId,
        createdAt: Date.now(),
        userAgent: 'Chrome/120',
      };

      mockRedisClient.setEx.mockResolvedValue('OK');
      mockRedisClient.sAdd.mockResolvedValue(1);
      mockRedisClient.ttl.mockResolvedValue(300000);

      await service.storeRefreshToken(userId, jti, metadata);

      expect(mockRedisClient.ttl).toHaveBeenCalledWith('auth:user:user-123:tokens');
      expect(mockRedisClient.expire).not.toHaveBeenCalled();
    });

    it('should handle Redis setEx errors', async () => {
      const userId = 'user-123';
      const jti = 'token-abc';
      const metadata = {
        userId,
        createdAt: Date.now(),
      };

      mockRedisClient.setEx.mockRejectedValue(new Error('Redis connection error'));

      await expect(service.storeRefreshToken(userId, jti, metadata)).rejects.toThrow('Redis connection error');
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

    it('should handle Redis get errors', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Redis connection error'));

      await expect(service.isRefreshTokenValid('user-123', 'token-abc')).rejects.toThrow('Redis connection error');
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

    it('should handle Redis del errors', async () => {
      mockRedisClient.del.mockRejectedValue(new Error('Redis connection error'));

      await expect(service.invalidateRefreshToken('user-123', 'token-abc')).rejects.toThrow('Redis connection error');
    });
  });

  describe('invalidateAllUserTokens', () => {
    it('should delete all refresh tokens for a user using Lua script', async () => {
      const userId = 'user-123';

      mockRedisClient.eval.mockResolvedValue(3);

      const result = await service.invalidateAllUserTokens(userId);

      expect(result).toBe(3);
      expect(mockRedisClient.eval).toHaveBeenCalledWith(expect.stringContaining('SMEMBERS'), {
        keys: ['auth:user:user-123:tokens'],
        arguments: ['auth:refresh'],
      });
    });

    it('should return 0 if user has no tokens', async () => {
      mockRedisClient.eval.mockResolvedValue(0);

      const result = await service.invalidateAllUserTokens('user-123');

      expect(result).toBe(0);
    });

    it('should handle string result from Lua script', async () => {
      mockRedisClient.eval.mockResolvedValue('5');

      const result = await service.invalidateAllUserTokens('user-123');

      expect(result).toBe(5);
    });

    it('should handle null result from Lua script', async () => {
      mockRedisClient.eval.mockResolvedValue(null);

      const result = await service.invalidateAllUserTokens('user-123');

      expect(result).toBe(0);
    });

    it('should handle Redis eval errors', async () => {
      mockRedisClient.eval.mockRejectedValue(new Error('Redis script error'));

      await expect(service.invalidateAllUserTokens('user-123')).rejects.toThrow('Redis script error');
    });
  });
});
