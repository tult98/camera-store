import axios, { AxiosInstance } from 'axios';
import consola from 'consola';
import { apiConfig, validateApiConfig } from '../config/api.config';
import { ProductData } from '../types/product-data.types';

interface AuthResponse {
  token: string;
}

interface ProductCreatePayload {
  title: string;
  handle: string;
  description: string | null;
  status: 'draft';
  metadata: Record<string, string>;
  options: { title: string; values: string[] }[];
}

interface ProductCreateResponse {
  product: {
    id: string;
    title: string;
    handle: string;
    status: string;
  };
}

export class ProductApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: apiConfig.backendUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async authenticate(): Promise<void> {
    try {
      const response = await this.client.post<AuthResponse>(
        '/auth/user/emailpass',
        {
          email: apiConfig.adminEmail,
          password: apiConfig.adminPassword,
        }
      );

      this.authToken = response.data.token;

      this.client.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${this.authToken}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Authentication failed: ${
            error.response?.data?.message || error.message
          }`
        );
      }
      throw error;
    }
  }

  async createProduct(
    productData: ProductData
  ): Promise<ProductCreateResponse> {
    validateApiConfig();

    if (!this.authToken) {
      await this.authenticate();
    }

    const payload = this.mapToProductPayload(productData);

    try {
      const response = await this.client.post<ProductCreateResponse>(
        '/admin/products',
        payload
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          await this.authenticate();
          const response = await this.client.post<ProductCreateResponse>(
            '/admin/products',
            payload
          );
          return response.data;
        }

        consola.info('Error:', error);

        throw new Error(
          `Product creation failed: ${
            error.response?.data?.message || error.message
          }`
        );
      }
      throw error;
    }
  }

  private mapToProductPayload(productData: ProductData): ProductCreatePayload {
    const handle = this.generateHandle(productData.url);

    return {
      title: productData.title,
      handle,
      description: productData.seoDescription || null,
      status: 'draft',
      options: [{ title: 'Default option', values: ['Default option value'] }],
      metadata: {
        ...productData.specs,
      },
    };
  }

  private generateHandle(url: string): string {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    const parts = pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1] || '';

    let slug = lastPart.replace(/\.html$/, '');
    slug = slug.replace(/[^a-z0-9]+/gi, '-');
    slug = slug.replace(/^-+|-+$/g, '');
    slug = slug.toLowerCase();

    return slug || 'product';
  }
}
