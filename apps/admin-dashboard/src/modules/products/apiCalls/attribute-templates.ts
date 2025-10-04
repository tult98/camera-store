import { sdk } from '@modules/shared/api/medusa-client';

interface AttributeDefinition {
  key: string;
  label: string;
  type: string;
}

export interface AttributeTemplate {
  id: string;
  name: string;
  description?: string;
  code: string;
  attribute_definitions: Array<AttributeDefinition>;
}

interface FetchAttributeTemplatesResponse {
  attribute_templates: Array<AttributeTemplate>;
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
