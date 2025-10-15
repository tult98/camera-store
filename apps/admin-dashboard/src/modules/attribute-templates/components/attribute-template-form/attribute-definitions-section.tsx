import { PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Control, Path, PathValue, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { z } from 'zod';
import { attributeTemplateSchema } from '../../types';
import { AttributeDefinitionItem } from './attribute-definition-item';

type FormSchemaType = z.infer<typeof attributeTemplateSchema>;

interface AttributeDefinitionsSectionProps {
  control: Control<FormSchemaType>;
  fields: Record<'id', string>[];
  append: UseFieldArrayAppend<FormSchemaType, 'attribute_definitions'>;
  remove: UseFieldArrayRemove;
  isDisabled: boolean;
  setValue: <TFieldName extends Path<FormSchemaType>>(
    name: TFieldName,
    value: PathValue<FormSchemaType, TFieldName>
  ) => void;
}

export const AttributeDefinitionsSection: React.FC<AttributeDefinitionsSectionProps> = ({
  control,
  fields,
  append,
  remove,
  isDisabled,
  setValue,
}) => {
  const handleAddAttribute = () => {
    append({
      label: '',
      type: 'text',
      facet_config: {
        is_facet: false,
        aggregation_type: 'term',
        display_type: 'checkbox',
        show_count: true,
        max_display_items: 5,
      },
    });
  };

  return (
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
              onClick={handleAddAttribute}
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
              <AttributeDefinitionItem
                key={field.id}
                control={control}
                index={index}
                isLast={index === fields.length - 1}
                isDisabled={isDisabled}
                onRemove={() => remove(index)}
                setValue={setValue}
              />
            ))}

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleAddAttribute}
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
  );
};
