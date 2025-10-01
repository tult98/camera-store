import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { InlineImageUpload } from '../components/inline-image-upload';

export interface ImageUploadOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      /**
       * Insert an image upload zone at the current position
       */
      insertImageUpload: () => ReturnType;
    };
  }
}

export const ImageUploadNode = Node.create<ImageUploadOptions>({
  name: 'imageUpload',

  group: 'block',

  content: '',

  draggable: false,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-upload"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'image-upload',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineImageUpload);
  },

  addCommands() {
    return {
      insertImageUpload:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-i': () => this.editor.commands.insertImageUpload(),
    };
  },
});