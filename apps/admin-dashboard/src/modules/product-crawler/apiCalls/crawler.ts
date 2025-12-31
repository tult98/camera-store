import apiClient from '@modules/shared/api/api-client';
import type { CrawlProductResponse, JobStatusResponse } from '../types/crawler.types';

export const crawlProduct = async (url: string): Promise<CrawlProductResponse> => {
  const response = await apiClient.post<CrawlProductResponse>('/products/crawl', { url });
  return response.data;
};

export const getJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const response = await apiClient.get<JobStatusResponse>(`/products/jobs/${jobId}`);
  return response.data;
};
