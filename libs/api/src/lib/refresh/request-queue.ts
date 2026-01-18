import type { QueuedRequest } from '../types';
import { updateConfigWithToken } from '../utils/token-utils';

export function createRequestQueue() {
  const queue: QueuedRequest[] = [];

  return {
    add: (request: QueuedRequest): void => {
      queue.push(request);
    },
    processAll: (token: string): void => {
      while (queue.length > 0) {
        const request = queue.shift();
        if (request) {
          const updatedConfig = updateConfigWithToken(request.config, token);
          request.resolve(updatedConfig);
        }
      }
    },
    rejectAll: (error: Error): void => {
      while (queue.length > 0) {
        const request = queue.shift();
        request?.reject(error);
      }
    },
    getLength: (): number => queue.length,
  };
}

export type RequestQueue = ReturnType<typeof createRequestQueue>;
