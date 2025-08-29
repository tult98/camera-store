import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  description?: string;
  title?: string;
}

interface UpdateProductRequest {
  description: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

export const useProductDescription = (product: Product | undefined) => {
  const [description, setDescription] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedDescription, setSavedDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product?.description) {
      const cleanDescription = product.description.trim();
      setDescription(cleanDescription);
      setSavedDescription(cleanDescription);
    }
  }, [product?.description]);

  const handleSave = useCallback(async () => {
    if (!product?.id) {
      setError("Product ID is missing");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload: UpdateProductRequest = {
        description: description.trim(),
      };

      const response = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update product: ${response.status} ${errorText}`
        );
      }

      const result: ApiResponse = await response.json();

      if (result.success !== false) {
        setSavedDescription(description);
        setIsEditing(false);
        setError(null);
      } else {
        throw new Error(result.message || "Failed to save description");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [product?.id, description]);

  const handleCancel = useCallback(() => {
    setDescription(savedDescription);
    setIsEditing(false);
    setError(null);
  }, [savedDescription]);

  const hasChanges = description.trim() !== savedDescription.trim();
  const isValidDescription = description.trim().length > 0;
  const canSave = hasChanges && isValidDescription && !isSaving;

  return {
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
  };
};