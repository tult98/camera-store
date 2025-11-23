import { cn } from '@modules/shared/utils/cn';
import React from 'react';
import { Control, FieldValues, Path, useController, useFormState } from 'react-hook-form';

interface FormSwitchProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  shouldUnregister?: boolean;
  required?: boolean;
}

const FormSwitchInner = <TFormData extends FieldValues = FieldValues>(
  {
    name,
    control,
    label,
    description,
    disabled = false,
    className = '',
    shouldUnregister = false,
    required = false,
  }: FormSwitchProps<TFormData>,
  ref: React.Ref<HTMLButtonElement>
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
  const isChecked = !!field.value;

  const handleToggle = () => {
    if (!disabled) {
      field.onChange(!isChecked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  const switchClasses = cn(
    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    isChecked ? 'bg-blue-600' : 'bg-gray-200',
    disabled && 'opacity-50 cursor-not-allowed',
    !disabled && 'cursor-pointer',
    showErrorState && 'ring-2 ring-red-500'
  );

  const knobClasses = cn(
    'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out',
    isChecked ? 'translate-x-6' : 'translate-x-1'
  );

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="label-wrapper">
          <label
            id={`${name}-label`}
            className="label-text"
            htmlFor={name}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <span
              id={`${name}-description`}
              className="text-xs text-gray-500 mt-1 block"
            >
              {description}
            </span>
          )}
        </div>
      )}

      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-labelledby={label ? `${name}-label` : undefined}
        aria-describedby={description ? `${name}-description` : undefined}
        aria-invalid={showErrorState}
        disabled={disabled}
        className={switchClasses}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onBlur={field.onBlur}
      >
        <span className={knobClasses} />
      </button>

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

const _FormSwitch = React.forwardRef(FormSwitchInner);
_FormSwitch.displayName = 'FormSwitch';

export const FormSwitch = _FormSwitch as <TFormData extends FieldValues = FieldValues>(
  props: FormSwitchProps<TFormData> & { ref?: React.Ref<HTMLButtonElement> }
) => React.ReactElement;