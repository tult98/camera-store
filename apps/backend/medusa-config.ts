import { defineConfig, loadEnv } from '@medusajs/framework/utils';

loadEnv(process.env['NODE_ENV'] || 'development', process.cwd());

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl,
    http: {
      storeCors: process.env['STORE_CORS'] || 'http://localhost:8000',
      adminCors: process.env['ADMIN_CORS'] || 'http://localhost:7001',
      authCors: process.env['AUTH_CORS'] || 'http://localhost:8000',
      jwtSecret: process.env['JWT_SECRET'] || 'supersecret',
      cookieSecret: process.env['COOKIE_SECRET'] || 'supersecret',
    },
  },
  modules: [
    {
      resolve: './src/modules/product-attributes',
    },
    {
      resolve: './src/modules/banner',
    },
    {
      resolve: './src/modules/brand',
    },
    {
      resolve: '@medusajs/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/file-s3',
            id: 's3',
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    },
  ],
});
