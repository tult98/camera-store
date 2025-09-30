import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/modules/shared/utils/cn';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, text?: string) => void;
  currentUrl?: string;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUrl = '',
}) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setUrl(currentUrl);
      setText('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, currentUrl]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (url.trim()) {
        // Ensure URL has protocol
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        onSubmit(formattedUrl, text.trim() || undefined);
        setUrl('');
        setText('');
      }
    },
    [url, text, onSubmit]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">
                {currentUrl ? 'Edit Link' : 'Add Link'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  'placeholder-gray-400'
                )}
                autoFocus
                required
              />
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Link Text (optional)
              </label>
              <input
                id="text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Link description"
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  'placeholder-gray-400'
                )}
              />
              <p className="mt-1 text-xs text-gray-500">
                If empty, the URL will be used as the link text
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!url.trim()}
                className={cn(
                  'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                  {
                    'bg-blue-600 text-white hover:bg-blue-700': !!url.trim(),
                    'bg-gray-300 text-gray-500 cursor-not-allowed': !url.trim(),
                  }
                )}
              >
                {currentUrl ? 'Update Link' : 'Add Link'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
