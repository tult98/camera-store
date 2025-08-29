import React, { useState } from "react";

interface URLInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

export const URLInputModal = React.memo(
  ({ isOpen, onClose, onSubmit }: URLInputModalProps) => {
    const [url, setUrl] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
      if (url.trim()) {
        onSubmit(url.trim());
        setUrl("");
        onClose();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
          <h3 className="text-lg font-semibold mb-4">Insert Image from URL</h3>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!url.trim()}
              className={`px-4 py-2 rounded transition-colors ${
                url.trim()
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Insert
            </button>
          </div>
        </div>
      </div>
    );
  }
);