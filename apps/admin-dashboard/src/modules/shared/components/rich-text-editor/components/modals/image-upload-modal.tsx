import {
  ArrowUpTrayIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { uploadFile } from '@/modules/shared/apiCalls/upload';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@modules/shared/utils/cn';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string) => void;
  onError?: (error: string) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsDragOver(false);
      setIsUploading(false);
      setUploadProgress(0);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!files.length) return;

      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        onError?.('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        onError?.('Image size must be less than 5MB');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const result = await uploadFile(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Small delay to show 100% progress
        setTimeout(() => {
          onUpload(result.url);
          setIsUploading(false);
          setUploadProgress(0);
        }, 200);
      } catch (error) {
        setIsUploading(false);
        setUploadProgress(0);
        onError?.('Failed to upload image. Please try again.');
        console.error('Image upload error:', error);
      }
    },
    [onUpload, onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set dragOver to false if we're actually leaving the dropzone
    if (
      dropzoneRef.current &&
      !dropzoneRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload]
  );

  const handleClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isUploading) {
        onClose();
      }
    },
    [onClose, isUploading]
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
          onClick={!isUploading ? onClose : undefined}
        />

        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PhotoIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Upload Image
              </h3>
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div
              ref={dropzoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={cn(
                'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                {
                  'border-blue-400 bg-blue-50': isDragOver && !isUploading,
                  'border-gray-300 hover:border-gray-400':
                    !isDragOver && !isUploading,
                  'border-gray-200 bg-gray-50': isUploading,
                  'cursor-pointer': !isUploading,
                  'cursor-wait': isUploading,
                }
              )}
              tabIndex={0}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploading}
              />

              {isUploading ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <ArrowUpTrayIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Uploading image...</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadProgress}%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className={cn(
                      'w-12 h-12 mx-auto rounded-full flex items-center justify-center',
                      isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                    )}
                  >
                    <ArrowUpTrayIcon
                      className={cn(
                        'w-6 h-6',
                        isDragOver ? 'text-blue-600' : 'text-gray-600'
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum 3 files, 5MB each
                    </p>
                  </div>
                </div>
              )}
            </div>
            {!isUploading && (
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
