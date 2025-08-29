import React from "react";

interface StatusMessagesProps {
  error: string | null;
  isEditing: boolean;
  hasChanges: boolean;
  isValidDescription: boolean;
  descriptionLength: number;
}

export const StatusMessages: React.FC<StatusMessagesProps> = ({
  error,
  isEditing,
  hasChanges,
  isValidDescription,
  descriptionLength,
}) => {
  return (
    <>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isEditing && hasChanges && !error && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
          You have unsaved changes. Click "Save" to apply them.
        </div>
      )}

      {isEditing && !isValidDescription && descriptionLength > 0 && (
        <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-md p-3">
          Description cannot be empty or contain only whitespace.
        </div>
      )}
    </>
  );
};