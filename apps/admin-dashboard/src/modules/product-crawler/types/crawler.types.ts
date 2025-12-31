export interface CrawlProductRequest {
  url: string;
}

export interface CrawlProductResponse {
  jobId: string;
  message: string;
}

export interface MediaContent {
  type: 'image' | 'video';
  url: string;
  position: 'left' | 'right' | 'inline';
}

interface DescriptionFeature {
  header: string;
  headerLevel: number;
  content: string;
  media: MediaContent | null;
  subFeatures: DescriptionFeature[];
}

export interface ProductData {
  url: string;
  title: string;
  description: DescriptionFeature[];
  specs: Record<string, string>;
  seoDescription: string;
}

export interface JobResult {
  success: boolean;
  productData: ProductData;
  jobId: string;
  processedAt: string;
}

export interface JobStatusResponse {
  id: string;
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'waiting-children' | 'prioritized' | 'unknown';
  result?: JobResult;
  failedReason?: string;
}
