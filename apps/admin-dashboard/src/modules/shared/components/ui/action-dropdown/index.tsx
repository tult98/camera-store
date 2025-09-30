import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ActionItem {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export interface ActionDropdownProps {
  actions: ActionItem[];
  className?: string;
  trigger?: React.ReactNode;
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  actions,
  className = '',
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 224,
      });
    }
  }, [isOpen]);

  const handleActionClick = (action: ActionItem) => {
    if (!action.disabled && !action.loading) {
      action.onClick();
      setIsOpen(false);
    }
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className="w-56 bg-white rounded-xl shadow-xl z-[9999] border border-gray-100"
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="py-2" role="menu" aria-orientation="vertical">
          {actions.map((action, index) => {
            const isDisabled = action.disabled || action.loading;
            const textColor =
              action.variant === 'danger' ? 'text-red-600' : 'text-gray-700';
            const hoverBg = !isDisabled ? 'hover:bg-gray-50' : '';

            return (
              <button
                key={index}
                className={`flex items-center w-full px-5 py-3 text-base ${textColor} ${hoverBg} transition-colors ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                role="menuitem"
                onClick={() => handleActionClick(action)}
                disabled={isDisabled}
                type="button"
              >
                {action.icon && <action.icon className="w-4 h-4 mr-3" />}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div className={className} ref={triggerRef}>
        {trigger ? (
          <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
        ) : (
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors hover:cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Actions menu"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        )}
      </div>
      {renderDropdown()}
    </>
  );
};
