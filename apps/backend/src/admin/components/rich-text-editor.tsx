import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { EditorToolbar } from "./toolbar/EditorToolbar";
import { URLInputModal } from "./modals/URLInputModal";
import { LinkInputModal } from "./modals/LinkInputModal";
import { ImageUploadProgress } from "./modals/ImageUploadProgress";
import { useImageUpload } from "./image/useImageUpload";
import { editorStyles } from "./styles/editor-styles";
import { DEFAULT_PLACEHOLDER } from "./utils/editor-utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onError?: (error: string) => void;
  maxHeight?: number;
  minHeight?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  disabled = false,
  className = "",
  onError,
  maxHeight = 500,
  minHeight = 200,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      onError?.(errorMessage);
    },
    [onError]
  );

  const editorExtensions = useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-violet-600 underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true,
        HTMLAttributes: {
          class: "rounded-lg overflow-hidden",
        },
        addPasteHandler: false,
        allowFullscreen: true,
        autoplay: false,
      }),
    ],
    [placeholder]
  );

  const editor = useEditor({
    extensions: editorExtensions,
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  const imageUpload = useImageUpload({
    editor,
    onError: handleError,
  });

  const handleLinkSubmit = useCallback(
    (data: { type: 'link' | 'video'; url: string; text?: string }) => {
      if (!editor) return;

      if (data.type === 'video') {
        // Extract video ID from various YouTube URL formats
        let videoId = '';
        const url = data.url;
        
        if (url.includes('youtube.com/watch?v=')) {
          videoId = url.split('v=')[1]?.split('&')[0] || '';
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
        } else if (url.includes('vimeo.com/')) {
          // For Vimeo, insert iframe directly
          const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0] || '';
          if (vimeoId) {
            const iframeHtml = `<iframe src="https://player.vimeo.com/video/${vimeoId}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
            editor
              .chain()
              .focus()
              .insertContent(iframeHtml)
              .run();
          }
          return;
        }
        
        if (videoId) {
          editor
            .chain()
            .focus()
            .setYoutubeVideo({
              src: `https://www.youtube.com/watch?v=${videoId}`,
            })
            .run();
        }
      } else {
        // Handle regular link
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');
        
        if (selectedText) {
          // If text is selected, make it a link
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: data.url })
            .run();
        } else {
          // Insert new link with text
          editor
            .chain()
            .focus()
            .insertContent(`<a href="${data.url}" target="_blank" rel="noopener noreferrer">${data.text || data.url}</a>`)
            .run();
        }
      }
    },
    [editor]
  );

  const openLinkModal = useCallback(() => {
    if (!editor) return;
    setShowLinkModal(true);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();
    if (currentContent !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div className={`rich-text-editor ${className}`}>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="border-b border-gray-200 p-2 bg-gray-50">
            <div className="flex flex-wrap items-center gap-1 opacity-50">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="p-4">
            <div
              className="bg-gray-100 rounded animate-pulse"
              style={{ height: minHeight }}
            >
              <div className="p-4 text-gray-400">Loading editor...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const editorStyle = {
    "--editor-min-height": `${minHeight}px`,
    "--editor-max-height": `${maxHeight}px`,
  } as React.CSSProperties;

  return (
    <div className={`rich-text-editor ${className}`} style={editorStyle}>
      <input
        ref={imageUpload.fileInputRef}
        type="file"
        accept={imageUpload.supportedImageTypes.join(",")}
        onChange={imageUpload.handleFileUpload}
        className="hidden"
        aria-label="Upload image file"
      />
      <URLInputModal
        isOpen={imageUpload.showUrlModal}
        onClose={() => imageUpload.setShowUrlModal(false)}
        onSubmit={imageUpload.handleUrlSubmit}
      />
      <LinkInputModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSubmit={handleLinkSubmit}
      />
      <ImageUploadProgress
        isUploading={imageUpload.isUploading}
        progress={imageUpload.uploadProgress}
      />
      <style>{editorStyles}</style>

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
          role="alert"
        >
          <p className="text-sm text-red-600">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      <div
        className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        role="textbox"
        aria-multiline="true"
        aria-label="Rich text editor"
      >
        <EditorToolbar
          editor={editor}
          disabled={disabled}
          onImageUpload={imageUpload.addImage}
          onImageUrl={imageUpload.addImageFromURL}
          onLinkClick={openLinkModal}
        />
        <EditorContent
          editor={editor}
          className={disabled ? "opacity-60" : ""}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;