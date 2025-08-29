import React from "react";
import { sanitizeHtml } from "../utils/sanitize";

interface DescriptionDisplayProps {
  description: string;
}

export const DescriptionDisplay: React.FC<DescriptionDisplayProps> = ({
  description,
}) => {
  if (!description) {
    return (
      <p className="text-gray-500 italic p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[100px] flex items-center justify-center">
        No description provided. Click "Edit Description" to add one.
      </p>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
      className="rich-text-display p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[100px] overflow-auto"
    />
  );
};