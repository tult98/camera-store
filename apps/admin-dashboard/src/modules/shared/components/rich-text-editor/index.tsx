import { cn } from '@modules/shared/utils/cn';
import { EditorContent, useEditor } from '@tiptap/react';
import React, { useCallback } from 'react';
import { Toolbar } from './components/toolbar';
import { editorExtensions } from './config/extensions';
import './styles/editor.css';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
  onError?: (error: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
  disabled = false,
  minHeight = 300,
  maxHeight = 600,
  className = '',
  onError,
}) => {
  const editor = useEditor({
    extensions: editorExtensions(placeholder),
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    onCreate: ({ editor }) => {
      // Set initial content if provided
      if (content && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    },
  });

  const handleError = useCallback(
    (errorMessage: string) => {
      console.error('Rich Text Editor Error:', errorMessage);
      onError?.(errorMessage);
    },
    [onError]
  );

  if (!editor) {
    return (
      <div
        className={cn(
          'border border-gray-300 rounded-lg overflow-hidden',
          className
        )}
      >
        <div className="bg-gray-50 border-b border-gray-200 p-2">
          <div className="flex items-center gap-1 opacity-50">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-4">
          <div
            className="bg-gray-100 rounded animate-pulse flex items-center justify-center text-gray-400"
            style={{ minHeight }}
          >
            Loading editor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border border-gray-300 rounded-lg overflow-hidden bg-white',
        disabled && 'opacity-60',
        className
      )}
      style={
        {
          '--editor-min-height': `${minHeight}px`,
          '--editor-max-height': `${maxHeight}px`,
        } as React.CSSProperties
      }
    >
      <Toolbar editor={editor} disabled={disabled} onError={handleError} />

      <div className="relative">
        <EditorContent
          editor={editor}
          className={cn(
            'prose prose-sm max-w-none',
            'focus-within:outline-none',
            disabled && 'pointer-events-none'
          )}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
