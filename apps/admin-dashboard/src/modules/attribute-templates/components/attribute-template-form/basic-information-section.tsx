import React from 'react';
import { Control } from 'react-hook-form';
import { z } from 'zod';
import { FormInput } from '../../../shared/components/ui/form-input';
import { FormTextarea } from '../../../shared/components/ui/form-input/form-textarea';
import { FormSwitch } from '../../../shared/components/ui/form-input/form-switch';
import { attributeTemplateSchema } from '../../types';

type FormSchemaType = z.infer<typeof attributeTemplateSchema>;

interface BasicInformationSectionProps {
  control: Control<FormSchemaType>;
  isDisabled: boolean;
}

export const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  control,
  isDisabled,
}) => {
  return (
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
          disabled={isDisabled}
          required={true}
        />

        <FormTextarea
          name="description"
          control={control}
          label="Description"
          placeholder="Enter template description (optional)"
          disabled={isDisabled}
          rows={3}
        />

        <FormSwitch
          name="is_active"
          control={control}
          label="Active"
          description="Activate this template for use in products"
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};
