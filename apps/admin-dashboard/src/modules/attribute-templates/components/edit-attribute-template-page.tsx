import { FetchError } from '@medusajs/js-sdk';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState } from '../../shared/components/ui/error-state';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { fetchAttributeTemplateById } from '../apiCalls/attribute-templates';
import { AttributeTemplate, type AttributeTemplateSchemaType } from '../types';
import { AttributeTemplateForm } from './attribute-template-form';

export const EditAttributeTemplatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: template,
    isLoading,
    error,
  } = useQuery<AttributeTemplate, FetchError>({
    queryKey: ['attribute-template', id],
    queryFn: () => fetchAttributeTemplateById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center flex-1">
        <LoadingIcon size="lg" />
      </div>
    );
  }

  if (error && !template) {
    return (
      <ErrorState
        code={error.status}
        message={error.message || 'Failed to load template data'}
        actionLabel="Back to Templates"
        actionPath="/attribute-templates"
      />
    );
  }

  if (!template) {
    return (
      <ErrorState
        code={404}
        message={`No template found with ID: ${id}`}
        actionLabel="Back to Templates"
        actionPath="/attribute-templates"
      />
    );
  }

  const initialData: AttributeTemplateSchemaType = {
    name: template.name,
    code: template.code,
    description: template.description || '',
    is_active: template.is_active,
    attribute_definitions: template.attribute_definitions.map((def) => ({
      label: def.label,
      type: def.type as 'text' | 'boolean',
      facet_config: def.facet_config,
    })),
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Edit Attribute Template
        </h1>
        <p className="text-gray-600">
          Update the template information and attribute definitions.
        </p>
      </div>

      <AttributeTemplateForm
        initialData={initialData}
        isEditMode={true}
        templateId={id!}
      />
    </div>
  );
};
