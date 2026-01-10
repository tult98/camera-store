import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service.js';
import { ACCESS_TOKEN_EXPIRY, JWT_ISSUER, REFRESH_TOKEN_EXPIRY } from './constants.js';
import { AccessTokenPayload, RefreshTokenPayload } from './types.js';
import { RefreshTokenMetadata, TokenStorageService } from './services/token-storage.service.js';
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

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshJti: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshJti: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenStorageService: TokenStorageService
  ) {}

  async createUser(input: CreateUserInput): Promise<CreatedUser> {
    const { email, password, firstName, lastName } = input;
    const normalizedEmail = email.toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new BadRequestException(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const userId = randomUUID();
    const authIdentityId = randomUUID();
    const providerIdentityId = randomUUID();

    const passwordHash = await hashPassword(password);

    await this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        throw new ConflictException(`User with email "${normalizedEmail}" already exists`);
      }

      await tx.user.create({
        data: {
          id: userId,
          email: normalizedEmail,
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
          entity_id: normalizedEmail,
          provider: 'emailpass',
          auth_identity_id: authIdentityId,
          provider_metadata: { password: passwordHash },
        },
      });
    });

    return {
      id: userId,
      email: normalizedEmail,
      firstName: firstName || null,
      lastName: lastName || null,
    };
  }

  async login(email: string, password: string, userAgent?: string): Promise<LoginResponse> {
    const normalizedEmail = email.toLowerCase();

    const providerIdentity = await this.prisma.provider_identity.findFirst({
      where: {
        entity_id: normalizedEmail,
        provider: 'emailpass',
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
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(userId, user.email);
    const { token: refreshToken, jti: refreshJti } = await this.generateRefreshToken(userId, userAgent);

    return {
      accessToken,
      refreshToken,
      refreshJti,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }

  private async generateAccessToken(userId: string, email: string): Promise<string> {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');

    const payload: AccessTokenPayload = {
      sub: userId,
      email,
      type: 'access',
    };

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: ACCESS_TOKEN_EXPIRY,
      issuer: JWT_ISSUER,
    });
  }

  private async generateRefreshToken(userId: string, userAgent?: string): Promise<{ token: string; jti: string }> {
    const jti = randomUUID();
    const secret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    const payload: RefreshTokenPayload = {
      sub: userId,
      jti,
      type: 'refresh',
    };

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: REFRESH_TOKEN_EXPIRY,
      issuer: JWT_ISSUER,
    });

    const metadata: RefreshTokenMetadata = {
      userId,
      createdAt: Date.now(),
      userAgent,
    };

    await this.tokenStorageService.storeRefreshToken(userId, jti, metadata);

    return { token, jti };
  }

  async validateRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const secret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
        secret,
        issuer: JWT_ISSUER,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const isValid = await this.tokenStorageService.isRefreshTokenValid(payload.sub, payload.jti);

      if (!isValid) {
        throw new UnauthorizedException('Token has been revoked');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error('Error validating refresh token:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async refresh(refreshToken: string, userAgent?: string): Promise<TokenPair> {
    const payload = await this.validateRefreshToken(refreshToken);

    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = await this.generateAccessToken(user.id, user.email);
    const { token: newRefreshToken, jti: refreshJti } = await this.generateRefreshToken(user.id, userAgent);

    await this.tokenStorageService.invalidateRefreshToken(payload.sub, payload.jti);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      refreshJti,
    };
  }

  async logout(userId: string, refreshJti: string): Promise<void> {
    await this.tokenStorageService.invalidateRefreshToken(userId, refreshJti);
  }

  async logoutAllDevices(userId: string): Promise<number> {
    return this.tokenStorageService.invalidateAllUserTokens(userId);
  }
}
