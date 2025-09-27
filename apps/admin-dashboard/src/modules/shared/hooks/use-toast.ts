import { useCallback } from 'react';
import { useToastContext, ToastConfig } from '@modules/shared/providers/toast-provider';

export function useToast() {
  const { showToast, hideToast, clearAllToasts } = useToastContext();

  const toast = useCallback((config: ToastConfig) => {
    return showToast(config);
  }, [showToast]);

  const success = useCallback((title: string, subtitle?: string) => {
    return showToast({ type: 'success', title, subtitle });
  }, [showToast]);

  const warning = useCallback((title: string, subtitle?: string) => {
    return showToast({ type: 'warning', title, subtitle });
  }, [showToast]);

  const error = useCallback((title: string, subtitle?: string) => {
    return showToast({ type: 'error', title, subtitle });
  }, [showToast]);

  const dismiss = useCallback((id: string) => {
    hideToast(id);
  }, [hideToast]);

  const dismissAll = useCallback(() => {
    clearAllToasts();
  }, [clearAllToasts]);

  return {
    toast,
    success,
    warning,
    error,
    dismiss,
    dismissAll,
  };
}