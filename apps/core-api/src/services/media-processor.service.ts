import consola from 'consola';
import type { ProductData } from '../types/product-data.types';

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

export interface ProcessingStats {
  totalImages: number;
  successfulUploads: number;
  failedUploads: number;
  skippedVideos: number;
}

type UploadFunction = (imageUrl: string) => Promise<string | null>;

const createInitialStats = (): ProcessingStats => ({
  totalImages: 0,
  successfulUploads: 0,
  failedUploads: 0,
  skippedVideos: 0,
});

const logStats = (stats: ProcessingStats): void => {
  consola.box(
    `Media Processing Complete\n` +
      `Total Images: ${stats.totalImages}\n` +
      `Successful Uploads: ${stats.successfulUploads}\n` +
      `Failed Uploads: ${stats.failedUploads}\n` +
      `Skipped Videos: ${stats.skippedVideos}`
  );

  if (stats.failedUploads > 0) {
    consola.warn(`${stats.failedUploads} image(s) failed to upload`);
  }

  if (stats.successfulUploads > 0) {
    consola.success(`${stats.successfulUploads} image(s) uploaded to MinIO`);
  }
};

const processFeature = async (
  feature: DescriptionFeature,
  uploadFn: UploadFunction,
  stats: ProcessingStats
): Promise<void> => {
  if (feature.media) {
    if (feature.media.type === 'image') {
      stats.totalImages++;
      const newUrl = await uploadFn(feature.media.url);

      if (newUrl) {
        feature.media.url = newUrl;
        stats.successfulUploads++;
      } else {
        stats.failedUploads++;
      }
    } else if (feature.media.type === 'video') {
      stats.skippedVideos++;
      consola.debug(`Skipping video: ${feature.media.url}`);
    }
  }

  for (const subFeature of feature.subFeatures) {
    await processFeature(subFeature, uploadFn, stats);
  }
};

export const processProductMedia = async (
  productData: ProductData,
  uploadFn: UploadFunction
): Promise<{ productData: ProductData; stats: ProcessingStats }> => {
  consola.start('Processing product media...');

  const stats = createInitialStats();

  for (const feature of productData.description) {
    await processFeature(feature, uploadFn, stats);
  }

  logStats(stats);

  return { productData, stats };
};
