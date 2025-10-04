import { FormSelect } from '@/modules/shared/components/ui/form-input/form-select';
import { useQuery } from '@tanstack/react-query';
import { Control, FieldValues, Path } from 'react-hook-form';
import { fetchAttributeTemplates } from '../../../apiCalls/attribute-templates';

interface AttributeTemplateInputProps<
  TFormData extends FieldValues = FieldValues
> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const AttributeTemplateInput = <
  TFormData extends FieldValues = FieldValues
>({
  name,
  control,
  label = 'Select Template',
  placeholder = 'Choose a template...',
  disabled = false,
  required = false,
}: AttributeTemplateInputProps<TFormData>) => {
  const { data: templatesData } = useQuery({
    queryKey: ['attribute-templates'],
    queryFn: fetchAttributeTemplates,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <FormSelect
      name={name}
      control={control}
      options={templatesData?.attribute_templates.map((template) => ({
        value: template.id,
        label: template.name,
      }))}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
    />
  );
};
