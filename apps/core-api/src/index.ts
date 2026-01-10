import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { CliModule } from './cli/cli.module.js';

async function bootstrap() {
  const logger = new Logger('CLI');

  await CommandFactory.run(CliModule, {
    logger: ['error', 'warn'],
    errorHandler: (err) => {
      logger.error('Error:', err.message);
      process.exit(1);
    },
  });
}

bootstrap();
