import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/cn';

interface HeadingDropdownProps {
  editor: Editor;
  disabled?: boolean;
}

export const HeadingDropdown: React.FC<HeadingDropdownProps> = ({
  editor,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const headingOptions = [
    { level: 0, label: 'Paragraph', command: () => editor.chain().focus().setParagraph().run() },
    { level: 1, label: 'Heading 1', command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { level: 2, label: 'Heading 2', command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { level: 3, label: 'Heading 3', command: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  ];

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    return 'Paragraph';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
          'flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors duration-150',
          'hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
          {
            'text-gray-600 bg-white': !disabled,
            'text-gray-400 cursor-not-allowed': disabled,
            'bg-gray-200': isOpen && !disabled,
          }
        )}
      >
        <span className="min-w-0 truncate">{getCurrentHeading()}</span>
        <ChevronDownIcon
          className={cn(
            'w-3 h-3 transition-transform duration-150',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
          {headingOptions.map((option) => (
            <button
              key={option.level}
              type="button"
              onClick={() => {
                option.command();
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors duration-150',
                {
                  'bg-gray-100': 
                    (option.level === 0 && !editor.isActive('heading')) ||
                    (option.level > 0 && editor.isActive('heading', { level: option.level }))
                }
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};