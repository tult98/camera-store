import Medusa from '@medusajs/js-sdk';

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  debug: import.meta.env.DEV,
});
