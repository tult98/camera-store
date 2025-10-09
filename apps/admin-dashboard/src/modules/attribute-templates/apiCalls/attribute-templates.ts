import { sdk } from '@modules/shared/api/medusa-client';
import type { AttributeTemplate, AttributeTemplateSchemaType } from '../types';

interface FetchAttributeTemplatesResponse {
  attribute_templates: AttributeTemplate[];
  count: number;
  limit: number;
  offset: number;
}

interface CreateAttributeTemplateResponse {
  attribute_template: AttributeTemplate;
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

export const createAttributeTemplate = async (
  data: AttributeTemplateSchemaType
): Promise<AttributeTemplate> => {
  const response = await sdk.client.fetch<CreateAttributeTemplateResponse>(
    '/admin/attribute-templates',
    {
      method: 'POST',
      body: data,
    }
  );

  return response.attribute_template;
};

export const fetchAttributeTemplateById = async (
  id: string
): Promise<AttributeTemplate> => {
  const response = await sdk.client.fetch<{ attribute_template: AttributeTemplate }>(
    `/admin/attribute-templates/${id}`,
    {
      method: 'GET',
    }
  );

  return response.attribute_template;
};

export const updateAttributeTemplate = async (
  id: string,
  data: AttributeTemplateSchemaType
): Promise<AttributeTemplate> => {
  const response = await sdk.client.fetch<{ attribute_template: AttributeTemplate }>(
    `/admin/attribute-templates/${id}`,
    {
      method: 'PUT',
      body: data,
    }
  );

  return response.attribute_template;
};

export const deleteAttributeTemplate = async (id: string): Promise<void> => {
  await sdk.client.fetch(`/admin/attribute-templates/${id}`, {
    method: 'DELETE',
  });
};
