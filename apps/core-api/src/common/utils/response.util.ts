import { ResourceResponse } from '../types/response.types';

export function createResourceResponse<T>(resourceKey: string, data: T): ResourceResponse<T> {
  return {
    [resourceKey]: data,
  } as ResourceResponse<T>;
}
