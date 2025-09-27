import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { Toast } from './index';
import { useToastContext } from '@modules/shared/providers/toast-provider';

export function ToastContainer() {
  const { toasts, hideToast } = useToastContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-in slide-in-from-right-full duration-300"
        >
          <Toast toast={toast} onClose={hideToast} />
        </div>
      ))}
    </div>,
    document.body
  );
}