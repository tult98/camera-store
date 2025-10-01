import React from 'react';
import { cn } from '../../../utils/cn';

interface ToolbarButtonProps {
  icon: React.ComponentType<{ className?: string }> | (() => React.ReactNode);
  title: string;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  title,
  isActive,
  disabled = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded transition-colors duration-150',
        'hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
        {
          'bg-gray-200 text-gray-900': isActive && !disabled,
          'text-gray-600': !isActive && !disabled,
          'text-gray-400 cursor-not-allowed': disabled,
          'hover:bg-gray-100': !disabled && !isActive,
        },
        className
      )}
      aria-pressed={isActive}
    >
      {typeof Icon === 'function' && Icon.length === 0 ? (
        <Icon />
      ) : (
        <Icon className="w-4 h-4" />
      )}
    </button>
  );
};