import { cn } from '@modules/shared/utils/cn';
import React from 'react';
import { Control, FieldValues, Path, useController, useFormState } from 'react-hook-form';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface FormRadioGroupProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  options: RadioOption[];
  label?: string;
  disabled?: boolean;
  className?: string;
  shouldUnregister?: boolean;
  required?: boolean;
  direction?: 'horizontal' | 'vertical';
}

const FormRadioGroupInner = <TFormData extends FieldValues = FieldValues>(
  {
    name,
    control,
    options,
    label,
    disabled = false,
    className = '',
    shouldUnregister = false,
    required = false,
    direction = 'horizontal',
  }: FormRadioGroupProps<TFormData>,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
    shouldUnregister,
  });

  const { isSubmitted } = useFormState({ control });

  const hasError = !!error;
  const showErrorState = hasError && (isTouched || isSubmitted);

  const handleChange = (value: string) => {
    if (!disabled) {
      field.onChange(value);
    }
  };

  return (
    <div className={cn('w-full', className)} ref={ref}>
      {label && (
        <div className="label-wrapper mb-2">
          <label className="label-text">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}

      <div
        className={cn('flex gap-4', direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}
        role="radiogroup"
        aria-labelledby={label ? `${name}-label` : undefined}
        aria-invalid={showErrorState}
      >
        {options.map((option) => {
          const isChecked = field.value === option.value;
          const optionId = `${name}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn('flex items-start gap-2 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}
            >
              <input
                id={optionId}
                type="radio"
                name={field.name}
                value={option.value}
                checked={isChecked}
                disabled={disabled}
                onChange={() => handleChange(option.value)}
                onBlur={field.onBlur}
                className={cn(
                  'appearance-none w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0',
                  'transition-all duration-200 ease-in-out',
                  isChecked ? 'border-blue-600 bg-blue-600 shadow-[inset_0_0_0_3px_white]' : 'border-gray-300 bg-white',
                  showErrorState && 'border-red-500',
                  disabled && 'cursor-not-allowed',
                  !disabled && 'hover:border-blue-400'
                )}
                aria-describedby={option.description ? `${optionId}-description` : undefined}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{option.label}</span>
                {option.description && (
                  <span id={`${optionId}-description`} className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {showErrorState && (
        <div className="mt-1">
          <span id={`${name}-error`} className="input-error-message" role="alert">
            {error?.message}
          </span>
        </div>
      )}
    </div>
  );
};

const _FormRadioGroup = React.forwardRef(FormRadioGroupInner);
_FormRadioGroup.displayName = 'FormRadioGroup';

export const FormRadioGroup = _FormRadioGroup as <TFormData extends FieldValues = FieldValues>(
  props: FormRadioGroupProps<TFormData> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;
