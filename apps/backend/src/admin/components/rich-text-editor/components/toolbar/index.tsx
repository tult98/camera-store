import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  LinkIcon,
  PhotoIcon,
  MinusIcon,
  Bars3Icon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { ToolbarButton } from './toolbar-button';
import { ToolbarDivider } from './toolbar-divider';
import { HeadingDropdown } from './heading-dropdown';
import { LinkModal } from '../modals/link-modal';

interface ToolbarProps {
  editor: Editor;
  disabled?: boolean;
  onError?: (error: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  disabled = false,
}) => {
  const [showLinkModal, setShowLinkModal] = useState(false);

  const handleLinkClick = () => {
    if (disabled) return;
    setShowLinkModal(true);
  };

  const handleImageClick = () => {
    if (disabled) return;
    editor.chain().focus().insertImageUpload().run();
  };

  const handleLinkSubmit = (url: string, text?: string) => {
    if (!url) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (selectedText) {
      // Update existing selection with link
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    } else {
      // Insert new link with text
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${
            text || url
          }</a>`
        )
        .run();
    }
    setShowLinkModal(false);
  };

  return (
    <>
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* History Group */}
          <ToolbarButton
            icon={ArrowUturnLeftIcon}
            title="Undo (Ctrl+Z)"
            isActive={false}
            disabled={disabled || !editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarButton
            icon={ArrowUturnRightIcon}
            title="Redo (Ctrl+Y)"
            isActive={false}
            disabled={disabled || !editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          />

          <ToolbarDivider />

          {/* Heading Group */}
          <HeadingDropdown editor={editor} disabled={disabled} />

          <ToolbarDivider />

          {/* Lists Group */}
          <ToolbarButton
            icon={ListBulletIcon}
            title="Bullet List"
            isActive={editor.isActive('bulletList')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon={Bars3Icon}
            title="Ordered List"
            isActive={editor.isActive('orderedList')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />

          <ToolbarDivider />

          {/* Formatting Group */}
          <ToolbarButton
            icon={BoldIcon}
            title="Bold (Ctrl+B)"
            isActive={editor.isActive('bold')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon={ItalicIcon}
            title="Italic (Ctrl+I)"
            isActive={editor.isActive('italic')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            icon={StrikethroughIcon}
            title="Strike Through"
            isActive={editor.isActive('strike')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
          <ToolbarButton
            icon={CodeBracketIcon}
            title="Inline Code"
            isActive={editor.isActive('code')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <ToolbarButton
            icon={UnderlineIcon}
            title="Underline (Ctrl+U)"
            isActive={editor.isActive('underline')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />

          <ToolbarDivider />

          {/* Special Group */}
          <ToolbarButton
            icon={ChatBubbleLeftRightIcon}
            title="Blockquote"
            isActive={editor.isActive('blockquote')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            icon={LinkIcon}
            title="Add Link"
            isActive={editor.isActive('link')}
            disabled={disabled}
            onClick={handleLinkClick}
          />

          <ToolbarDivider />

          {/* Alignment Group */}
          <ToolbarButton
            icon={() => (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="17" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="17" y1="18" x2="3" y2="18"></line>
              </svg>
            )}
            title="Align Left"
            isActive={
              editor.isActive({ textAlign: 'left' }) ||
              editor.isActive('image', { align: 'left' })
            }
            disabled={disabled}
            onClick={() => {
              if (editor.isActive('image')) {
                editor
                  .chain()
                  .focus()
                  .updateAttributes('image', { align: 'left' })
                  .run();
              } else {
                editor.chain().focus().setTextAlign('left').run();
              }
            }}
          />
          <ToolbarButton
            icon={() => (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="10" x2="6" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="18" y1="18" x2="6" y2="18"></line>
              </svg>
            )}
            title="Align Center"
            isActive={
              editor.isActive({ textAlign: 'center' }) ||
              editor.isActive('image', { align: 'center' })
            }
            disabled={disabled}
            onClick={() => {
              if (editor.isActive('image')) {
                editor
                  .chain()
                  .focus()
                  .updateAttributes('image', { align: 'center' })
                  .run();
              } else {
                editor.chain().focus().setTextAlign('center').run();
              }
            }}
          />
          <ToolbarButton
            icon={() => (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="21" y1="10" x2="7" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="21" y1="18" x2="7" y2="18"></line>
              </svg>
            )}
            title="Align Right"
            isActive={
              editor.isActive({ textAlign: 'right' }) ||
              editor.isActive('image', { align: 'right' })
            }
            disabled={disabled}
            onClick={() => {
              if (editor.isActive('image')) {
                editor
                  .chain()
                  .focus()
                  .updateAttributes('image', { align: 'right' })
                  .run();
              } else {
                editor.chain().focus().setTextAlign('right').run();
              }
            }}
          />
          <ToolbarButton
            icon={() => (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="21" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="21" y1="18" x2="3" y2="18"></line>
              </svg>
            )}
            title="Justify"
            isActive={
              editor.isActive({ textAlign: 'justify' }) ||
              editor.isActive('image', { align: 'justify' })
            }
            disabled={disabled}
            onClick={() => {
              if (editor.isActive('image')) {
                editor
                  .chain()
                  .focus()
                  .updateAttributes('image', { align: 'justify' })
                  .run();
              } else {
                editor.chain().focus().setTextAlign('justify').run();
              }
            }}
          />

          <ToolbarDivider />

          {/* Insert Group */}
          <ToolbarButton
            icon={PhotoIcon}
            title="Insert Image"
            isActive={false}
            disabled={disabled}
            onClick={handleImageClick}
          />
          <ToolbarButton
            icon={MinusIcon}
            title="Horizontal Rule"
            isActive={false}
            disabled={disabled}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </div>
      </div>

      {/* Modals */}
      <LinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSubmit={handleLinkSubmit}
        currentUrl={editor.getAttributes('link').href || ''}
      />
    </>
  );
};