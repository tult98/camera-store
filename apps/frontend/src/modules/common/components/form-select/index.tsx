"use client"

import React, { forwardRef } from "react"
import { FieldError } from "react-hook-form"

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string
  error?: FieldError | string
  helperText?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder = "Select...",
  className = "",
  required = false,
  ...props
}, ref) => {
  const hasError = !!error
  const errorMessage = typeof error === 'string' ? error : error?.message

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      
      <select
        ref={ref}
        className={`
          select select-bordered w-full
          ${hasError ? 'select-error' : 'focus:select-primary'}
          ${className}
        `}
        {...props}
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      <label className="label">
        {hasError && (
          <span className="label-text-alt text-error">{errorMessage}</span>
        )}
        {helperText && !hasError && (
          <span className="label-text-alt text-base-content/60">{helperText}</span>
        )}
      </label>
    </div>
  )
})

FormSelect.displayName = "FormSelect"

export default FormSelect