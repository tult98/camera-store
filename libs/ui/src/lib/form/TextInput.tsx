import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { InputWrapper } from './InputWrapper';

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
    <InputWrapper label={label} error={error} required={required}>
      <input
        {...(register ? register(name) : { name })}
        className={`input w-full ${error ? 'input-error' : ''} ${className ?? ''}`}
        {...rest}
      />
    </InputWrapper>
  );
}
