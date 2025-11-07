import { Command } from 'commander';
import { consola } from 'consola';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { scrapeProduct } from './services/scraper.service';

const generateSlug = (url: string): string => {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  return lastPart.replace(/\.html$/, '');
};

const generateTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

const ensureOutputDirectory = async (outputPath: string): Promise<void> => {
  try {
    await mkdir(outputPath, { recursive: true });
  } catch (error) {
    throw new Error(
      `Failed to create output directory: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

const program = new Command();

program
  .name('product-crawler')
  .description('Camera product crawler CLI')
  .version('1.0.0');

program
  .command('crawl')
  .description('Crawl a single product from B&H Photo Video')
  .argument('<url>', 'Product URL from bhphotovideo.com')
  .action(async (url: string) => {
    try {
      if (!url.includes('bhphotovideo.com')) {
        consola.error('URL must be from bhphotovideo.com');
        process.exit(1);
      }

      consola.start(`Crawling: ${url}`);

      const productData = await scrapeProduct(url);

      const slug = generateSlug(url);
      const timestamp = generateTimestamp();
      const outputDir = join(
        process.cwd(),
        'apps',
        'product-crawler',
        'output'
      );
      const filename = `product-${slug}-${timestamp}.json`;
      const filepath = join(outputDir, filename);

      await ensureOutputDirectory(outputDir);
      await writeFile(filepath, JSON.stringify(productData, null, 2), 'utf-8');

      consola.success('Crawl complete!');
      consola.info(`Title: ${productData.title}`);
      consola.info(`Specs extracted: ${Object.keys(productData.specs).length}`);
      consola.info(`Saved to: ${filepath}`);

      console.log('\n--- Product Data ---\n');
      console.log(JSON.stringify(productData, null, 2));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      consola.error('Crawl failed:', errorMessage);
      process.exit(1);
    }
  });

export const runCLI = () => {
  program.parse(process.argv);
};
