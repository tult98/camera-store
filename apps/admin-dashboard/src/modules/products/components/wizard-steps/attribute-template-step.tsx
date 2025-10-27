import { fetchAttributeTemplates } from '@/modules/products/apiCalls/attribute-templates';
import { updateProductMetadata } from '@/modules/products/apiCalls/products';
import { FormInput } from '@/modules/shared/components/ui/form-input';
import { FormSwitch } from '@/modules/shared/components/ui/form-input/form-switch';
import { LoadingIcon } from '@/modules/shared/components/ui/loading-icon';
import { useToast } from '@/modules/shared/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminProduct } from '@medusajs/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AttributeTemplateInput } from './attribute-template-step/attribute-template-input';

const attributeTemplateSchema = z.object({
  template_id: z.string().optional(),
  attribute_values: z
    .record(z.string(), z.union([z.string(), z.boolean(), z.number()]))
    .optional(),
});

type AttributeTemplateSchemaType = z.infer<typeof attributeTemplateSchema>;

interface AttributeTemplateStepProps {
  product: AdminProduct | null;
  onNext: () => void;
  isEditMode?: boolean;
}

export const AttributeTemplateStep: React.FC<AttributeTemplateStepProps> = ({
  product,
  onNext,
  isEditMode = false,
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: templatesData } = useQuery({
    queryKey: ['attribute-templates'],
    queryFn: fetchAttributeTemplates,
  });

  const metadata = product?.metadata || {};
  const { attribute_template_id, ...attributeValuesFromMetadata } = metadata as {
    attribute_template_id?: string;
    [key: string]: unknown;
  };

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<AttributeTemplateSchemaType>({
    resolver: zodResolver(attributeTemplateSchema),
    mode: 'onBlur',
    defaultValues: {
      template_id: attribute_template_id,
      attribute_values: attributeValuesFromMetadata as Record<
        string,
        string | boolean
      >,
    },
  });

  const attributeTemplateId = watch('template_id');

  useEffect(() => {
    if (isDirty && attributeTemplateId && attributeTemplateId !== attribute_template_id) {
      const selectedAttributeTemplate = templatesData?.attribute_templates.find(
        (template) => template.id === attributeTemplateId
      );
      if (selectedAttributeTemplate) {
        setValue(
          'attribute_values',
          selectedAttributeTemplate.attribute_definitions.reduce(
            (acc, attr) => {
              if (attr.type === 'boolean') {
                acc[attr.key] = false;
              } else {
                acc[attr.key] = '';
              }
              return acc;
            },
            {} as Record<string, string | boolean>
          )
        );
      }
    }
  }, [isDirty, attributeTemplateId, attribute_template_id, templatesData, setValue]);

  const selectedAttributeTemplate = templatesData?.attribute_templates.find(
    (template) => template.id === attributeTemplateId
  );

  const updateMetadataMutation = useMutation({
    mutationFn: ({
      productId,
      metadata,
    }: {
      productId: string;
      metadata: Record<string, unknown>;
    }) => updateProductMetadata(productId, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', product?.id] });
      toast.success('Success', 'Product attributes saved successfully!');
      if (!isEditMode) {
        onNext();
      }
    },
    onError: () => {
      toast.error('Error', 'Failed to save attributes. Please try again.');
    },
  });

  const onSubmit = (data: AttributeTemplateSchemaType) => {
    if (!product?.id) {
      toast.error('Error', 'Product ID is required');
      return;
    }

    const metadataToSave: Record<string, unknown> = {
      ...(data.attribute_values || {}),
    };

    if (data.template_id) {
      metadataToSave.attribute_template_id = data.template_id;
    }

    updateMetadataMutation.mutate({
      productId: product.id,
      metadata: metadataToSave,
    });
  };

  const isPending = updateMetadataMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Attribute Template & Custom Attributes
        </h2>

        <div className="space-y-6">
          <AttributeTemplateInput
            name="template_id"
            control={control}
            label="Select Template"
            placeholder="Choose a template..."
            options={
              templatesData?.attribute_templates.map((template) => ({
                value: template.id,
                label: template.name,
              })) || []
            }
          />

          {selectedAttributeTemplate && (
            <div key={selectedAttributeTemplate.id} className="space-y-4 mt-6">
              <h3 className="text-base font-medium text-gray-700">
                Attribute Values
              </h3>
              {selectedAttributeTemplate.attribute_definitions
                .sort((a, b) => {
                  if (a.type === 'boolean' && b.type !== 'boolean') return -1;
                  if (a.type !== 'boolean' && b.type === 'boolean') return 1;
                  return 0;
                })
                .map((attr) => {
                  if (attr.type === 'boolean') {
                    return (
                      <FormSwitch
                        key={attr.key}
                        name={`attribute_values.${attr.key}` as const}
                        control={control}
                        label={attr.label}
                      />
                    );
                  }

                  return (
                    <FormInput
                      key={attr.key}
                      name={`attribute_values.${attr.key}` as const}
                      control={control}
                      label={attr.label}
                      type="text"
                      placeholder={`Enter ${attr.label.toLowerCase()}`}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isPending || !selectedAttributeTemplate}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isPending && (
            <LoadingIcon size="sm" color="white" className="mr-2" />
          )}
          {isEditMode ? 'Save Changes' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
};

export default AttributeTemplateStep;
