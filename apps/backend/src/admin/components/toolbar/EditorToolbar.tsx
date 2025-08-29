import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link2,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Undo,
  Redo,
} from "lucide-react";
import { MenuButton } from "./MenuButton";
import { Divider } from "./Divider";
import { ImageDropdown } from "../image/ImageDropdown";

interface EditorToolbarProps {
  editor: Editor;
  disabled?: boolean;
  onImageUpload: () => void;
  onImageUrl: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  disabled = false,
  onImageUpload,
  onImageUrl,
}) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link")["href"];
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div
      className="border-b border-gray-200 p-2 bg-gray-50"
      role="toolbar"
      aria-label="Text formatting toolbar"
    >
      <div className="flex flex-wrap items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
          aria-label="Undo last action"
        >
          <Undo className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
          aria-label="Redo last undone action"
        >
          <Redo className="w-4 h-4" />
        </MenuButton>

        <Divider />

        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <Type className="w-4 h-4" />
        </MenuButton>

        <Divider />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
          aria-label="Toggle bold formatting"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
          aria-label="Toggle italic formatting"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </MenuButton>

        <Divider />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
          active={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </MenuButton>

        <Divider />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </MenuButton>

        <Divider />

        <MenuButton
          onClick={setLink}
          active={editor.isActive("link")}
          title="Insert/Edit Link (Ctrl+K)"
          aria-label="Insert or edit hyperlink"
        >
          <Link2 className="w-4 h-4" />
        </MenuButton>

        <ImageDropdown
          onUploadClick={onImageUpload}
          onUrlClick={onImageUrl}
          disabled={disabled}
        />
      </div>
    </div>
  );
};