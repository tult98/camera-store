import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service.js';
import { hashPassword } from './utils/password.util.js';

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
}
