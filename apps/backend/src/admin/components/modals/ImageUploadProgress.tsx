import React from "react";

interface ImageUploadProgressProps {
  isUploading: boolean;
  progress?: number;
}

export const ImageUploadProgress = React.memo(
  ({ isUploading, progress = 0 }: ImageUploadProgressProps) => {
    if (!isUploading) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 min-w-[300px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              Uploading image...
            </p>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);