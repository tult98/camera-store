import { TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Control, Path, PathValue } from 'react-hook-form';
import { z } from 'zod';
import { FormInput } from '../../../shared/components/ui/form-input';
import { FormSelect } from '../../../shared/components/ui/form-input/form-select';
import { cn } from '../../../shared/utils/cn';
import { attributeTemplateSchema } from '../../types';
import { FilterConfiguration } from './filter-configuration';

type FormSchemaType = z.infer<typeof attributeTemplateSchema>;

interface AttributeDefinitionItemProps {
  control: Control<FormSchemaType>;
  index: number;
  isLast: boolean;
  isDisabled: boolean;
  onRemove: () => void;
  setValue: <TFieldName extends Path<FormSchemaType>>(
    name: TFieldName,
    value: PathValue<FormSchemaType, TFieldName>
  ) => void;
}

const typeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'boolean', label: 'Boolean' },
];

export const AttributeDefinitionItem: React.FC<AttributeDefinitionItemProps> = ({
  control,
  index,
  isLast,
  isDisabled,
  onRemove,
  setValue,
}) => {
  return (
    <div
      className={cn('space-y-4', {
        'border-b border-gray-300 pb-3': !isLast,
      })}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name={`attribute_definitions.${index}.label`}
            control={control}
            type="text"
            label="Attribute Name"
            placeholder="e.g., Sensor Size, Mount Type"
            disabled={isDisabled}
            required={true}
          />
          <FormSelect
            name={`attribute_definitions.${index}.type`}
            control={control}
            options={typeOptions}
            label="Type"
            placeholder="Select type"
            disabled={isDisabled}
            required={true}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Remove attribute"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      <FilterConfiguration
        control={control}
        index={index}
        isDisabled={isDisabled}
        setValue={setValue}
      />
    </div>
  );
};
