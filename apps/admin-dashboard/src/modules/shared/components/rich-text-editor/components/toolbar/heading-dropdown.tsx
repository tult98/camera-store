import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/modules/shared/utils/cn';

interface HeadingDropdownProps {
  editor: Editor;
  disabled?: boolean;
}

const headingOptions = [
  { level: 0, label: 'Paragraph', command: 'setParagraph' },
  { level: 1, label: 'Heading 1', command: 'toggleHeading' },
  { level: 2, label: 'Heading 2', command: 'toggleHeading' },
  { level: 3, label: 'Heading 3', command: 'toggleHeading' },
] as const;

export const HeadingDropdown: React.FC<HeadingDropdownProps> = ({
  editor,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return headingOptions[1];
    if (editor.isActive('heading', { level: 2 })) return headingOptions[2];
    if (editor.isActive('heading', { level: 3 })) return headingOptions[3];
    return headingOptions[0];
  };

  const currentHeading = getCurrentHeading();

  const handleOptionClick = (option: (typeof headingOptions)[number]) => {
    if (disabled) return;

    if (option.level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: option.level }).run();
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-1 px-2 py-1 text-sm font-medium rounded transition-colors duration-150',
          'hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
          {
            'bg-gray-200': isOpen && !disabled,
            'text-gray-600': !disabled,
            'text-gray-400 cursor-not-allowed': disabled,
          }
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="min-w-0 truncate max-w-[80px]">
          {currentHeading.level === 0 ? 'P' : `H${currentHeading.level}`}
        </span>
        <ChevronDownIcon
          className={cn(
            'w-3 h-3 transition-transform duration-150',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1" role="listbox">
            {headingOptions.map((option) => (
              <button
                key={option.level}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors duration-150',
                  {
                    'bg-blue-50 text-blue-700':
                      currentHeading.level === option.level,
                    'text-gray-700': currentHeading.level !== option.level,
                  }
                )}
                role="option"
                aria-selected={currentHeading.level === option.level}
              >
                <span
                  className={cn({
                    'text-2xl font-bold': option.level === 1,
                    'text-xl font-semibold': option.level === 2,
                    'text-lg font-medium': option.level === 3,
                    'text-base': option.level === 0,
                  })}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
