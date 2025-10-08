import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { cn } from '@modules/shared/utils/cn';
import React, { useCallback, useState } from 'react';
import { Control, FieldValues, Path, useController, useFormState } from 'react-hook-form';

/**
 * A reusable form input component with React Hook Form integration
 * @template TFormData - The form data type for type-safe field names
 */
interface FormInputProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  shouldUnregister?: boolean;
  required?: boolean;
  prefix?: string;
  formatNumber?: boolean;
}

const FormInputInner = <TFormData extends FieldValues = FieldValues>(
  {
    name,
    control,
    type = 'text',
    label,
    placeholder,
    disabled = false,
    className = '',
    inputClassName = '',
    shouldUnregister = false,
    required = false,
    prefix,
    formatNumber = false,
  }: FormInputProps<TFormData>,
  ref: React.Ref<HTMLInputElement>
) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
    shouldUnregister,
  });

  const { isSubmitted } = useFormState({ control });

  const formatNumberValue = (value: number | string): string => {
    if (value === '' || value === null || value === undefined) return '';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('en-US');
  };

  const parseNumberValue = (value: string): number => {
    const cleanValue = value.replace(/,/g, '');
    const numValue = parseFloat(cleanValue);
    return isNaN(numValue) ? 0 : numValue;
  };

  const displayValue = formatNumber && type === 'number'
    ? formatNumberValue(field.value)
    : field.value;

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formatNumber && type === 'number') {
      const numericValue = parseNumberValue(e.target.value);
      field.onChange(numericValue);
    } else {
      field.onChange(e);
    }
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = !!error;
  const showErrorState = hasError && (isTouched || isSubmitted);

  const inputClasses = cn(
    'input-base input-focus',
    disabled && 'input-disabled',
    showErrorState && 'input-error',
    prefix && '!pl-6',
    inputClassName
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="label-wrapper" htmlFor={name}>
          <span className="label-text">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          {...field}
          value={displayValue}
          onChange={handleNumberChange}
          ref={ref}
          id={name}
          type={formatNumber && type === 'number' ? 'text' : inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={showErrorState}
          aria-describedby={showErrorState ? `${name}-error` : undefined}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {showErrorState && (
        <div className="mt-1">
          <span
            id={`${name}-error`}
            className="input-error-message"
            role="alert"
          >
            {error?.message}
          </span>
        </div>
      )}
    </div>
  );
};

const _FormInput = React.forwardRef(FormInputInner);
_FormInput.displayName = 'FormInput';

export const FormInput = _FormInput as <TFormData extends FieldValues = FieldValues>(
  props: FormInputProps<TFormData> & { ref?: React.Ref<HTMLInputElement> }
) => React.ReactElement;
