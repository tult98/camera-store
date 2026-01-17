import { http, HttpResponse, delay, JsonBodyType } from 'msw';
import { server } from './server';

interface MockOptions {
  status?: number;
  delay?: number;
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const createMockApi = (baseUrl: string) => {
  const createHandler =
    (method: HttpMethod) =>
    <T extends JsonBodyType>(path: string, response: T, options?: MockOptions) => {
      const { status = 200, delay: delayMs } = options ?? {};
      server.use(
        http[method](`${baseUrl}${path}`, async () => {
          if (delayMs) await delay(delayMs);
          return HttpResponse.json(response, { status });
        })
      );
    };

  return {
    get: createHandler('get'),
    post: createHandler('post'),
    put: createHandler('put'),
    patch: createHandler('patch'),
    delete: createHandler('delete'),
    error: (method: HttpMethod, path: string) => {
      server.use(http[method](`${baseUrl}${path}`, () => HttpResponse.error()));
    },
  };
};

export const mockCoreApi = createMockApi('http://localhost:3001');
