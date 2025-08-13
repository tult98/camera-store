// API Client for Camera Store

// Temporarily using inline types to resolve module resolution
interface FeaturedCategory {
  id: string;
  category_name: string;
  category_description: string;
  category_handle: string;
  hero_image_url: string;
  display_order: number;
  products: any[];
}

interface FeaturedCategoriesResponse {
  featured_categories: FeaturedCategory[];
}

interface FeaturedCategoryRequest {
  is_featured: boolean;
  hero_image_url?: string;
  display_order?: number;
}

interface CategoryFeaturedResponse {
  category: any;
  message: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiClientConfig {
  baseUrl: string;
  publishableKey: string;
  timeout?: number;
}

export class CameraStoreApiClient {
  private baseUrl: string;
  private publishableKey: string;
  private timeout: number;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.publishableKey = config.publishableKey;
    this.timeout = config.timeout || 10000;
  }

  private async fetchWithConfig<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (endpoint.startsWith('/store/')) {
      (headers as any)['x-publishable-api-key'] = this.publishableKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  // Store API methods (public endpoints)
  async getFeaturedCategories(): Promise<FeaturedCategory[]> {
    const response = await this.fetchWithConfig<FeaturedCategoriesResponse>(
      '/store/featured-categories'
    );
    return response.featured_categories;
  }

  // Admin API methods (require authentication)
  async setCategoryFeatured(
    categoryId: string,
    data: FeaturedCategoryRequest
  ): Promise<CategoryFeaturedResponse> {
    return this.fetchWithConfig<CategoryFeaturedResponse>(
      `/admin/categories/${categoryId}/featured`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async getCategoryFeaturedStatus(
    categoryId: string
  ): Promise<CategoryFeaturedResponse> {
    return this.fetchWithConfig<CategoryFeaturedResponse>(
      `/admin/categories/${categoryId}/featured`
    );
  }

  // Generic method for custom endpoints
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.fetchWithConfig<T>(endpoint, options);
  }
}

// Factory function for easier instantiation
export function createApiClient(config: ApiClientConfig): CameraStoreApiClient {
  return new CameraStoreApiClient(config);
}

// Default configuration for common environments
export const defaultConfigs = {
  development: {
    baseUrl: 'http://localhost:9000',
  },
  production: {
    baseUrl: process.env['MEDUSA_BACKEND_URL'] || 'https://your-api.domain.com',
  },
};

// Utility function for Next.js apps
export function createNextApiClient(): CameraStoreApiClient {
  const isDevelopment = process.env['NODE_ENV'] === 'development';
  const baseConfig = isDevelopment
    ? defaultConfigs.development
    : defaultConfigs.production;

  const publishableKey = process.env['NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY'];
  if (!publishableKey) {
    throw new Error('NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required');
  }

  return createApiClient({
    ...baseConfig,
    publishableKey,
  });
}

// export * from '@camera-store/shared-types'; // Temporarily disabled due to module resolution issues