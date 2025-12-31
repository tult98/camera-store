import { cn } from '../utils/cn';

interface ButtonProps {
  text: string;
  variant?: 'filled' | 'outlined';
  intent?: 'primary' | 'danger' | 'success' | 'warning' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  /** Adds extra horizontal padding (btn-wide) */
  wide?: boolean;
  /** Makes button take full container width (btn-block) */
  block?: boolean;
  /** Makes button 1:1 aspect ratio (btn-square) */
  square?: boolean;
  /** Makes button 1:1 aspect ratio with rounded corners (btn-circle) */
  circle?: boolean;
}

export function Button({
  text,
  variant = 'filled',
  intent = 'neutral',
  size = 'medium',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  wide = false,
  block = false,
  square = false,
  circle = false,
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

  const classes = cn(
    baseClass,
    variantClass,
    intentClass,
    sizeClass,
    wide && 'btn-wide',
    block && 'btn-block',
    square && 'btn-square',
    circle && 'btn-circle'
  );

  return (
    <button className={classes} disabled={disabled || loading} type={type} onClick={onClick}>
      {loading && <span className={loadingClass} />}
      {text}
    </button>
  );
}

export default Button;
