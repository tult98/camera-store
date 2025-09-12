"use client"

import {
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"
import React, { forwardRef } from "react"
import { FieldError } from "react-hook-form"

interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string
  error?: FieldError | string
  helperText?: string
  showPasswordToggle?: boolean
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      showPasswordToggle = false,
      type = "text",
      className = "",
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [inputType, setInputType] = React.useState(type)

    React.useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }
      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    const hasError = !!error
    const errorMessage = typeof error === "string" ? error : error?.message

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="inline-flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
            {helperText && (
              <div className="tooltip tooltip-info" data-tip={helperText}>
                <InformationCircleIcon className="w-5 h-5 cursor-help" />
              </div>
            )}
          </span>
        </label>

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
            ${
              hasError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""
            }
            ${showPasswordToggle ? "pr-12" : ""}
            ${className}
          `}
            {...props}
          />

          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {hasError && (
          <div className="mt-1">
            <span className="text-sm text-red-500">{errorMessage}</span>
          </div>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"

export default FormInput
