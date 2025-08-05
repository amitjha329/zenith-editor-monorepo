import React, { forwardRef, useImperativeHandle } from 'react';
import { EditorContent } from '@tiptap/react';
import classNames from 'classnames';
import { useZenithEditor, ZenithEditorOptions } from '../hooks/useZenithEditor';
import { Toolbar } from './Toolbar';

/**
 * Props for the ZenithEditor component
 */
export interface ZenithEditorProps extends ZenithEditorOptions {
  /** Whether to show the toolbar */
  showToolbar?: boolean;
  /** Custom toolbar component */
  toolbar?: React.ComponentType<{
    editor: any;
    onImageUpload?: (file: File) => Promise<string>;
  }>;
  /** Additional CSS class names for the container */
  containerClassName?: string;
  /** Additional CSS class names for the editor content */
  editorClassName?: string;
  /** Custom styles for the container */
  style?: React.CSSProperties;
}

/**
 * Ref interface for imperative editor control
 */
export interface ZenithEditorRef {
  /** Get the current content as HTML */
  getHTML: () => string;
  /** Get the current content as JSON */
  getJSON: () => any;
  /** Set the editor content */
  setContent: (content: string | any) => void;
  /** Clear all content */
  clearContent: () => void;
  /** Focus the editor */
  focus: () => void;
  /** Undo the last action */
  undo: () => void;
  /** Redo the last undone action */
  redo: () => void;
  /** Check if editor is empty */
  isEmpty: boolean;
  /** Check if editor is focused */
  isFocused: boolean;
  /** Check if can undo */
  canUndo: boolean;
  /** Check if can redo */
  canRedo: boolean;
}

/**
 * ZenithEditor - A modern, production-ready WYSIWYG editor
 *
 * @example
 * ```tsx
 * import { ZenithEditor } from 'zenith-editor';
 * import 'zenith-editor/styles';
 *
 * function MyComponent() {
 *   const [content, setContent] = useState('');
 *
 *   return (
 *     <ZenithEditor
 *       initialContent="<p>Hello world!</p>"
 *       placeholder="Start typing..."
 *       onUpdate={({ html }) => setContent(html)}
 *       onImageUpload={async (file) => {
 *         // Upload logic here
 *         return 'https://example.com/image.jpg';
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export const ZenithEditor = forwardRef<ZenithEditorRef, ZenithEditorProps>(
  (
    {
      showToolbar = true,
      toolbar: CustomToolbar,
      containerClassName,
      editorClassName,
      style,
      onImageUpload,
      ...editorOptions
    },
    ref
  ) => {
    const {
      editor,
      getHTML,
      getJSON,
      setContent,
      clearContent,
      focus,
      undo,
      redo,
      isEmpty,
      isFocused,
      canUndo,
      canRedo,
    } = useZenithEditor(editorOptions);

    // Expose editor methods through ref
    useImperativeHandle(
      ref,
      () => ({
        getHTML,
        getJSON,
        setContent,
        clearContent,
        focus,
        undo,
        redo,
        isEmpty,
        isFocused,
        canUndo,
        canRedo,
      }),
      [
        getHTML,
        getJSON,
        setContent,
        clearContent,
        focus,
        undo,
        redo,
        isEmpty,
        isFocused,
        canUndo,
        canRedo,
      ]
    );

    if (!editor) {
      return null;
    }

    const ToolbarComponent = CustomToolbar || Toolbar;

    return (
      <div
        className={classNames(
          'zenith-editor-container',
          'border border-gray-300 rounded-lg overflow-hidden bg-white',
          containerClassName
        )}
        style={style}
      >
        {showToolbar && (
          <div className="zenith-editor-toolbar-wrapper border-b border-gray-200">
            <ToolbarComponent editor={editor} onImageUpload={onImageUpload} />
          </div>
        )}

        <div className="zenith-editor-wrapper relative">
          <EditorContent
            editor={editor}
            className={classNames(
              'zenith-editor-content-wrapper',
              'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none',
              editorClassName
            )}
          />
        </div>
      </div>
    );
  }
);

ZenithEditor.displayName = 'ZenithEditor';

export default ZenithEditor;
