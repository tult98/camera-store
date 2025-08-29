import { useCallback, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import { validateImageFile, validateImageUrl, getBackendUrl, SUPPORTED_IMAGE_TYPES } from "../utils/editor-utils";

interface UseImageUploadProps {
  editor: Editor | null;
  onError: (error: string) => void;
}

export const useImageUpload = ({ editor, onError }: UseImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validation = validateImageFile(file);
      if (!validation.isValid) {
        onError(validation.error!);
        return;
      }

      setIsUploading(true);
      setUploadProgress(20);

      const formData = new FormData();
      formData.append("image", file);

      try {
        setUploadProgress(50);
        const response = await fetch("/admin/uploads/image", {
          method: "POST",
          body: formData,
        });

        setUploadProgress(80);

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        setUploadProgress(100);

        const altText = file.name.replace(/\.[^/.]+$/, "");
        const backendUrl = getBackendUrl();
        const imageUrl = data.url.startsWith("http")
          ? data.url
          : `${backendUrl}${data.url}`;

        if (editor) {
          editor
            .chain()
            .focus()
            .setImage({
              src: imageUrl,
              alt: altText,
            })
            .run();
        }
      } catch (uploadError) {
        const errorMessage =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload image. Please try again.";
        onError(errorMessage);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor, onError]
  );

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const addImageFromURL = useCallback(() => {
    setShowUrlModal(true);
  }, []);

  const handleUrlSubmit = useCallback(
    (url: string) => {
      if (!editor) return;

      const validation = validateImageUrl(url);
      if (!validation.isValid) {
        onError(validation.error!);
        return;
      }

      editor.chain().focus().setImage({ src: url }).run();
      setShowUrlModal(false);
    },
    [editor, onError]
  );

  return {
    isUploading,
    uploadProgress,
    showUrlModal,
    setShowUrlModal,
    fileInputRef,
    handleFileUpload,
    addImage,
    addImageFromURL,
    handleUrlSubmit,
    supportedImageTypes: SUPPORTED_IMAGE_TYPES,
  };
};