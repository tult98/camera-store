import { uploadFile } from '@/modules/shared/apiCalls/upload';
import { cn } from '@/modules/shared/utils/cn';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { NodeViewWrapper } from '@tiptap/react';
import React, { useCallback, useRef, useState } from 'react';

interface InlineImageUploadProps {
  node: any;
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
  editor: any;
}

export const InlineImageUpload: React.FC<InlineImageUploadProps> = ({
  deleteNode,
  editor,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!files.length) return;

      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('Image size must be less than 5MB');
        return;
      }

      setIsUploading(true);
      setError(null);
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
          // First, insert the image at the current cursor position with default center alignment
          editor
            .chain()
            .focus()
            .insertContent({
              type: 'image',
              attrs: {
                src: result.url,
                alt: file.name,
                title: file.name,
                align: 'center',
              },
            })
            .run();

          // Then remove the upload zone using the provided deleteNode function
          deleteNode();
        }, 200);
      } catch (error) {
        setIsUploading(false);
        setUploadProgress(0);
        setError('Failed to upload image. Please try again.');
        console.error('Image upload error:', error);
      }
    },
    [editor, deleteNode]
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

  return (
    <NodeViewWrapper className="inline-image-upload-wrapper">
      <div className="my-4">
        <div
          ref={dropzoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
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

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          {isUploading ? (
            <div className="space-y-3">
              <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowUpTrayIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Uploading image...
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                className={cn(
                  'w-10 h-10 mx-auto rounded-full flex items-center justify-center',
                  isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                )}
              >
                <ArrowUpTrayIcon
                  className={cn(
                    'w-5 h-5',
                    isDragOver ? 'text-blue-600' : 'text-gray-600'
                  )}
                />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Press Delete or Backspace to remove
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};
