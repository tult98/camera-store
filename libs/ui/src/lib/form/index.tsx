export { InputWrapper } from './InputWrapper';
export { TextInput } from './TextInput';

import { Children, createElement, isValidElement, ReactNode } from 'react';
import { useForm, UseFormProps, FieldValues, SubmitHandler } from 'react-hook-form';

interface FormProps<T extends FieldValues> extends Omit<UseFormProps<T>, 'defaultValues'> {
  defaultValues?: UseFormProps<T>['defaultValues'];
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  className?: string;
}

export function Form<T extends FieldValues>({
  defaultValues,
  children,
  onSubmit,
  className,
  ...useFormOptions
}: FormProps<T>) {
  const methods = useForm<T>({ defaultValues, ...useFormOptions });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        return child.props.name
          ? createElement(child.type, {
              ...child.props,
              register,
              error: errors[child.props.name]?.message,
              key: child.props.name,
            })
          : child;
      })}
    </form>
  );
}
