import { FormSelect } from '@/modules/shared/components/ui/form-input/form-select';
import { Control, FieldValues, Path } from 'react-hook-form';

interface AttributeTemplateInputProps<
  TFormData extends FieldValues = FieldValues
> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options: { value: string; label: string }[];
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
  options,
}: AttributeTemplateInputProps<TFormData>) => {
  return (
    <FormSelect
      name={name}
      control={control}
      options={options}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
    />
  );
};
