import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../../shared/components/ui/form-input';
import { FormSelect } from '../../shared/components/ui/form-input/form-select';
import { FormSwitch } from '../../shared/components/ui/form-input/form-switch';
import { FormTextarea } from '../../shared/components/ui/form-input/form-textarea';
import { LoadingIcon } from '../../shared/components/ui/loading-icon';
import { useToast } from '../../shared/hooks/use-toast';
import { cn } from '../../shared/utils/cn';
import { generateHandle } from '../../shared/utils/formatters';
import { createAttributeTemplate } from '../apiCalls/attribute-templates';
import {
  attributeTemplateSchema,
  type AttributeTemplateSchemaType,
} from '../types';

const typeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'boolean', label: 'Boolean' },
];

export const AttributeTemplateForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<AttributeTemplateSchemaType>({
    resolver: zodResolver(attributeTemplateSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      code: '',
      description: '',
      is_active: true,
      attribute_definitions: [],
    },
  });

  console.log('===================errors:', errors);
  console.log('===================getValues:', getValues());

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attribute_definitions',
  });

  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const name = watch('name');

  useEffect(() => {
    setValue('code', generateHandle(name));
  }, [name, setValue]);

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

  const onSubmit = (data: AttributeTemplateSchemaType) => {
    createMutation.mutate(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h2>

        <div className="space-y-4">
          <FormInput
            name="name"
            control={control}
            type="text"
            label="Template Name"
            placeholder="Enter template name"
            disabled={isSubmitting || createMutation.isPending}
            required={true}
          />

          <FormTextarea
            name="description"
            control={control}
            label="Description"
            placeholder="Enter template description (optional)"
            disabled={isSubmitting || createMutation.isPending}
            rows={3}
          />

          <FormSwitch
            name="is_active"
            control={control}
            label="Active"
            description="Activate this template for use in products"
            disabled={isSubmitting || createMutation.isPending}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Attribute Definitions
          </h2>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 min-h-[200px]">
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[168px] space-y-3">
              <button
                type="button"
                onClick={() => append({ name: '', type: 'text' })}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Attribute
              </button>
              <p className="text-sm text-gray-500 text-center">
                No attributes defined yet. Add your first attribute to get
                started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn('space-y-4', {
                    'border-b border-gray-300 pb-3':
                      index !== fields.length - 1,
                  })}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name={`attribute_definitions.${index}.name`}
                        control={control}
                        type="text"
                        label="Attribute Name"
                        placeholder="e.g., Sensor Size, Mount Type"
                        disabled={isSubmitting || createMutation.isPending}
                      />
                      <FormSelect
                        name={`attribute_definitions.${index}.type`}
                        control={control}
                        options={typeOptions}
                        label="Type"
                        placeholder="Select type"
                        disabled={isSubmitting || createMutation.isPending}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label="Remove attribute"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => append({ name: '', type: 'text' })}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Attribute
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/attribute-templates')}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          disabled={isSubmitting || createMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || createMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {(isSubmitting || createMutation.isPending) && (
            <LoadingIcon size="md" color="white" className="mr-2" />
          )}
          {createMutation.isPending ? 'Creating...' : 'Create Template'}
        </button>
      </div>
    </form>
  );
};
