import { cn } from './utils/cn';

interface ButtonProps {
  text: string;
  variant?: 'filled' | 'outlined';
  intent?: 'primary' | 'danger' | 'success' | 'warning' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  text,
  variant = 'filled',
  intent = 'neutral',
  size = 'medium',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const baseClass = 'btn';

  const variantClass = variant === 'outlined' ? 'btn-outline' : '';

  const intentMap = {
    primary: 'btn-primary',
    danger: 'btn-error',
    success: 'btn-success',
    warning: 'btn-warning',
    neutral: '',
  };

  const intentClass = intentMap[intent];

  const sizeMap = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg',
  };

  const sizeClass = sizeMap[size];

  const loadingClass = loading ? 'loading loading-spinner loading-xs' : '';

  const classes = cn(baseClass, variantClass, intentClass, sizeClass);

  return (
    <button className={classes} disabled={disabled}>
      {loading && <span className={loadingClass} />}
      {text}
    </button>
  );
}

export default Button;
