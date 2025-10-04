import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AttributeTemplateInput } from './attribute-template-step/attribute-template-input';

const attributeTemplateSchema = z.object({
  attributeTemplateId: z.string().optional(),
});

type AttributeTemplateSchemaType = z.infer<typeof attributeTemplateSchema>;

export const AttributeTemplateStep: React.FC = () => {
  const { control } = useForm<AttributeTemplateSchemaType>({
    resolver: zodResolver(attributeTemplateSchema),
    mode: 'onBlur',
    defaultValues: {
      attributeTemplateId: '',
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Attribute Template & Custom Attributes
        </h2>

        <div className="space-y-6">
          <AttributeTemplateInput
            name="attributeTemplateId"
            control={control}
            label="Select Template"
            placeholder="Choose a template..."
          />
        </div>
      </div>
    </div>
  );
};
