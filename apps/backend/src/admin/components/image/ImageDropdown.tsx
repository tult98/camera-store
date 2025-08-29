import React, { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  ChevronDown,
  FileImage,
  Globe,
} from "lucide-react";

interface ImageDropdownProps {
  onUploadClick: () => void;
  onUrlClick: () => void;
  disabled?: boolean;
}

export const ImageDropdown = React.memo(
  ({ onUploadClick, onUrlClick, disabled = false }: ImageDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          title="Insert Image"
          className={`
          flex items-center gap-1 p-2 rounded transition-all duration-200
          ${
            isOpen
              ? "bg-violet-100 text-violet-700"
              : "hover:bg-gray-100 text-gray-700"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        >
          <ImageIcon className="w-4 h-4" />
          <ChevronDown className="w-3 h-3" />
        </button>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
            <button
              type="button"
              onClick={() => {
                onUploadClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileImage className="w-4 h-4" />
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => {
                onUrlClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Image URL
            </button>
          </div>
        )}
      </div>
    );
  }
);