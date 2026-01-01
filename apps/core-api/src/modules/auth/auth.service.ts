import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { hashPassword } from './utils/password.util';

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

@Injectable()
export class AuthService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async createUser(input: CreateUserInput): Promise<CreatedUser> {
    const { email, password, firstName, lastName } = input;

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
