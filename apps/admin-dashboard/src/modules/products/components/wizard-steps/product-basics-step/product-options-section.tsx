import { cn } from '@/modules/shared/utils/cn';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { FormInput } from '../../../../shared/components/ui/form-input';
import { FormSelect } from '../../../../shared/components/ui/form-input/form-select';
import { ProductSchemaType } from '../../../types';

interface ProductOptionsSectionProps {
  control: Control<ProductSchemaType>;
  isSubmitting: boolean;
}

export const ProductOptionsSection: React.FC<ProductOptionsSectionProps> = ({
  control,
  isSubmitting,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-900">Product Options</h3>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 min-h-[200px]">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[168px] space-y-3">
            <button
              type="button"
              onClick={() => append({ title: '', values: [] })}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Option
            </button>
            <p className="text-sm text-gray-500 text-center">
              Default option will be created if no options are added
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={cn('space-y-4', {
                  'border-b border-gray-300 pb-3': index !== fields.length - 1,
                })}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name={`options.${index}.title`}
                      control={control}
                      type="text"
                      label="Option Name"
                      placeholder="e.g., Color, Size"
                      disabled={isSubmitting}
                    />
                    <FormSelect
                      name={`options.${index}.values`}
                      control={control}
                      label="Option Values"
                      placeholder="Type and press Enter to add values"
                      disabled={isSubmitting}
                      isMulti={true}
                      isCreatable={true}
                      isClearable={true}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Remove option"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => append({ title: '', values: [] })}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Option
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
