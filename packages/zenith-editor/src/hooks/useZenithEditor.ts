import { useEditor, Editor } from '@tiptap/react';
import { JSONContent } from '@tiptap/core';
import { useCallback, useEffect } from 'react';
import { defaultExtensions, PlaceholderExtension } from '../extensions';

/**
 * Configuration options for the Zenith Editor
 */
export interface ZenithEditorOptions {
  /** Initial content as HTML string or JSON object */
  initialContent?: string | JSONContent;
  /** Placeholder text to show when editor is empty */
  placeholder?: string;
  /** Whether the editor should be editable */
  editable?: boolean;
  /** Callback fired when content changes */
  onUpdate?: (props: { editor: Editor; html: string; json: JSONContent }) => void;
  /** Callback for handling image uploads */
  onImageUpload?: (file: File) => Promise<string>;
  /** Custom extensions to add to the editor */
  extensions?: any[];
  /** Custom CSS class name for the editor */
  className?: string;
  /** Whether to automatically focus the editor on mount */
  autoFocus?: boolean | 'start' | 'end' | number;
}

/**
 * Main hook for creating and managing a Zenith Editor instance
 * 
 * @param options - Configuration options for the editor
 * @returns Tiptap editor instance and utility functions
 * 
 * @example
 * ```tsx
 * const { editor, getHTML, getJSON } = useZenithEditor({
 *   initialContent: '<p>Hello world!</p>',
 *   placeholder: 'Start typing...',
 *   onUpdate: ({ html, json }) => {
 *     console.log('Content updated:', html);
 *   },
 *   onImageUpload: async (file) => {
 *     // Upload to your server/CDN
 *     const formData = new FormData();
 *     formData.append('file', file);
 *     const response = await fetch('/api/upload', {
 *       method: 'POST',
 *       body: formData,
 *     });
 *     const { url } = await response.json();
 *     return url;
 *   },
 * });
 * ```
 */
export function useZenithEditor(options: ZenithEditorOptions = {}) {
  const {
    initialContent = '',
    placeholder = 'Start typing...',
    editable = true,
    onUpdate,
    onImageUpload,
    extensions: customExtensions = [],
    autoFocus = false,
  } = options;

  // Combine default extensions with custom ones
  const allExtensions = [
    ...defaultExtensions,
    PlaceholderExtension,
    ...customExtensions,
  ];

  const editor = useEditor({
    extensions: allExtensions,
    content: initialContent,
    editable,
    autofocus: autoFocus,
    immediatelyRender: false, // Fix SSR hydration issues
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        const html = editor.getHTML();
        const json = editor.getJSON();
        onUpdate({ editor, html, json });
      }
    },
    editorProps: {
      attributes: {
        'data-placeholder': placeholder,
        class: 'zenith-editor-content',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/') && onImageUpload) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const files = event.clipboardData?.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/') && onImageUpload) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor || !onImageUpload) return;

    try {
      const url = await onImageUpload(file);
      if (url) {
        editor.chain().focus().setImageResize({ src: url }).run();
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }, [editor, onImageUpload]);

  /**
   * Get the current content as HTML string
   */
  const getHTML = useCallback(() => {
    return editor?.getHTML() || '';
  }, [editor]);

  /**
   * Get the current content as JSON object
   */
  const getJSON = useCallback(() => {
    return editor?.getJSON() || { type: 'doc', content: [] };
  }, [editor]);

  /**
   * Set the editor content
   */
  const setContent = useCallback((content: string | JSONContent) => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [editor]);

  /**
   * Clear all content from the editor
   */
  const clearContent = useCallback(() => {
    if (editor) {
      editor.commands.clearContent();
    }
  }, [editor]);

  /**
   * Focus the editor
   */
  const focus = useCallback(() => {
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

  /**
   * Check if the editor is empty
   */
  const isEmpty = editor?.isEmpty ?? true;

  /**
   * Check if the editor is focused
   */
  const isFocused = editor?.isFocused ?? false;

  /**
   * Check if content can be undone
   */
  const canUndo = editor?.can().undo() ?? false;

  /**
   * Check if content can be redone
   */
  const canRedo = editor?.can().redo() ?? false;

  /**
   * Undo the last action
   */
  const undo = useCallback(() => {
    if (editor) {
      editor.commands.undo();
    }
  }, [editor]);

  /**
   * Redo the last undone action
   */
  const redo = useCallback(() => {
    if (editor) {
      editor.commands.redo();
    }
  }, [editor]);

  // Update placeholder when it changes
  useEffect(() => {
    if (editor) {
      editor.view.dom.setAttribute('data-placeholder', placeholder);
    }
  }, [editor, placeholder]);

  return {
    editor,
    getHTML,
    getJSON,
    setContent,
    clearContent,
    focus,
    isEmpty,
    isFocused,
    canUndo,
    canRedo,
    undo,
    redo,
    handleImageUpload,
  };
}
