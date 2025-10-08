import { cn } from '@modules/shared/utils/cn';
import React from 'react';
import { Control, FieldValues, Path, useController, useFormState } from 'react-hook-form';
import { RichTextEditor } from '../../rich-text-editor';

interface FormRichTextEditorProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  shouldUnregister?: boolean;
  required?: boolean;
  minHeight?: number;
  maxHeight?: number;
  onError?: (error: string) => void;
}

const FormRichTextEditorInner = <TFormData extends FieldValues = FieldValues>(
  {
    name,
    control,
    label,
    placeholder = 'Start writing...',
    disabled = false,
    className = '',
    shouldUnregister = false,
    required = false,
    minHeight = 200,
    maxHeight = 500,
    onError,
  }: FormRichTextEditorProps<TFormData>,
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

  const handleChange = (html: string) => {
    field.onChange(html);
  };

  return (
    <div className={cn('w-full', className)} ref={ref}>
      {label && (
        <label className="label-wrapper" htmlFor={name}>
          <span className="label-text">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      <div className={cn(showErrorState && 'ring-2 ring-red-500 rounded-lg')}>
        <RichTextEditor
          content={field.value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          minHeight={minHeight}
          maxHeight={maxHeight}
          onError={onError}
          className={cn(showErrorState && 'border-red-500')}
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

const _FormRichTextEditor = React.forwardRef(FormRichTextEditorInner);
_FormRichTextEditor.displayName = 'FormRichTextEditor';

export const FormRichTextEditor = _FormRichTextEditor as <TFormData extends FieldValues = FieldValues>(
  props: FormRichTextEditorProps<TFormData> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;