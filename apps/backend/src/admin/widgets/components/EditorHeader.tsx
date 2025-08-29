import React from "react";
import { Button } from "@medusajs/ui";

interface EditorHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  canSave: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  isEditing,
  isSaving,
  canSave,
  onEdit,
  onSave,
  onCancel,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <h2 className="font-sans font-medium h2-core">
          Rich Text Description
        </h2>
        <p className="txt-small txt-subtle">
          Edit your product description with rich formatting
        </p>
      </div>
      {!isEditing ? (
        <Button onClick={onEdit} size="small" variant="primary">
          Edit Description
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={onCancel}
            size="small"
            variant="secondary"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!canSave}
            size="small"
            variant="primary"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};