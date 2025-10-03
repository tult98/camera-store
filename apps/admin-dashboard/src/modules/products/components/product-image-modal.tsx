import { useToast } from '@/modules/shared/hooks/use-toast';
import {
  BookmarkIcon,
  CheckIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { LoadingIcon } from '@modules/shared/components/ui/loading-icon';
import { cn } from '@modules/shared/utils/cn';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { uploadImages } from '../apiCalls/uploads';

interface ImageItem {
  id: string;
  url?: string;
  preview: string;
  isThumbnail: boolean;
}

export interface ProductImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ id: string; url: string; isThumbnail?: boolean }>;
  onSave: (
    images: Array<{ id: string; url: string; isThumbnail?: boolean }>
  ) => void;
}

export const ProductImageModal: React.FC<ProductImageModalProps> = ({
  isOpen,
  onClose,
  images: initialImages,
  onSave,
}) => {
  const toast = useToast();

  const [imageItems, setImageItems] = useState<ImageItem[]>(() =>
    initialImages.map((img) => ({
      id: img.id,
      url: img.url,
      preview: img.url,
      isThumbnail: img.isThumbnail || false,
    }))
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadImages,
    onSuccess: (uploadedFiles) => {
      // Update image items with uploaded URLs
      setImageItems((prev) => {
        const tempItems = prev.filter((item) => !item.url);
        return prev.map((item) => {
          if (!item.url) {
            const index = tempItems.findIndex(
              (tempItem) => tempItem.id === item.id
            );
            if (index !== -1 && uploadedFiles[index]) {
              if (item.preview.startsWith('blob:')) {
                URL.revokeObjectURL(item.preview);
              }
              return {
                ...item,
                id: `img-${Date.now()}-${Math.random()}`,
                url: uploadedFiles[index].url,
                preview: uploadedFiles[index].url,
              };
            }
          }
          return item;
        });
      });
    },
    onError: (error) => {
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

      // Clear any previous validation error
      setValidationError('');

      const newImages: ImageItem[] = validFiles.map((file) => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        preview: URL.createObjectURL(file),
        isThumbnail: false,
      }));

      setImageItems((prev) => [...prev, ...newImages]);

      // Start upload with mutation
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
    setImageItems((prev) =>
      prev.map((item) => ({
        ...item,
        isThumbnail: item.id === selectedId,
      }))
    );
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    setImageItems((prev) => {
      const remaining = prev.filter((item) => !selectedIds.has(item.id));
      const deletedItems = prev.filter((item) => selectedIds.has(item.id));

      deletedItems.forEach((item) => {
        if (item.preview.startsWith('blob:')) {
          URL.revokeObjectURL(item.preview);
        }
      });

      return remaining;
    });
    setSelectedIds(new Set());
  };

  const handleSave = () => {
    const finalImages = imageItems
      .filter((item) => item.url)
      .map((item) => ({
        id: item.id,
        url: item.url!,
        isThumbnail: item.isThumbnail,
      }));
    onSave(finalImages);
    onClose();
  };

  const handleCancel = () => {
    if (uploadMutation.isPending) {
      toast.warning(
        'Images are still uploading. You cannot cancel the upload.'
      );
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 overflow-y-auto shadow-2xl"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-200 opacity-50"
        onClick={handleCancel}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all w-full max-w-7xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900" id="modal-title">
              Media
            </h2>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleCancel}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            <div className="flex">
              <div className="flex-1 p-6 min-h-[400px] relative">
                {/* Upload spinner overlay */}
                {uploadMutation.isPending && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20 rounded-lg">
                    <div className="flex flex-col items-center">
                      <LoadingIcon size="lg" />
                    </div>
                  </div>
                )}

                {imageItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-gray-400">
                    <PhotoIcon className="h-16 w-16 mb-4" />
                    <p className="text-lg">No images uploaded yet</p>
                    <p className="text-sm mt-2">Upload images to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
                    {imageItems.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          'relative group cursor-pointer rounded-lg overflow-hidden border-2',
                          item.isThumbnail && selectedIds.has(item.id)
                            ? 'border-blue-500 ring-2 ring-green-400'
                            : item.isThumbnail
                            ? 'border-green-500 hover:border-green-600'
                            : selectedIds.has(item.id)
                            ? 'border-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        onClick={() => toggleImageSelection(item.id)}
                      >
                        <img
                          src={item.preview}
                          alt=""
                          className="w-full h-48 object-cover"
                        />

                        {item.isThumbnail && (
                          <div className="absolute top-2 left-2 bg-green-600 text-white p-1.5 rounded-full shadow-lg">
                            <BookmarkIcon className="w-4 h-4" />
                          </div>
                        )}

                        <div
                          className={cn(
                            'absolute top-2 right-2 w-6 h-6 rounded border-2 bg-white',
                            selectedIds.has(item.id)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          )}
                        >
                          {selectedIds.has(item.id) && (
                            <CheckIcon className="w-full h-full text-white" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-80 border-l border-gray-200 p-6">
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
                  <p className="text-gray-600 font-medium mb-2">
                    Upload Images
                  </p>
                  <p className="text-xs text-gray-500">
                    Drag and drop images here or click to upload
                  </p>
                </div>

                {validationError && (
                  <p className="text-red-500 text-sm mt-2">{validationError}</p>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/svg+xml"
                  onChange={handleInputChange}
                  multiple
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {selectedIds.size > 0 && (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
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
            </div>
          )}

          <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3 bg-gray-50">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled={uploadMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploadMutation.isPending}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
