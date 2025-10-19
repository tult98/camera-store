import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { uploadFile } from '@modules/shared/apiCalls/upload';
import { cn } from '@modules/shared/utils/cn';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { Control, FieldValues, Path, useController, useFormState } from 'react-hook-form';
import { LoadingIcon } from '../loading-icon';

interface FormImageUploadProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
  label?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  accept?: string;
  maxSizeInMB?: number; // For display purposes only - validation handled by Zod
  maxDimensions?: string;
  placeholder?: string;
}

const FormImageUploadInner = <TFormData extends FieldValues = FieldValues>(
  {
    name,
    control,
    label,
    disabled = false,
    className = '',
    required = false,
    accept = 'image/svg+xml,image/png,image/jpeg,image/gif',
    maxSizeInMB = 10,
    maxDimensions = 'MAX. 800×400px',
    placeholder = 'Click to upload or drag and drop',
  }: FormImageUploadProps<TFormData>,
  ref: React.Ref<HTMLInputElement>
) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
  });

  const { isSubmitted } = useFormState({ control });

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const hasError = !!error;
  const showErrorState = hasError && (isTouched || isSubmitted);

  // Load initial preview for existing images (edit mode)
  useEffect(() => {
    // If we have a field value (existing image) but no selected file, show the existing image
    if (field.value && !selectedFile) {
      setPreview(field.value);
    } else if (!field.value && !selectedFile) {
      // Clear preview if no field value and no selected file
      setPreview('');
    }
  }, [field.value, selectedFile]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setValidationError('');
    field.onChange('');

    // Clean up preview URL only if it was created from a file (blob URL)
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    
    // Clear preview after cleanup
    setPreview('');
  }, [field, preview]);

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (uploadedFile) => {
      field.onChange(uploadedFile.url);
    },
    onError: () => {
      setValidationError('Failed to upload file. Please try again.');
      handleRemoveFile();
    },
  });

  const handleFileSelect = useCallback(
    (file: File) => {
      // Clear previous validation error
      setValidationError('');

      // Validate file type
      const allowedTypes = accept.split(',').map((type) => type.trim());
      if (!allowedTypes.includes(file.type)) {
        setValidationError(
          'Please select a valid image file (SVG, PNG, JPG, or GIF)'
        );
        return;
      }

      // Validate file size
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        setValidationError(`File size must be less than ${maxSizeInMB}MB`);
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Trigger the upload
      uploadMutation.mutate(file);
    },
    [accept, maxSizeInMB, uploadMutation]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [disabled, handleFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setDragActive(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (
      !disabled &&
      !uploadMutation.isPending &&
      ref &&
      'current' in ref &&
      ref.current
    ) {
      ref.current.click();
    }
  }, [disabled, uploadMutation.isPending, ref]);

  const dropZoneClasses = cn(
    'border-2 border-dashed border-gray-300 rounded-lg p-8',
    'hover:border-gray-400 transition-colors duration-200',
    'cursor-pointer bg-gray-50 text-center',
    dragActive && 'border-blue-500 bg-blue-50',
    disabled && 'opacity-50 cursor-not-allowed',
    showErrorState && 'border-red-500 bg-red-50'
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="label-wrapper">
          <span className="label-text">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      {!selectedFile && !preview ? (
        <div
          className={dropZoneClasses}
          onDrop={!uploadMutation.isPending ? handleDrop : undefined}
          onDragOver={!uploadMutation.isPending ? handleDragOver : undefined}
          onDragLeave={!uploadMutation.isPending ? handleDragLeave : undefined}
          onClick={!uploadMutation.isPending ? handleClick : undefined}
        >
          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">{placeholder}</p>
          <p className="text-sm text-gray-500">
            SVG, PNG, JPG or GIF ({maxDimensions})
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 bg-white relative">
          {uploadMutation.isPending && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
              <LoadingIcon className="w-6 h-6" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-12 h-12 object-contain rounded border border-gray-200"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile ? selectedFile.name : 'Current image'}
                </p>
                {selectedFile ? (
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Existing image
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={disabled || uploadMutation.isPending}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <input
        ref={ref}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
        aria-describedby={showErrorState ? `${name}-error` : undefined}
      />

      {showErrorState && (
        <div className="mt-1">
          <span
            id={`${name}-error`}
            className="input-error-message"
            role="alert"
          >
            {error?.message}
          </span>
        </div>
      )}

      {validationError && (
        <div className="mt-1">
          <span className="input-error-message" role="alert">
            {validationError}
          </span>
        </div>
      )}
    </div>
  );
};

const _FormImageUpload = React.forwardRef(FormImageUploadInner);
_FormImageUpload.displayName = 'FormImageUpload';

export const FormImageUpload = _FormImageUpload as <
  TFormData extends FieldValues = FieldValues
>(
  props: FormImageUploadProps<TFormData> & { ref?: React.Ref<HTMLInputElement> }
) => React.ReactElement;
