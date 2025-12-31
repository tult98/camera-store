import { ReactNode } from 'react';

interface InputWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function InputWrapper({ label, error, required, children }: InputWrapperProps) {
  return (
    <div className="w-full flex flex-col">
      <label className="flex flex-col space-y-1">
        {label && (
          <span>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        )}
        {children}
      </label>
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
}
