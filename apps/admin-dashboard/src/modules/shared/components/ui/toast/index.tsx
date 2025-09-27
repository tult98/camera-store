import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Toast as ToastType } from '@modules/shared/providers/toast-provider';
import { cn } from '@modules/shared/utils/cn';

interface ToastProps {
  toast: ToastType;
  onClose?: (id: string) => void;
  className?: string;
}

const iconMap = {
  success: CheckCircleIcon,
  warning: ExclamationCircleIcon,
  error: XCircleIcon,
};

const typeStyles = {
  success: {
    icon: 'text-green-500',
  },
  warning: {
    icon: 'text-amber-500',
  },
  error: {
    icon: 'text-red-500',
  },
};

export function Toast({ toast, onClose, className }: ToastProps) {
  const { id, type, title, subtitle } = toast;
  const Icon = iconMap[type];
  const styles = typeStyles[type];

  const handleClose = () => {
    onClose?.(id);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out max-w-sm w-full',
        className
      )}
    >
      <Icon className={cn('w-6 h-6 flex-shrink-0', styles.icon)} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>

      <button
        type="button"
        onClick={handleClose}
        className="p-1 rounded-full hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-4 flex-shrink-0"
        aria-label="Close notification"
      >
        <XMarkIcon className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}
