import React, { useEffect } from 'react';
import { Control, Path, PathValue, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { FormSwitch } from '../../../shared/components/ui/form-input/form-switch';
import { attributeTemplateSchema } from '../../types';

type FormSchemaType = z.infer<typeof attributeTemplateSchema>;

interface FilterConfigurationProps {
  control: Control<FormSchemaType>;
  index: number;
  isDisabled: boolean;
  setValue: <TFieldName extends Path<FormSchemaType>>(
    name: TFieldName,
    value: PathValue<FormSchemaType, TFieldName>
  ) => void;
}

export const FilterConfiguration: React.FC<FilterConfigurationProps> = ({
  control,
  index,
  isDisabled,
  setValue,
}) => {
  const attributeType = useWatch({
    control,
    name: `attribute_definitions.${index}.type`,
  });

  useEffect(() => {
    if (attributeType) {
      const aggregationType = attributeType === 'boolean' ? 'boolean' : 'term';
      const displayType = attributeType === 'boolean' ? 'toggle' : 'checkbox';

      setValue(
        `attribute_definitions.${index}.facet_config.aggregation_type`,
        aggregationType
      );
      setValue(
        `attribute_definitions.${index}.facet_config.display_type`,
        displayType
      );
    }
  }, [attributeType, index, setValue]);

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Filter Configuration
      </h4>

      <div className="space-y-3">
        <FormSwitch
          name={`attribute_definitions.${index}.facet_config.is_facet`}
          control={control}
          label="Use as Filter"
          description="Allow customers to filter products by this attribute"
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};
