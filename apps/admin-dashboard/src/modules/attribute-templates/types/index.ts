import { z } from 'zod';

export interface AttributeDefinition {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  display_order?: number;
}

export interface AttributeTemplate {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  attribute_definitions: AttributeDefinition[];
  created_at?: string;
  updated_at?: string;
}

export interface AttributeTemplateDisplay {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  attributeDefinitionsCount: number;
}

const attributeDefinitionSchema = z.object({
  name: z
    .string()
    .min(1, 'Attribute name is required')
    .max(100, 'Attribute name must be less than 100 characters'),
  type: z.enum(['text', 'boolean']),
});

export const attributeTemplateSchema = z.object({
  name: z
    .string()
    .min(1, 'Template name is required')
    .max(100, 'Template name must be less than 100 characters'),
  code: z
    .string()
    .min(1, 'Code is required')
    .max(100, 'Code must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Code can only contain lowercase letters, numbers, and hyphens'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean(),
  attribute_definitions: z
    .array(attributeDefinitionSchema)
    .min(0, 'At least one attribute definition is recommended'),
});

export type AttributeTemplateSchemaType = z.infer<typeof attributeTemplateSchema>;
