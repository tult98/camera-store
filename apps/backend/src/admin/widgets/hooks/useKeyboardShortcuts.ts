import { useEffect } from "react";

interface UseKeyboardShortcutsParams {
  isEditing: boolean;
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const useKeyboardShortcuts = ({
  isEditing,
  canSave,
  onSave,
  onCancel,
}: UseKeyboardShortcutsParams) => {
  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        if (canSave) {
          onSave();
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, canSave, onSave, onCancel]);
};