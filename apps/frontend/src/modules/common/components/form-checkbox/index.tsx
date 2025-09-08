"use client"

import React, { forwardRef } from "react"
import { FieldError } from "react-hook-form"

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  error?: FieldError | string
  helperText?: string
}

const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(({
  label,
  error,
  helperText,
  className = "",
  ...props
}, ref) => {
  const hasError = !!error
  const errorMessage = typeof error === 'string' ? error : error?.message

  return (
    <div className="form-control">
      <label className="label cursor-pointer justify-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          className={`
            checkbox checkbox-primary
            ${hasError ? 'checkbox-error' : ''}
            ${className}
          `}
          {...props}
        />
        <span className="label-text font-medium">{label}</span>
      </label>
      
      {(hasError || helperText) && (
        <label className="label">
          {hasError && (
            <span className="label-text-alt text-error">{errorMessage}</span>
          )}
          {helperText && !hasError && (
            <span className="label-text-alt text-base-content/60">{helperText}</span>
          )}
        </label>
      )}
    </div>
  )
})

FormCheckbox.displayName = "FormCheckbox"

export default FormCheckbox