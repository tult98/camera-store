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
