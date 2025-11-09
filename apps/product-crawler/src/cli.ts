import { Command } from 'commander';
import { consola } from 'consola';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { generateHtmlDescription } from './services/html-template-generator.service';
import { processProductMedia } from './services/media-processor.service';
import { createS3Uploader } from './services/s3-upload.service';
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
  .option('--skip-upload', 'Skip uploading images to MinIO')
  .action(
    async (
      url: string,
      options: { skipUpload?: boolean }
    ) => {
      try {
        if (!url.includes('bhphotovideo.com')) {
          consola.error('URL must be from bhphotovideo.com');
          process.exit(1);
        }

        consola.start(`Crawling: ${url}`);

        const productData = await scrapeProduct(url);

        if (!productData.title || productData.title.trim() === '') {
          consola.error('Scraper failed: Product title is missing or empty');
          consola.info(
            'The scraper could not extract essential product data from the page'
          );
          consola.info('This may be due to:');
          consola.info('  - Changed HTML structure on the target website');
          consola.info('  - Anti-bot protection blocking the scraper');
          consola.info('  - Network or page load issues');
          process.exit(1);
        }

        if (!productData.description || productData.description.length === 0) {
          consola.error(
            'Scraper failed: Product description is missing or empty'
          );
          consola.info(
            'The scraper could not extract product features/description'
          );
          process.exit(1);
        }

        if (!productData.specs || Object.keys(productData.specs).length === 0) {
          consola.warn('Warning: Product specifications are missing or empty');
          consola.info(
            'Continuing without specs, but the data may be incomplete...'
          );
        }

        consola.success('Product data extracted successfully');
        consola.info(`Title: ${productData.title}`);
        consola.info(`Features: ${productData.description.length} sections`);
        consola.info(`Specs: ${Object.keys(productData.specs).length} items`);

        const slug = generateSlug(url);
        const timestamp = generateTimestamp();

        if (!options.skipUpload) {
          try {
            consola.info('Uploading media to S3...');
            const uploader = createS3Uploader();
            await processProductMedia(productData, uploader.uploadImageFromUrl);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error occurred';
            consola.warn(`Media upload failed: ${errorMessage}`);
            consola.info('Continuing with original URLs...');
          }
        } else {
          consola.info('Skipping media upload (--skip-upload flag set)');
        }

        try {
          consola.info('Generating HTML description from template...');
          const htmlDescription = generateHtmlDescription(productData);
          productData.seoDescription = htmlDescription;
          consola.success('HTML description generated successfully');
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
          consola.warn(`HTML description generation failed: ${errorMessage}`);
          consola.info('Continuing without HTML description...');
        }

        const outputDir = join(
          process.cwd(),
          'apps',
          'product-crawler',
          'output'
        );
        const filename = `product-${slug}-${timestamp}.json`;
        const filepath = join(outputDir, filename);

        await ensureOutputDirectory(outputDir);
        await writeFile(
          filepath,
          JSON.stringify(productData, null, 2),
          'utf-8'
        );

        consola.success('Crawl complete!');
        consola.info(`Title: ${productData.title}`);
        consola.info(
          `Specs extracted: ${Object.keys(productData.specs).length}`
        );
        consola.info(`Saved to: ${filepath}`);

        consola.success('Finish crawling');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        consola.error('Crawl failed:', errorMessage);
        process.exit(1);
      }
    }
  );

export const runCLI = () => {
  program.parse(process.argv);
};
