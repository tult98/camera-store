import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Label } from "@medusajs/ui";
import { useRef } from "react";
import { RichTextEditor } from "../components/rich-text-editor";
import { EditorHeader } from "./components/EditorHeader";
import { DescriptionDisplay } from "./components/DescriptionDisplay";
import { StatusMessages } from "./components/StatusMessages";
import { useProductDescription } from "./hooks/useProductDescription";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { richTextDisplayStyles } from "./styles/rich-text-display";

interface Product {
  id: string;
  description?: string;
  title?: string;
}

interface RichDescriptionWidgetProps {
  data: Product;
}

const RichDescriptionWidget = ({ data }: RichDescriptionWidgetProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const product = data;

  const {
    description,
    setDescription,
    isEditing,
    setIsEditing,
    isSaving,
    savedDescription,
    error,
    handleSave,
    handleCancel,
    hasChanges,
    canSave,
  } = useProductDescription(product);

  useKeyboardShortcuts({
    isEditing,
    canSave,
    onSave: handleSave,
    onCancel: handleCancel,
  });

  if (!product) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-center px-6 py-8">
          <p className="text-gray-500">Loading product data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="divide-y p-0">
      <style>{richTextDisplayStyles}</style>
      
      <EditorHeader
        isEditing={isEditing}
        isSaving={isSaving}
        canSave={canSave}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <div className="px-6 py-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="rich-description" className="block">
                Description
              </Label>
              {isEditing && (
                <div className="text-xs text-gray-500">
                  <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">
                    Ctrl+S
                  </kbd>{" "}
                  to save •{" "}
                  <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">
                    Esc
                  </kbd>{" "}
                  to cancel
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div ref={editorRef}>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter your product description with rich formatting..."
                  disabled={isSaving}
                />
              </div>
            ) : (
              <DescriptionDisplay description={savedDescription} />
            )}
          </div>

          <StatusMessages
            error={error}
            isEditing={isEditing}
            hasChanges={hasChanges}
            isValidDescription={description.trim().length > 0}
            descriptionLength={description.length}
          />
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default RichDescriptionWidget;