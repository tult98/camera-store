import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { createHash } from 'crypto';
import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { ProductData } from '../../../types/product-data.types';

puppeteer.use(StealthPlugin());

interface S3UploadConfig {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  useSSL: boolean;
  publicUrl: string;
}

interface DescriptionFeature {
  header: string;
  headerLevel: number;
  content: string;
  media: MediaContent | null;
  subFeatures: DescriptionFeature[];
}

interface MediaContent {
  type: 'image' | 'video';
  url: string;
  position: 'left' | 'right' | 'inline';
}

@Processor('product-crawl')
export class ProductCrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(ProductCrawlProcessor.name);

  constructor(private configService: ConfigService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { url } = job.data;

    if (!url) {
      throw new Error('URL is required in job data');
    }

    if (!url.includes('bhphotovideo.com')) {
      throw new Error('URL must be from bhphotovideo.com');
    }

    let browser: Browser | null = null;

    try {
      browser = await this.launchBrowser();
      const page = await this.navigateToPage(browser, url);
      const productData = await this.extractProductData(page);

      if (!productData.title || productData.title.trim() === '') {
        throw new Error(
          'Scraper failed: Product title is missing or empty. This may be due to changed HTML structure, anti-bot protection, or network issues.'
        );
      }

      if (!productData.description || productData.description.length === 0) {
        throw new Error(
          'Scraper failed: Product description is missing or empty. This may be due to changed HTML structure, anti-bot protection, or network issues.'
        );
      }

      await browser.close();

      const result: ProductData = {
        url,
        ...productData,
      };

      const config = this.createS3ConfigFromEnv();
      const s3Client = this.createS3Client(config);
      await this.processProductMedia(result, s3Client, config);

      this.logger.log(`Product crawl completed: ${result.title}`);

      return {
        success: true,
        productData: result,
        jobId: job.id,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (browser) {
        await browser.close();
      }
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Product crawl failed: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed with error: ${error.message}`,
      error.stack
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async launchBrowser(): Promise<Browser> {
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--window-size=1920,1080',
      ],
    });
  }

  private async navigateToPage(browser: Browser, url: string): Promise<Page> {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );

    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    await this.delay(5000);

    let title = await page.title();
    let count = 0;
    while (title.includes('Just a moment')) {
      this.logger.log(`Detecting Cloudflare challenge... ${count} times`);
      await this.delay(10000);
      title = await page.title();
    }

    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    await this.delay(3000);

    return page;
  }

  private async extractProductData(
    page: Page
  ): Promise<Omit<ProductData, 'url'>> {
    return await page.evaluate(() => {
      const titleElement = document.querySelector(
        'h1[data-selenium="productTitle"]'
      );
      const title = titleElement?.textContent?.trim() || '';

      const extractKeySpecs = (): Record<string, string> => {
        const specs: Record<string, string> = {};

        const specsTable = document.querySelector(
          'table[data-selenium="specsItemGroupTable"]'
        );
        if (!specsTable) return specs;

        const keySpecRows = specsTable.querySelectorAll(
          'tr[class*="keySpec_"]'
        );

        keySpecRows.forEach((row) => {
          const labelCell = row.querySelector(
            'td[data-selenium="specsItemGroupTableColumnLabel"]'
          );
          const valueCell = row.querySelector(
            'td[data-selenium="specsItemGroupTableColumnValue"]'
          );

          if (!labelCell || !valueCell) return;

          const label = labelCell.textContent?.trim();
          const valueSpan = valueCell.querySelector('span');
          const value = valueSpan?.textContent?.trim();

          if (label && value) {
            specs[label] = value;
          }
        });

        return specs;
      };

      const parseDescriptionFeatures = (containerElement: Element): any[] => {
        const features: any[] = [];

        const wrapperDiv = containerElement.querySelector(
          'div[class*="feature_"]'
        );
        if (!wrapperDiv) return features;

        const featureBlocks = wrapperDiv.querySelectorAll(
          ':scope > div[class*="feature_"]'
        );

        featureBlocks.forEach((block) => {
          const headerElement = block.querySelector(
            'div[class*="featureHeader_"] div[class*="sizeTitle"]'
          );
          if (!headerElement) return;

          const header = headerElement.textContent?.trim() || '';
          const headerLevel = headerElement.className.includes('sizeTitle2_')
            ? 2
            : headerElement.className.includes('sizeTitle3_')
            ? 3
            : headerElement.className.includes('sizeTitle4_')
            ? 4
            : 2;

          const contentElements = block.querySelectorAll(
            'div[class*="js-injected-html"][class*="text_"]'
          );
          let content = '';
          contentElements.forEach((el) => {
            const htmlContent = el.innerHTML.trim();
            if (htmlContent && !el.closest('div[class*="featureHeader_"]')) {
              const nestedFeatureParent = el.closest('div[class*="feature_"]');
              const isInNestedFeature =
                nestedFeatureParent && nestedFeatureParent !== block;

              if (!isInNestedFeature) {
                content += (content ? '\n\n' : '') + htmlContent;
              }
            }
          });

          let media: any = null;
          const mediaContainer = block.querySelector('div[class*="media_"]');
          if (mediaContainer) {
            const mediaFeatureParent = mediaContainer.closest(
              'div[class*="feature_"]'
            );
            const isMediaInNestedFeature =
              mediaFeatureParent && mediaFeatureParent !== block;

            if (!isMediaInNestedFeature) {
              const parentDiv = mediaContainer.closest(
                'div[class*="hasRightMedia_"], div[class*="hasLeftMedia_"]'
              );
              const position = parentDiv?.className.includes('hasRightMedia_')
                ? 'right'
                : parentDiv?.className.includes('hasLeftMedia_')
                ? 'left'
                : 'inline';

              const videoIframe = mediaContainer.querySelector(
                'iframe[src*="youtube.com"]'
              );
              if (videoIframe) {
                const src = videoIframe.getAttribute('src');
                if (src) {
                  media = {
                    type: 'video',
                    url: src,
                    position,
                  };
                }
              } else {
                const img = mediaContainer.querySelector('img');
                if (img) {
                  const src = img.getAttribute('src');
                  if (src) {
                    const fullSrc = src.startsWith('http')
                      ? src
                      : `https:${src}`;
                    media = {
                      type: 'image',
                      url: fullSrc,
                      position,
                    };
                  }
                }
              }
            }
          }

          const subFeatures: any[] = [];
          const nestedFeatures = block.querySelectorAll(
            ':scope > div[class*="feature_"]'
          );
          nestedFeatures.forEach((nested) => {
            const nestedHeader = nested.querySelector(
              'div[class*="featureHeader_"] div[class*="sizeTitle"]'
            );

            const nestedHeaderText = nestedHeader?.textContent?.trim() || '';
            const nestedHeaderLevel = nestedHeader
              ? nestedHeader.className.includes('sizeTitle3_')
                ? 3
                : nestedHeader.className.includes('sizeTitle4_')
                ? 4
                : 3
              : 3;

            const nestedContentElements = nested.querySelectorAll(
              'div[class*="js-injected-html"][class*="text_"]'
            );
            let nestedContent = '';
            nestedContentElements.forEach((el) => {
              const htmlContent = el.innerHTML.trim();
              if (htmlContent && !el.closest('div[class*="featureHeader_"]')) {
                const deeperFeatureParent = el.closest(
                  'div[class*="feature_"]'
                );
                const isInDeeperFeature =
                  deeperFeatureParent && deeperFeatureParent !== nested;

                if (!isInDeeperFeature) {
                  nestedContent += (nestedContent ? '\n\n' : '') + htmlContent;
                }
              }
            });

            let nestedMedia: any = null;
            const nestedMediaContainer = nested.querySelector(
              'div[class*="media_"]'
            );
            if (nestedMediaContainer) {
              const mediaFeatureParent = nestedMediaContainer.closest(
                'div[class*="feature_"]'
              );
              const isMediaInDeeperFeature =
                mediaFeatureParent && mediaFeatureParent !== nested;

              if (!isMediaInDeeperFeature) {
                const parentDiv = nestedMediaContainer.closest(
                  'div[class*="hasRightMedia_"], div[class*="hasLeftMedia_"]'
                );
                const position = parentDiv?.className.includes('hasRightMedia_')
                  ? 'right'
                  : parentDiv?.className.includes('hasLeftMedia_')
                  ? 'left'
                  : 'inline';

                const videoIframe = nestedMediaContainer.querySelector(
                  'iframe[src*="youtube.com"]'
                );
                if (videoIframe) {
                  const src = videoIframe.getAttribute('src');
                  if (src) {
                    nestedMedia = {
                      type: 'video',
                      url: src,
                      position,
                    };
                  }
                } else {
                  const img = nestedMediaContainer.querySelector('img');
                  if (img) {
                    const src = img.getAttribute('src');
                    if (src) {
                      const fullSrc = src.startsWith('http')
                        ? src
                        : `https:${src}`;
                      nestedMedia = {
                        type: 'image',
                        url: fullSrc,
                        position,
                      };
                    }
                  }
                }
              }
            }

            subFeatures.push({
              header: nestedHeaderText,
              headerLevel: nestedHeaderLevel,
              content: nestedContent,
              media: nestedMedia,
              subFeatures: [],
            });
          });

          features.push({
            header,
            headerLevel,
            content,
            media,
            subFeatures,
          });
        });

        return features;
      };

      const descElement = document.querySelector('article');
      const description = descElement
        ? parseDescriptionFeatures(descElement)
        : [];

      const specs = extractKeySpecs();

      return {
        title,
        description,
        specs,
      };
    });
  }

  private getExtensionFromContentType(contentType: string): string {
    const typeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
    };

    return typeMap[contentType.toLowerCase()] || 'jpg';
  }

  private extractFilenameFromUrl(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      const parts = pathname.split('/');
      const filename = parts[parts.length - 1];
      return filename
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 20);
    } catch {
      return 'image';
    }
  }

  private createS3Client(config: S3UploadConfig): S3Client {
    return new S3Client({
      endpoint: config.endpoint,
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  private createS3ConfigFromEnv(): S3UploadConfig {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'S3_SECRET_ACCESS_KEY'
    );
    const bucketName = this.configService.get<string>('S3_BUCKET');
    const publicUrl = this.configService.get<string>('S3_FILE_URL');

    if (
      !endpoint ||
      !accessKeyId ||
      !secretAccessKey ||
      !bucketName ||
      !publicUrl
    ) {
      throw new Error(
        'Missing required S3 environment variables: S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET, S3_FILE_URL'
      );
    }

    return {
      endpoint,
      accessKeyId,
      secretAccessKey,
      bucketName,
      useSSL: endpoint.startsWith('https'),
      publicUrl,
    };
  }

  private async uploadImageFromUrl(
    s3Client: S3Client,
    config: S3UploadConfig,
    imageUrl: string
  ): Promise<string> {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download image: ${imageUrl} (status: ${response.status})`
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = this.getExtensionFromContentType(contentType);
    const hash = createHash('md5').update(buffer).digest('hex').substring(0, 8);

    const originalFilename = this.extractFilenameFromUrl(imageUrl);
    const filename = `${hash}-${originalFilename}.${extension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const publicUrl = `${config.publicUrl}/${filename}`;

    return publicUrl;
  }

  private async processFeature(
    feature: DescriptionFeature,
    s3Client: S3Client,
    config: S3UploadConfig
  ): Promise<void> {
    if (feature.media) {
      if (feature.media.type === 'image') {
        const newUrl = await this.uploadImageFromUrl(
          s3Client,
          config,
          feature.media.url
        );
        feature.media.url = newUrl;
      }
    }

    for (const subFeature of feature.subFeatures) {
      await this.processFeature(subFeature, s3Client, config);
    }
  }

  private async processProductMedia(
    productData: ProductData,
    s3Client: S3Client,
    config: S3UploadConfig
  ): Promise<void> {
    for (const feature of productData.description) {
      await this.processFeature(feature, s3Client, config);
    }
  }
}
