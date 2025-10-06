import { sdk } from '@modules/shared/api/medusa-client';
import type { AttributeTemplate } from '../types';

interface FetchAttributeTemplatesResponse {
  attribute_templates: AttributeTemplate[];
  count: number;
  limit: number;
  offset: number;
}

export const fetchAttributeTemplates =
  async (): Promise<AttributeTemplate[]> => {
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

    return response.attribute_templates || [];
  };

export const deleteAttributeTemplate = async (id: string): Promise<void> => {
  await sdk.client.fetch(`/admin/attribute-templates/${id}`, {
    method: 'DELETE',
  });
};
