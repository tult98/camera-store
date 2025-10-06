import { fetchAttributeTemplates } from '@/modules/products/apiCalls/attribute-templates';
import {
  createProductAttributes,
  fetchProductAttributes,
  ProductAttribute,
  updateProductAttributes,
} from '@/modules/products/apiCalls/product-attributes';
import { FormInput } from '@/modules/shared/components/ui/form-input';
import { FormSwitch } from '@/modules/shared/components/ui/form-input/form-switch';
import { LoadingIcon } from '@/modules/shared/components/ui/loading-icon';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminProduct } from '@medusajs/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AttributeTemplateInput } from './attribute-template-step/attribute-template-input';

const attributeTemplateSchema = z.object({
  product_id: z.string().optional(),
  template_id: z.string().optional(),
  attribute_values: z
    .record(z.string(), z.union([z.string(), z.boolean(), z.number()]))
    .optional(),
});

type AttributeTemplateSchemaType = z.infer<typeof attributeTemplateSchema>;

interface AttributeTemplateStepProps {
  product: AdminProduct | null;
  onNext: () => void;
  onBack: () => void;
  initialValues: ProductAttribute | null;
}

export const AttributeTemplateStep: React.FC<AttributeTemplateStepProps> = ({
  product,
  onNext,
  onBack,
  initialValues,
}) => {
  const { data: templatesData } = useQuery({
    queryKey: ['attribute-templates'],
    queryFn: fetchAttributeTemplates,
  });

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<AttributeTemplateSchemaType>({
    resolver: zodResolver(attributeTemplateSchema),
    mode: 'onBlur',
    defaultValues: initialValues
      ? {
          ...initialValues,
          attribute_values: initialValues.attribute_values as Record<
            string,
            string | boolean
          >,
        }
      : {
          attribute_values: {} as Record<string, string | boolean>,
        },
  });

  const attributeTemplateId = watch('template_id');

  useEffect(() => {
    // select a new attribute template
    if (isDirty && attributeTemplateId !== initialValues?.template_id) {
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
    // switch back to the initial attribute template
    if (isDirty && attributeTemplateId === initialValues?.template_id) {
      setValue(
        'attribute_values',
        initialValues?.attribute_values as Record<string, string | boolean>
      );
    }
  }, [isDirty, attributeTemplateId, initialValues?.template_id, templatesData]);

  const selectedAttributeTemplate = templatesData?.attribute_templates.find(
    (template) => template.id === attributeTemplateId
  );

  const isUpdateMode = !!initialValues?.id;

  const createMutation = useMutation({
    mutationFn: createProductAttributes,
    onSuccess: () => {
      toast.success('Product attributes saved successfully!');
      onNext();
    },
    onError: () => {
      toast.error('Failed to save attributes. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProductAttributes,
    onSuccess: () => {
      toast.success('Product attributes updated successfully!');
      onNext();
    },
    onError: () => {
      toast.error('Failed to update attributes. Please try again.');
    },
  });

  const onSubmit = (data: AttributeTemplateSchemaType) => {
    if (isUpdateMode) {
      updateMutation.mutate({
        id: initialValues.id,
        product_id: data.product_id,
        template_id: data.template_id,
        attribute_values: data.attribute_values || ({} as any),
      });
    } else {
      createMutation.mutate({
        product_id: product?.id!,
        template_id: data.template_id!,
        attribute_values: data.attribute_values || ({} as any),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

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

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isPending || !selectedAttributeTemplate}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isPending && (
            <LoadingIcon size="sm" color="white" className="mr-2" />
          )}
          Next
        </button>
      </div>
    </form>
  );
};

const AttributeTemplateStepWrapper = ({
  product,
  onNext,
  onBack,
}: {
  product: AdminProduct | null;
  onNext: () => void;
  onBack: () => void;
}) => {
  const { data: existingAttributesData, isLoading } = useQuery({
    queryKey: ['product-attributes', product?.id],
    queryFn: () => fetchProductAttributes(product!.id),
    enabled: !!product?.id,
  });

  if (isLoading && !existingAttributesData) {
    return <div>Loading...</div>;
  }

  return (
    <AttributeTemplateStep
      initialValues={existingAttributesData?.product_attributes[0] || null}
      product={product}
      onNext={onNext}
      onBack={onBack}
    />
  );
};

export default AttributeTemplateStepWrapper;
