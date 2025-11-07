import { Command } from 'commander';

const program = new Command();

program
  .name('product-crawler')
  .description('Crawl product data, enhance with AI, and create in Medusa')
  .version('1.0.0');

program
  .command('hello')
  .description('Test command that prints Hello World')
  .action(() => {
    console.log('Hello World!');
  });

export const runCLI = () => {
  program.parse(process.argv);
};
