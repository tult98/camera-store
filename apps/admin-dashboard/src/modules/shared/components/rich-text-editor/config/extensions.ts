import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Blockquote from '@tiptap/extension-blockquote';
import { ImageUploadNode } from '../extensions/image-upload-node';

export const editorExtensions = (placeholder: string) => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    blockquote: false, // We'll use the standalone extension
    horizontalRule: {
      HTMLAttributes: {
        class: 'my-4 border-t border-gray-300',
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class:
          'bg-gray-100 border border-gray-200 rounded p-4 font-mono text-sm',
      },
    },
    code: {
      HTMLAttributes: {
        class: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
      },
    },
  }),

  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-600 underline hover:text-blue-700',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  }),

  Image.configure({
    HTMLAttributes: {
      class: 'editor-image',
    },
    allowBase64: false,
    inline: false,
  }).extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        src: {
          default: null,
        },
        alt: {
          default: null,
        },
        title: {
          default: null,
        },
        align: {
          default: 'center',
          parseHTML: (element) =>
            element.getAttribute('data-align') || 'center',
          renderHTML: (attributes) => {
            return {
              'data-align': attributes.align,
              class: `editor-image align-${attributes.align}`,
            };
          },
        },
      };
    },
  }),

  TextAlign.configure({
    types: ['heading', 'paragraph', 'image'],
    alignments: ['left', 'center', 'right', 'justify'],
  }),

  Underline.configure({
    HTMLAttributes: {
      class: 'underline',
    },
  }),

  Blockquote.configure({
    HTMLAttributes: {
      class: 'border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4',
    },
  }),

  Placeholder.configure({
    placeholder,
    emptyEditorClass: 'is-editor-empty',
  }),

  ImageUploadNode,
];
