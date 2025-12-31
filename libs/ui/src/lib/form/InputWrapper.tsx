import { ReactNode } from 'react';

interface InputWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  name?: string;
}

export function InputWrapper({ label, error, required, children, name }: InputWrapperProps) {
  return (
    <div className="w-full flex flex-col">
      <label htmlFor={name} className="flex flex-col space-y-1">
        {label && (
          <span>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        )}
        {children}
      </label>
      {error && (
        <span id={name ? `${name}-error` : undefined} className="text-sm text-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
