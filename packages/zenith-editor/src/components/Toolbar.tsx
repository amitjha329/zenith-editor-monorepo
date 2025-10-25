import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import classNames from 'classnames';
import { FontSelector } from './FontSelector';

/**
 * Props for the Toolbar component
 */
export interface ToolbarProps {
  /** The Tiptap editor instance */
  editor: Editor;
  /** Additional CSS class names */
  className?: string;
  /** Callback for handling image uploads */
  onImageUpload?: (file: File) => Promise<string>;
  /** List of loaded custom fonts for font selector */
  loadedFonts?: string[];
}

/**
 * Floating toolbar component with rich text editing controls
 *
 * @param props - Toolbar component props
 * @returns JSX element representing the toolbar
 */
export function Toolbar({ editor, className, onImageUpload, loadedFonts = [] }: ToolbarProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkDialogRef = useRef<HTMLDivElement>(null);

  // Close link dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        linkDialogRef.current &&
        !linkDialogRef.current.contains(event.target as Node)
      ) {
        setShowLinkDialog(false);
      }
    };

    if (showLinkDialog) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showLinkDialog]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !onImageUpload) return;

    try {
      const url = await onImageUpload(file);
      if (url) {
        editor.chain().focus().setImageResize({ src: url }).run();
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSetLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setShowLinkDialog(false);
    setLinkUrl('');
  };

  const openLinkDialog = () => {
    const { href } = editor.getAttributes('link');
    setLinkUrl(href || '');
    setShowLinkDialog(true);
  };

  if (!editor) {
    return null;
  }

  const buttonClass =
    'zenith-toolbar-button px-2 py-1 rounded hover:bg-gray-100 border-none bg-transparent cursor-pointer transition-colors duration-200 flex items-center justify-center';
  const activeButtonClass = 'bg-gray-200 hover:bg-gray-300';

  return (
    <div
      className={classNames(
        'zenith-toolbar',
        'flex items-center gap-1 p-2 border border-gray-300 rounded-lg bg-white shadow-sm',
        className
      )}
    >
      {/* Font Selector */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <FontSelector 
          editor={editor} 
          loadedFonts={loadedFonts}
          onFontSelect={(fontFamily) => {
            // Optional callback for when font is selected
            console.log('Font selected:', fontFamily);
          }}
        />
      </div>

      {/* Text Formatting */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('bold'),
          })}
          title="Bold (Ctrl+B)"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 5V7h6a2 2 0 0 1 2 2 2 2 0 0 1-2 2H8zm0 6h6a2 2 0 0 1 2 2 2 2 0 0 1-2 2H8v-4z" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('italic'),
          })}
          title="Italic (Ctrl+I)"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('underline'),
          })}
          title="Underline (Ctrl+U)"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 21h14v-2H5v2zm7-4a6 6 0 0 0 6-6V3h-2.5v8a3.5 3.5 0 0 1-7 0V3H6v8a6 6 0 0 0 6 6z" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('strike'),
          })}
          title="Strikethrough"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z" />
          </svg>
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('heading', { level: 1 }),
          })}
          title="Heading 1"
          type="button"
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('heading', { level: 2 }),
          })}
          title="Heading 2"
          type="button"
        >
          H2
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('heading', { level: 3 }),
          })}
          title="Heading 3"
          type="button"
        >
          H3
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('bulletList'),
          })}
          title="Bullet List"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 5h14v2H7V5zm0 8v-2h14v2H7zM4 4.5A1.5 1.5 0 0 1 5.5 6 1.5 1.5 0 0 1 4 7.5 1.5 1.5 0 0 1 2.5 6 1.5 1.5 0 0 1 4 4.5zm0 6A1.5 1.5 0 0 1 5.5 12 1.5 1.5 0 0 1 4 13.5 1.5 1.5 0 0 1 2.5 12 1.5 1.5 0 0 1 4 10.5zm0 6A1.5 1.5 0 0 1 5.5 18 1.5 1.5 0 0 1 4 19.5 1.5 1.5 0 0 1 2.5 18 1.5 1.5 0 0 1 4 16.5zM7 19v-2h14v2H7z" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('orderedList'),
          })}
          title="Ordered List"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
          </svg>
        </button>
      </div>

      {/* Links and Images */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <div className="relative">
          <button
            onClick={openLinkDialog}
            className={classNames(buttonClass, {
              [activeButtonClass]: editor.isActive('link'),
            })}
            title="Add Link"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
            </svg>
          </button>

          {showLinkDialog && (
            <div
              ref={linkDialogRef}
              className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[300px]"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="link-url"
                  className="text-sm font-medium text-gray-700"
                >
                  URL:
                </label>
                <input
                  id="link-url"
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowLinkDialog(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSetLink}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    type="button"
                  >
                    {linkUrl ? 'Update' : 'Remove'} Link
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {onImageUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={buttonClass}
              title="Add Image"
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Block Elements */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('blockquote'),
          })}
          title="Blockquote"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={classNames(buttonClass, {
            [activeButtonClass]: editor.isActive('codeBlock'),
          })}
          title="Code Block"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
          </svg>
        </button>
      </div>

      {/* History */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={classNames(
            buttonClass,
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Undo (Ctrl+Z)"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={classNames(
            buttonClass,
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Redo (Ctrl+Y)"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
