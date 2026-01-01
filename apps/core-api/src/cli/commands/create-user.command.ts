import { Inject } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { AuthService } from '../../modules/auth/auth.service';

interface CreateUserOptions {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

@Command({
  name: 'create-user',
  description: 'Create a new admin user',
})
export class CreateUserCommand extends CommandRunner {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super();
  }

  async run(_passedParams: string[], options: CreateUserOptions): Promise<void> {
    try {
      if (!options.email || !options.password) {
        console.error('Error: Email and password are required');
        console.log('Usage: create-user -e <email> -p <password> [-f <firstName>] [-l <lastName>]');
        process.exit(1);
      }

      const user = await this.authService.createUser({
        email: options.email,
        password: options.password,
        firstName: options.firstName,
        lastName: options.lastName,
      });

      console.log('User created successfully:');
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      if (user.firstName) console.log(`  First Name: ${user.firstName}`);
      if (user.lastName) console.log(`  Last Name: ${user.lastName}`);
    } catch (error) {
      console.error('Failed to create user:', (error as Error).message);
      process.exit(1);
    }
  }

  @Option({
    flags: '-e, --email <email>',
    description: 'User email address',
    required: true,
  })
  parseEmail(val: string): string {
    return val;
  }

  @Option({
    flags: '-p, --password <password>',
    description: 'User password',
    required: true,
  })
  parsePassword(val: string): string {
    return val;
  }

  @Option({
    flags: '-f, --firstName <firstName>',
    description: 'User first name',
  })
  parseFirstName(val: string): string {
    return val;
  }

  @Option({
    flags: '-l, --lastName <lastName>',
    description: 'User last name',
  })
  parseLastName(val: string): string {
    return val;
  }
}
