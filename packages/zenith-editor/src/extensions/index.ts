import { Extension } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import History from '@tiptap/extension-history';
import HardBreak from '@tiptap/extension-hard-break';
import Gapcursor from '@tiptap/extension-gapcursor';
import Dropcursor from '@tiptap/extension-dropcursor';
import { createLowlight } from 'lowlight';
import { ImageResizeExtension } from './image-resize';

// Create lowlight instance
export const lowlight = createLowlight();

// Register common languages for syntax highlighting
// Use dynamic imports to avoid bundling issues
const registerLanguages = async () => {
  try {
    const { default: javascript } = await import('highlight.js/lib/languages/javascript');
    const { default: typescript } = await import('highlight.js/lib/languages/typescript');
    const { default: css } = await import('highlight.js/lib/languages/css');
    const { default: html } = await import('highlight.js/lib/languages/xml');
    const { default: python } = await import('highlight.js/lib/languages/python');
    const { default: json } = await import('highlight.js/lib/languages/json');

    lowlight.register('javascript', javascript);
    lowlight.register('typescript', typescript);
    lowlight.register('css', css);
    lowlight.register('html', html);
    lowlight.register('python', python);
    lowlight.register('json', json);
  } catch (error) {
    console.warn('Some highlight.js languages could not be loaded:', error);
  }
};

// Register languages immediately
registerLanguages();

/**
 * Default extensions configuration for Zenith Editor
 * These extensions provide all the core functionality for a rich text editor
 */
export const defaultExtensions = [
  // Core document structure
  Document,
  Paragraph.configure({
    HTMLAttributes: {
      class: 'zenith-paragraph',
    },
  }),
  Text,
  
  // Text formatting
  Bold.configure({
    HTMLAttributes: {
      class: 'zenith-bold',
    },
  }),
  Italic.configure({
    HTMLAttributes: {
      class: 'zenith-italic',
    },
  }),
  Underline.configure({
    HTMLAttributes: {
      class: 'zenith-underline',
    },
  }),
  Strike.configure({
    HTMLAttributes: {
      class: 'zenith-strike',
    },
  }),
  
  // Headings
  Heading.configure({
    levels: [1, 2, 3],
    HTMLAttributes: {
      class: 'zenith-heading',
    },
  }),
  
  // Lists
  BulletList.configure({
    HTMLAttributes: {
      class: 'zenith-bullet-list',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'zenith-ordered-list',
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: 'zenith-list-item',
    },
  }),
  
  // Links
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'zenith-link',
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  
  // Images with resizing capabilities
  ImageResizeExtension.configure({
    HTMLAttributes: {
      class: 'zenith-image',
    },
    allowBase64: true,
    inline: false,
  }),
  
  // Blockquotes
  Blockquote.configure({
    HTMLAttributes: {
      class: 'zenith-blockquote',
    },
  }),
  
  // Code blocks with syntax highlighting
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: 'javascript',
    HTMLAttributes: {
      class: 'zenith-code-block',
    },
  }),
  
  // History for undo/redo
  History.configure({
    depth: 100,
  }),
  
  // Enhanced editing experience
  HardBreak,
  Gapcursor,
  Dropcursor,
];

/**
 * Custom extension to add placeholder functionality
 */
export const PlaceholderExtension = Extension.create({
  name: 'placeholder',
  
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          'data-placeholder': {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes['data-placeholder']) {
                return {};
              }
              return {
                'data-placeholder': attributes['data-placeholder'],
              };
            },
          },
        },
      },
    ];
  },
  
  addProseMirrorPlugins() {
    return [];
  },
});
