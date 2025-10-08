import { cn } from '@modules/shared/utils/cn';
import React from 'react';
import { Control, FieldValues, Path, useController, useFormState } from 'react-hook-form';
import Select, {
  ActionMeta,
  MultiValue,
  SelectInstance,
  SingleValue,
  StylesConfig,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  options?: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  shouldUnregister?: boolean;
  required?: boolean;
  isMulti?: boolean;
  isCreatable?: boolean;
  isClearable?: boolean;
}

const FormSelectInner = <TFormData extends FieldValues = FieldValues>(
  {
    name,
    control,
    options = [],
    label,
    placeholder,
    disabled = false,
    className = '',
    shouldUnregister = false,
    required = false,
    isMulti = false,
    isCreatable = false,
    isClearable = false,
  }: FormSelectProps<TFormData>,
  ref: React.Ref<SelectInstance<SelectOption>>
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

  const customStyles: StylesConfig<SelectOption | undefined, boolean> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '38px',
      height: 'auto',
      padding: '0',
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
      padding: '0.25rem 0.5rem',
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
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#eff6ff',
      borderRadius: '4px',
      padding: '1px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1e40af',
      padding: '1px 6px',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#1e40af',
      ':hover': {
        backgroundColor: '#dbeafe',
        color: '#1e3a8a',
      },
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
    clearIndicator: (provided) => ({
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

  const getSelectValue = () => {
    if (isMulti) {
      if (isCreatable) {
        return (field.value || []).map((val: string) => ({
          value: val,
          label: val,
        }));
      }
      return (field.value || [])
        .map((val: string) => options.find((option) => option.value === val))
        .filter(Boolean);
    }
    if (isCreatable && field.value) {
      return { value: field.value, label: field.value };
    }
    return options.find((option) => option.value === field.value) || null;
  };

  const handleSelectChange = (
    newValue:
      | MultiValue<SelectOption | undefined>
      | SingleValue<SelectOption | undefined>,
    _actionMeta: ActionMeta<SelectOption | undefined>
  ) => {
    if (isMulti) {
      const values = newValue as MultiValue<SelectOption | undefined>;
      field.onChange(
        values
          .filter((option): option is SelectOption => option !== undefined)
          .map((option) => option.value)
      );
    } else {
      const value = newValue as SingleValue<SelectOption | undefined>;
      field.onChange(value?.value || '');
    }
  };

  const SelectComponent = isCreatable ? CreatableSelect : Select;

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

      <SelectComponent
        ref={ref as any}
        inputId={name}
        name={name}
        value={getSelectValue()}
        onChange={handleSelectChange}
        onBlur={field.onBlur}
        options={options}
        placeholder={placeholder}
        isDisabled={disabled}
        isMulti={isMulti}
        isClearable={isClearable}
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
  props: FormSelectProps<TFormData> & {
    ref?: React.Ref<SelectInstance<SelectOption>>;
  }
) => React.ReactElement;
