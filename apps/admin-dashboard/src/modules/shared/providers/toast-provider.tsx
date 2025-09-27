import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface ToastConfig {
  id?: string;
  type: 'success' | 'warning' | 'error';
  title: string;
  subtitle?: string;
  duration?: number;
  autoClose?: boolean;
}

export interface Toast extends Required<Omit<ToastConfig, 'subtitle'>> {
  subtitle?: string;
  createdAt: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (config: ToastConfig) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showToast = useCallback((config: ToastConfig): string => {
    const id = config.id || generateId();
    const toast: Toast = {
      id,
      type: config.type,
      title: config.title,
      subtitle: config.subtitle,
      duration: config.duration ?? 5000,
      autoClose: config.autoClose ?? true,
      createdAt: Date.now(),
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove toast after duration
    if (toast.autoClose) {
      setTimeout(() => {
        hideToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextValue = {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}