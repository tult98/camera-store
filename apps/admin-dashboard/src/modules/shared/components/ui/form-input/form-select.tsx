import { cn } from '@modules/shared/utils/cn';
import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  shouldUnregister?: boolean;
  required?: boolean;
}

const FormSelectInner = <TFormData extends FieldValues = FieldValues>(
  {
    name,
    control,
    options,
    label,
    placeholder,
    disabled = false,
    className = '',
    shouldUnregister = true,
    required = false,
  }: FormSelectProps<TFormData>,
  ref: React.Ref<any>
) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
    shouldUnregister,
  });

  const hasError = !!error;
  const showErrorState = hasError && isTouched;

  const customStyles: StylesConfig<SelectOption, false> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: 'auto',
      height: 'auto',
      padding: '2px 4px',
      border: showErrorState
        ? '1px solid #ef4444'
        : state.isFocused
        ? '1px solid transparent'
        : '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: disabled ? '#f9fafb' : '#ffffff',
      boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : 'none',
      cursor: disabled ? 'not-allowed' : 'default',
      opacity: disabled ? 0.6 : 1,
      '&:hover': {
        borderColor: showErrorState ? '#ef4444' : '#d1d5db',
      },
      transition: 'all 0.2s',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '6px 8px',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      color: '#111827',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      margin: 0,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#111827',
      margin: 0,
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: 'auto',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#9ca3af',
      padding: '4px',
      '&:hover': {
        color: '#6b7280',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
        ? '#eff6ff'
        : 'transparent',
      color: state.isSelected ? '#ffffff' : '#111827',
      padding: '8px 12px',
      borderRadius: '4px',
      margin: '2px 0',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff',
      },
    }),
  };

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

      <Select
        ref={ref}
        inputId={name}
        name={name}
        value={options.find((option) => option.value === field.value) || null}
        onChange={(selectedOption) => {
          field.onChange(selectedOption?.value || '');
        }}
        onBlur={field.onBlur}
        options={options}
        placeholder={placeholder}
        isDisabled={disabled}
        styles={customStyles}
        aria-invalid={showErrorState}
        aria-describedby={showErrorState ? `${name}-error` : undefined}
        menuPortalTarget={
          typeof document !== 'undefined' ? document.body : null
        }
        menuPosition="fixed"
      />

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

const _FormSelect = React.forwardRef(FormSelectInner);
_FormSelect.displayName = 'FormSelect';

export const FormSelect = _FormSelect as <
  TFormData extends FieldValues = FieldValues
>(
  props: FormSelectProps<TFormData> & { ref?: React.Ref<any> }
) => React.ReactElement;
