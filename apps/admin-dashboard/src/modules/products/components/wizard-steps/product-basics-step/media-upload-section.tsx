import {
  BookmarkIcon,
  CheckIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { LoadingIcon } from '@modules/shared/components/ui/loading-icon';
import { useToast } from '@modules/shared/hooks/use-toast';
import { cn } from '@modules/shared/utils/cn';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { uploadImages } from '../../../apiCalls/uploads';

interface MediaUploadSectionProps {
  images?: Array<{ id?: string; url: string }>;
  thumbnail?: string;
  onSave?: (images: Array<{ id?: string; url: string }>) => void;
  onMakeThumbnail: (imageUrl: string) => void;
  onDeleteImages: (imageIds: string[]) => void;
}

export const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
  images = [],
  thumbnail,
  onSave,
  onMakeThumbnail,
  onDeleteImages,
}) => {
  const toast = useToast();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadImages,
    onSuccess: (uploadedFiles) => {
      const newImages = uploadedFiles.map((file) => ({
        id: `img-${Date.now()}-${Math.random()}`,
        url: file.url,
      }));
      onSave?.(newImages);
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || 'Failed to upload images. Please try again.';
      toast.error(errorMessage);
    },
  });

  const handleFileSelect = useCallback(
    async (files: File[]) => {
      const validFiles = files.filter((file) => {
        const validTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/svg+xml',
        ];
        return validTypes.includes(file.type);
      });

      if (validFiles.length === 0) {
        setValidationError(
          'Please select valid image files (JPG, PNG, GIF, SVG)'
        );
        return;
      }

      setValidationError('');
      uploadMutation.mutate(validFiles);
    },
    [uploadMutation]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(Array.from(files));
      }
    },
    [handleFileSelect]
  );

  const toggleImageSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleMakeThumbnail = () => {
    const selectedId = Array.from(selectedIds)[0];
    const selectedImage = images.find(
      (img) => (img.id || img.url) === selectedId
    );
    if (selectedImage?.url) {
      onMakeThumbnail(selectedImage.url);
    }
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    onDeleteImages(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <div className="w-full relative">
      <label className="label-wrapper">
        <span className="label-text">Media</span>
      </label>
      <div className="w-full border border-gray-200 rounded-lg p-4 min-h-24 relative">
        {uploadMutation.isPending && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20 rounded-lg">
            <div className="flex flex-col items-center">
              <LoadingIcon size="lg" />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">Upload Images</p>
            <p className="text-xs text-gray-500">
              Drag and drop images here or click to upload
            </p>
          </div>

          {validationError && (
            <p className="text-red-500 text-sm">{validationError}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/svg+xml"
            onChange={handleInputChange}
            multiple
            className="hidden"
          />

          {images.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {images.map((image) => {
                const imageId = image.id || image.url;
                return (
                  <div
                    key={imageId}
                    className={cn(
                      'relative group cursor-pointer rounded-lg overflow-hidden border-2 w-32',
                      image.url === thumbnail && selectedIds.has(imageId)
                        ? 'border-blue-500 ring-2 ring-green-400'
                        : image.url === thumbnail
                        ? 'border-green-500 hover:border-green-600'
                        : selectedIds.has(imageId)
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() => toggleImageSelection(imageId)}
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="w-full aspect-square object-cover"
                    />

                    {image.url === thumbnail && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white p-1.5 rounded-full shadow-lg">
                        <BookmarkIcon className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={cn(
                        'absolute top-2 right-2 w-6 h-6 rounded border-2 bg-white',
                        selectedIds.has(imageId)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      )}
                    >
                      {selectedIds.has(imageId) && (
                        <CheckIcon className="w-full h-full text-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedIds.size > 0 &&
        createPortal(
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-gray-900 text-white rounded-full px-6 py-3 flex items-center space-x-4 shadow-lg">
              <span className="text-sm">{selectedIds.size} selected</span>
              <div className="h-6 w-px bg-gray-600" />
              <button
                onClick={handleMakeThumbnail}
                disabled={selectedIds.size !== 1}
                className="px-4 py-1 hover:bg-gray-800 rounded transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Make thumbnail
              </button>
              <div className="h-6 w-px bg-gray-600" />
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-1 hover:bg-gray-800 rounded transition-colors text-sm flex items-center"
              >
                Delete
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
