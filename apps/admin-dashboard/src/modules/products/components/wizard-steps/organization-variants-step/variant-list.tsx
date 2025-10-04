import { ProductSchemaType } from '@/modules/products/types';
import { FormInput } from '@/modules/shared/components/ui/form-input';
import { FormSelect } from '@/modules/shared/components/ui/form-input/form-select';
import { cn } from '@/modules/shared/utils/cn';
import { getCurrencySymbol } from '@/modules/shared/utils/formatters';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AdminProduct } from '@medusajs/types';
import React from 'react';
import { Control, FieldArrayWithId } from 'react-hook-form';

interface VariantListProps {
  fields: FieldArrayWithId<ProductSchemaType, 'variants', 'id'>[];
  control: Control<ProductSchemaType>;
  product: AdminProduct | null;
  defaultCurrencyCode: string;
  onAppendVariant: () => void;
  onRemoveVariant: (index: number) => void;
}

export const VariantList: React.FC<VariantListProps> = ({
  fields,
  control,
  product,
  defaultCurrencyCode,
  onAppendVariant,
  onRemoveVariant,
}) => {
  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[168px] space-y-3">
        <button
          type="button"
          onClick={onAppendVariant}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Variant
        </button>
        <p className="text-sm text-gray-500 text-center">
          Add product variants with different prices
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className={cn('space-y-4', {
            'border-b border-gray-300 pb-3': index !== fields.length - 1,
          })}
        >
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name={`variants.${index}.title`}
                  control={control}
                  type="text"
                  label="Title"
                  placeholder="e.g., Small / Red"
                />
                <FormInput
                  name={`variants.${index}.prices.0.amount`}
                  control={control}
                  type="number"
                  label="Price"
                  prefix={getCurrencySymbol(defaultCurrencyCode)}
                  formatNumber={true}
                />
              </div>
              {product?.options && product.options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.options.map((option) => (
                    <FormSelect
                      key={option.id}
                      name={`variants.${index}.options.${option.title}`}
                      control={control}
                      label={option.title}
                      placeholder={`Select ${option.title.toLowerCase()}`}
                      options={
                        option.values?.map((optionValue) => ({
                          value: optionValue.value,
                          label: optionValue.value,
                        })) || []
                      }
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemoveVariant(index)}
              className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Remove variant"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onAppendVariant}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Variant
        </button>
      </div>
    </div>
  );
};
