import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { InputWrapper } from './InputWrapper';
import { cn } from '../utils/cn';

interface TextInputProps<T extends FieldValues> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: Path<T>;
  register?: UseFormRegister<T>;
  label?: string;
  error?: string;
}

export function TextInput<T extends FieldValues>({
  register,
  name,
  label,
  error,
  required,
  className,
  ...rest
}: TextInputProps<T>) {
  return (
    <InputWrapper label={label} error={error} required={required} name={name}>
      <input
        {...rest}
        {...(register ? register(name) : { name })}
        id={name}
        className={cn('input', 'w-full', error && 'input-error', className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
    </InputWrapper>
  );
}
