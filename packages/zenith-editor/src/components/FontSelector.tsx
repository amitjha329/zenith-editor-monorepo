import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import classNames from 'classnames';

/**
 * Common system fonts that are widely available
 */
const SYSTEM_FONTS = [
  { name: 'Default', value: '' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, Times, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' }
];

/**
 * Props for the FontSelector component
 */
export interface FontSelectorProps {
  /** The Tiptap editor instance */
  editor: Editor;
  /** Additional CSS class names */
  className?: string;
  /** List of loaded custom fonts */
  loadedFonts?: string[];
  /** Callback when font is selected */
  onFontSelect?: (fontFamily: string) => void;
}

/**
 * Font selector dropdown component for the toolbar
 */
export function FontSelector({ 
  editor, 
  className, 
  loadedFonts = [], 
  onFontSelect 
}: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFont, setCurrentFont] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Update current font when editor selection changes
  useEffect(() => {
    if (!editor || !editor.on) return;

    const updateCurrentFont = () => {
      // Get the current font family from the editor's active styles
      const fontFamily = editor.getAttributes('textStyle')?.fontFamily || '';
      setCurrentFont(fontFamily);
    };

    // Listen for selection and content changes
    editor.on('selectionUpdate', updateCurrentFont);
    editor.on('transaction', updateCurrentFont);
    
    // Initial update
    updateCurrentFont();

    return () => {
      if (editor.off) {
        editor.off('selectionUpdate', updateCurrentFont);
        editor.off('transaction', updateCurrentFont);
      }
    };
  }, [editor]);

  // Apply font to selected text
  const handleFontSelect = (fontFamily: string) => {
    if (fontFamily === '') {
      // Remove font family attribute to use default
      editor.chain().focus().unsetFontFamily().run();
    } else {
      // Set the font family
      editor.chain().focus().setFontFamily(fontFamily).run();
    }
    
    setIsOpen(false);
    onFontSelect?.(fontFamily);
  };

  // Get display name for current font
  const getCurrentFontName = () => {
    if (!currentFont) return 'Default';
    
    // Check system fonts first
    const systemFont = SYSTEM_FONTS.find(font => font.value === currentFont);
    if (systemFont) return systemFont.name;
    
    // Check loaded custom fonts
    const customFont = loadedFonts.find(font => currentFont.includes(font));
    if (customFont) return customFont;
    
    // Fallback to the font family value itself
    return currentFont.split(',')[0].replace(/['"]/g, '');
  };

  // Combine system fonts and custom fonts
  const allFonts = [
    ...SYSTEM_FONTS,
    ...loadedFonts.map(font => ({
      name: font,
      value: `"${font}", sans-serif`
    }))
  ];

  if (!editor) {
    return null;
  }

  return (
    <div className={classNames('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="zenith-font-selector-button px-3 py-1 min-w-[120px] text-left border border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
        title="Select Font"
        type="button"
      >
        <span className="text-sm truncate" style={{ fontFamily: currentFont || 'inherit' }}>
          {getCurrentFontName()}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={classNames('transition-transform', {
            'rotate-180': isOpen
          })}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {allFonts.map((font) => (
            <button
              key={font.value || 'default'}
              onClick={() => handleFontSelect(font.value)}
              className={classNames(
                'w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100',
                {
                  'bg-blue-50 text-blue-700': currentFont === font.value || (!currentFont && font.value === '')
                }
              )}
              style={{ fontFamily: font.value || 'inherit' }}
              type="button"
            >
              {font.name}
            </button>
          ))}
          
          {loadedFonts.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
              No custom fonts loaded
            </div>
          )}
        </div>
      )}
    </div>
  );
}