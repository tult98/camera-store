import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { RedisService } from '../../common/redis/redis.service.js';
import { PrismaService } from '../../database/prisma.service.js';
import { hashPassword, verifyPassword } from './utils/password.util.js';

export interface CreateUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface CreatedUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface AccessTokenPayload {
  sub: string;
  email: string;
  type: 'access';
}

interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: 'refresh';
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  jti: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const GRACE_PERIOD_SECONDS = 30;
const JWT_ISSUER = 'core-api';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {}

  async createUser(input: CreateUserInput): Promise<CreatedUser> {
    const { email, password, firstName, lastName } = input;

    if (!EMAIL_REGEX.test(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email, deleted_at: null },
    });

    if (existingUser) {
      throw new Error(`User with email "${email}" already exists`);
    }

    const userId = randomUUID();
    const authIdentityId = randomUUID();
    const providerIdentityId = randomUUID();

    const passwordHash = await hashPassword(password);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          email,
          first_name: firstName || null,
          last_name: lastName || null,
        },
      });

      await tx.auth_identity.create({
        data: {
          id: authIdentityId,
          app_metadata: { user_id: userId },
        },
      });

      await tx.provider_identity.create({
        data: {
          id: providerIdentityId,
          entity_id: email,
          provider: 'emailpass',
          auth_identity_id: authIdentityId,
          provider_metadata: { password: passwordHash },
        },
      });
    });

    return {
      id: userId,
      email,
      firstName: firstName || null,
      lastName: lastName || null,
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const normalizedEmail = email.toLowerCase();

    const providerIdentity = await this.prisma.provider_identity.findFirst({
      where: {
        entity_id: normalizedEmail,
        provider: 'emailpass',
        deleted_at: null,
      },
      include: {
        auth_identity: true,
      },
    });

    if (!providerIdentity) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const providerMetadata = providerIdentity.provider_metadata as { password?: string } | null;
    const storedHash = providerMetadata?.password;

    if (!storedHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await verifyPassword(password, storedHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const appMetadata = providerIdentity.auth_identity.app_metadata as { user_id?: string } | null;
    const userId = appMetadata?.user_id;

    if (!userId) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, deleted_at: null },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(userId, user.email);

    await this.redisService.set(`refresh:${userId}:${tokens.jti}`, '1', REFRESH_TOKEN_TTL_SECONDS);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }

  async refreshTokens(refreshToken: string): Promise<RefreshResponse> {
    const payload = await this.validateRefreshToken(refreshToken);
    const oldJti = payload.jti;

    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, deleted_at: null },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(payload.sub, user.email);

    await this.redisService.set(`refresh:${payload.sub}:${tokens.jti}`, '1', REFRESH_TOKEN_TTL_SECONDS);

    await this.redisService.expire(`refresh:${payload.sub}:${oldJti}`, GRACE_PERIOD_SECONDS);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
        issuer: JWT_ISSUER,
      });

      if (payload.type === 'refresh' && payload.jti) {
        await this.redisService.del(`refresh:${payload.sub}:${payload.jti}`);
      }
    } catch {
      // Silently ignore invalid tokens for idempotent logout
    }
  }

  private async generateTokens(userId: string, email: string): Promise<TokenPair> {
    const jti = randomUUID();
    const secret = this.configService.get('JWT_SECRET');

    const accessPayload: AccessTokenPayload = {
      sub: userId,
      email,
      type: 'access',
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: userId,
      jti,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret,
        expiresIn: ACCESS_TOKEN_EXPIRY,
        issuer: JWT_ISSUER,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret,
        expiresIn: REFRESH_TOKEN_EXPIRY,
        issuer: JWT_ISSUER,
      }),
    ]);

    return { accessToken, refreshToken, jti };
  }

  private async validateRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
        issuer: JWT_ISSUER,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const exists = await this.redisService.get(`refresh:${payload.sub}:${payload.jti}`);
    if (!exists) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return payload;
  }
}
