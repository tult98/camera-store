import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { useToast } from '../../shared/hooks/use-toast';
import { generateHandle } from '../../shared/utils/formatters';
import {
  createAttributeTemplate,
  updateAttributeTemplate,
} from '../apiCalls/attribute-templates';
import {
  attributeTemplateSchema,
  type AttributeTemplateSchemaType,
} from '../types';
import { AttributeDefinitionsSection } from './attribute-template-form/attribute-definitions-section';
import { BasicInformationSection } from './attribute-template-form/basic-information-section';

interface AttributeTemplateFormProps {
  initialData?: AttributeTemplateSchemaType;
  isEditMode?: boolean;
  templateId?: string;
}

type FormSchemaType = z.infer<typeof attributeTemplateSchema>;

export const AttributeTemplateForm: React.FC<AttributeTemplateFormProps> = ({
  initialData,
  isEditMode = false,
  templateId,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(attributeTemplateSchema),
    mode: 'onBlur',
    defaultValues: initialData || {
      name: '',
      code: '',
      description: '',
      is_active: true,
      attribute_definitions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attribute_definitions',
  });

  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const name = watch('name');

  useEffect(() => {
    if (!isEditMode) {
      setValue('code', generateHandle(name));
    }
  }, [name, setValue, isEditMode]);

  const createMutation = useMutation({
    mutationFn: createAttributeTemplate,
    onSuccess: (newTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['attribute-templates'] });
      success(
        'Template created',
        `"${newTemplate.name}" has been created successfully`
      );
      navigate('/attribute-templates');
    },
    onError: (err: Error) => {
      error(
        'Failed to create template',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AttributeTemplateSchemaType) =>
      updateAttributeTemplate(templateId!, data),
    onSuccess: (updatedTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['attribute-templates'] });
      queryClient.invalidateQueries({
        queryKey: ['attribute-template', templateId],
      });
      success(
        'Template updated',
        `"${updatedTemplate.name}" has been updated successfully`
      );
      navigate('/attribute-templates');
    },
    onError: (err: Error) => {
      error(
        'Failed to update template',
        err.message || 'An unexpected error occurred'
      );
    },
  });

  const onSubmit = (data: FormSchemaType) => {
    if (isEditMode) {
      updateMutation.mutate(data as AttributeTemplateSchemaType);
    } else {
      createMutation.mutate(data as AttributeTemplateSchemaType);
    }
  };

  const isDisabled =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <BasicInformationSection control={control} isDisabled={isDisabled} />

      <AttributeDefinitionsSection
        control={control}
        fields={fields}
        append={append}
        remove={remove}
        isDisabled={isDisabled}
        setValue={setValue}
      />

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/attribute-templates')}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          disabled={isDisabled}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isDisabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isDisabled && (
            <LoadingIcon size="md" color="white" className="mr-2" />
          )}
          {isEditMode ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};
