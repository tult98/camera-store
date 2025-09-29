import { cn } from '@modules/shared/utils/cn';
import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormAsyncSelectProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  loadOptions: (inputValue: string) => Promise<SelectOption[]>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  shouldUnregister?: boolean;
  required?: boolean;
  defaultOptions?: boolean | SelectOption[];
  cacheOptions?: boolean;
  debounceTime?: number;
  loadingMessage?: string | (() => string);
  noOptionsMessage?: string | ((obj: { inputValue: string }) => string);
}

const FormAsyncSelectInner = <TFormData extends FieldValues = FieldValues>(
  {
    name,
    control,
    loadOptions,
    label,
    placeholder,
    disabled = false,
    className = '',
    shouldUnregister = true,
    required = false,
    defaultOptions = true,
    cacheOptions = true,
    debounceTime = 300,
    loadingMessage = 'Loading...',
    noOptionsMessage = 'No options found',
  }: FormAsyncSelectProps<TFormData>,
  ref: React.Ref<HTMLSelectElement>
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

  const debouncePromise = React.useCallback(
    (fn: (inputValue: string) => Promise<SelectOption[]>, time: number) => {
      let timeoutId: NodeJS.Timeout;

      return (inputValue: string): Promise<SelectOption[]> => {
        return new Promise((resolve) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(async () => {
            try {
              const results = await fn(inputValue);
              resolve(results);
            } catch (error) {
              console.error('Error loading options:', error);
              resolve([]);
            }
          }, time);
        });
      };
    },
    []
  );

  const debouncedLoadOptions = React.useMemo(
    () => debouncePromise(loadOptions, debounceTime),
    [loadOptions, debounceTime, debouncePromise]
  );

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
    loadingIndicator: (provided) => ({
      ...provided,
      color: '#3b82f6',
    }),
    loadingMessage: (provided) => ({
      ...provided,
      color: '#6b7280',
      fontSize: '14px',
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: '#6b7280',
      fontSize: '14px',
    }),
  };

  const handleLoadOptions = React.useCallback(
    async (inputValue: string) => {
      try {
        const options = await debouncedLoadOptions(inputValue);
        return options;
      } catch (error) {
        console.error('Error in loadOptions:', error);
        return [];
      }
    },
    [debouncedLoadOptions]
  );

  const [currentValue, setCurrentValue] = React.useState<SelectOption | null>(
    null
  );

  React.useEffect(() => {
    const loadCurrentValue = async () => {
      if (field.value) {
        try {
          const options = await loadOptions('');
          const foundOption = options.find((opt) => opt.value === field.value);
          if (foundOption) {
            setCurrentValue(foundOption);
          }
        } catch (error) {
          console.error('Error loading current value:', error);
        }
      } else {
        setCurrentValue(null);
      }
    };

    loadCurrentValue();
  }, [field.value, loadOptions]);

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

      <AsyncSelect
        ref={ref as any}
        inputId={name}
        name={name}
        value={currentValue}
        onChange={(selectedOption) => {
          field.onChange(selectedOption?.value || '');
          setCurrentValue(selectedOption);
        }}
        onBlur={field.onBlur}
        loadOptions={handleLoadOptions}
        defaultOptions={defaultOptions}
        cacheOptions={cacheOptions}
        placeholder={placeholder}
        isDisabled={disabled}
        styles={customStyles}
        loadingMessage={
          typeof loadingMessage === 'function'
            ? loadingMessage
            : () => loadingMessage
        }
        noOptionsMessage={
          typeof noOptionsMessage === 'function'
            ? noOptionsMessage
            : () => noOptionsMessage
        }
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

const _FormAsyncSelect = React.forwardRef(FormAsyncSelectInner);
_FormAsyncSelect.displayName = 'FormAsyncSelect';

export const FormAsyncSelect = _FormAsyncSelect as <
  TFormData extends FieldValues = FieldValues
>(
  props: FormAsyncSelectProps<TFormData> & { ref?: React.Ref<HTMLSelectElement> }
) => React.ReactElement;
