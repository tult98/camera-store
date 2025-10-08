import { cn } from '@modules/shared/utils/cn';
import React from 'react';
import { Control, FieldValues, Path, useController, useFormState } from 'react-hook-form';

interface FormTextareaProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  shouldUnregister?: boolean;
  required?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const FormTextareaInner = <TFormData extends FieldValues = FieldValues>(
  {
    name,
    control,
    label,
    placeholder,
    disabled = false,
    className = '',
    shouldUnregister = false,
    required = false,
    rows = 4,
    resize = 'vertical',
  }: FormTextareaProps<TFormData>,
  ref: React.Ref<HTMLTextAreaElement>
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

  const textareaClasses = cn(
    'input-base input-focus',
    disabled && 'input-disabled',
    showErrorState && 'input-error',
    // Add resize style
    resize === 'none' && 'resize-none',
    resize === 'vertical' && 'resize-y',
    resize === 'horizontal' && 'resize-x',
    resize === 'both' && 'resize'
  );

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
        <textarea
          {...field}
          ref={ref}
          id={name}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={textareaClasses}
          aria-invalid={showErrorState}
          aria-describedby={showErrorState ? `${name}-error` : undefined}
        />
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

const _FormTextarea = React.forwardRef(FormTextareaInner);
_FormTextarea.displayName = 'FormTextarea';

export const FormTextarea = _FormTextarea as <TFormData extends FieldValues = FieldValues>(
  props: FormTextareaProps<TFormData> & { ref?: React.Ref<HTMLTextAreaElement> }
) => React.ReactElement;