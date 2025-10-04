import { sdk } from '@modules/shared/api/medusa-client';

interface FetchAttributeTemplatesResponse {
  attribute_templates: Array<{ id: string; name: string }>;
  count: number;
  limit: number;
  offset: number;
}

export const fetchAttributeTemplates =
  async (): Promise<FetchAttributeTemplatesResponse> => {
    const response = await sdk.client.fetch<FetchAttributeTemplatesResponse>(
      '/admin/attribute-templates',
      {
        method: 'GET',
        query: {
          limit: 100,
          offset: 0,
        },
      }
    );

    return response;
  };
