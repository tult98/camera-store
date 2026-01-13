import type { InternalAxiosRequestConfig } from 'axios';
import type { QueuedRequest } from '../types';

export class RequestQueue {
  private queue: QueuedRequest[] = [];

  add(request: QueuedRequest): void {
    this.queue.push(request);
  }

  processAll(token: string): void {
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        const updatedConfig = this.updateConfigWithToken(request.config, token);
        request.resolve(updatedConfig);
      }
    }
  }

  rejectAll(error: Error): void {
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        request.reject(error);
      }
    }
  }

  get length(): number {
    return this.queue.length;
  }

  private updateConfigWithToken(config: InternalAxiosRequestConfig, token: string): InternalAxiosRequestConfig {
    const newConfig = { ...config };
    newConfig.headers = newConfig.headers || {};
    newConfig.headers.Authorization = `Bearer ${token}`;
    return newConfig;
  }
}
