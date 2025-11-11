import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import consola from 'consola';
import { createHash } from 'crypto';

export interface S3UploadConfig {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  useSSL: boolean;
  publicUrl: string;
}

const getExtensionFromContentType = (contentType: string): string => {
  const typeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };

  return typeMap[contentType.toLowerCase()] || 'jpg';
};

const extractFilenameFromUrl = (url: string): string => {
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
};

const createS3Client = (config: S3UploadConfig): S3Client => {
  return new S3Client({
    endpoint: config.endpoint,
    region: 'us-east-1',
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
  });
};

export const uploadImageFromUrl = async (
  s3Client: S3Client,
  config: S3UploadConfig,
  imageUrl: string
): Promise<string | null> => {
  try {
    consola.debug(`Downloading image: ${imageUrl}`);

    const response = await fetch(imageUrl);

    if (!response.ok) {
      consola.warn(
        `Failed to download image: ${imageUrl} (${response.status})`
      );
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = getExtensionFromContentType(contentType);
    const hash = createHash('md5').update(buffer).digest('hex').substring(0, 8);

    const originalFilename = extractFilenameFromUrl(imageUrl);
    const filename = `${hash}-${originalFilename}.${extension}`;

    consola.debug(`Uploading to S3: ${filename}`);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const publicUrl = `${config.publicUrl}/${filename}`;
    consola.success(`Uploaded: ${publicUrl}`);

    return publicUrl;
  } catch (error) {
    consola.error(
      `Failed to upload image from ${imageUrl}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return null;
  }
};

export const createS3ConfigFromEnv = (): S3UploadConfig => {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const bucketName = process.env.S3_BUCKET;
  const publicUrl = process.env.S3_FILE_URL;

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
};

export const createS3Uploader = () => {
  const config = createS3ConfigFromEnv();
  const s3Client = createS3Client(config);

  return {
    uploadImageFromUrl: (imageUrl: string) =>
      uploadImageFromUrl(s3Client, config, imageUrl),
    config,
  };
};
