import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import classNames from 'classnames';

/**
 * Predefined color palette for quick selection
 */
const DEFAULT_COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#374151', // Gray
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#84cc16', // Lime
];

/**
 * Props for the ColorPicker component
 */
export interface ColorPickerProps {
  /** The Tiptap editor instance */
  editor: Editor;
  /** Additional CSS class names */
  className?: string;
  /** Callback when color is selected */
  onColorSelect?: (color: string) => void;
  /** Custom color palette (defaults to built-in colors) */
  colors?: string[];
  /** Show remove color option */
  showRemoveColor?: boolean;
}

/**
 * Color picker component for text color selection
 */
export function ColorPicker({ 
  editor, 
  className, 
  onColorSelect,
  colors = DEFAULT_COLORS,
  showRemoveColor = true
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current text color
  const getCurrentColor = (): string => {
    const color = editor.getAttributes('textStyle').color;
    return color || '#000000';
  };

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

  // Handle color selection
  const handleColorSelect = (color: string) => {
    if (!editor || !editor.isEditable) return;

    editor.chain().focus().setColor(color).run();
    onColorSelect?.(color);
    setIsOpen(false);
  };

  // Handle remove color
  const handleRemoveColor = () => {
    if (!editor || !editor.isEditable) return;

    editor.chain().focus().unsetColor().run();
    onColorSelect?.('');
    setIsOpen(false);
  };

  // Handle custom color input
  const handleCustomColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setCustomColor(color);
    handleColorSelect(color);
  };

  if (!editor) {
    return null;
  }

  const currentColor = getCurrentColor();
  const isColorActive = currentColor !== '#000000';

  return (
    <div className={classNames('relative inline-block', className)} ref={dropdownRef}>
      {/* Color Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          'zenith-color-picker-button',
          'px-2 py-1 rounded hover:bg-gray-100 border-none bg-transparent cursor-pointer transition-colors duration-200 flex items-center justify-center relative',
          {
            'bg-gray-200 hover:bg-gray-300': isColorActive,
          }
        )}
        title={`Text Color (${currentColor})`}
        type="button"
      >
        {/* Text Color Icon */}
        <div className="relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.62 12L12 5.67 14.38 12H9.62zM11 3L5.5 17h2.25L8.5 14h7l.75 3H18.5L13 3H11z" />
          </svg>
          {/* Color indicator bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 rounded"
            style={{ backgroundColor: currentColor }}
          />
        </div>
        
        {/* Dropdown arrow */}
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={classNames('ml-1 transition-transform duration-200', {
            'rotate-180': isOpen,
          })}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {/* Color Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[240px]"
          style={{ maxWidth: '300px' }}
        >
          {/* Color Grid */}
          <div className="grid grid-cols-6 gap-2 mb-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={classNames(
                  'w-8 h-8 rounded border-2 transition-all duration-200 hover:scale-110',
                  {
                    'border-gray-400 ring-2 ring-blue-500': currentColor === color,
                    'border-gray-300 hover:border-gray-400': currentColor !== color,
                  }
                )}
                style={{ backgroundColor: color }}
                title={color}
                type="button"
              >
                {/* Checkmark for selected color */}
                {currentColor === color && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={color === '#ffffff' || color === '#fef3c7' ? '#000000' : '#ffffff'}
                    className="mx-auto"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
            <label htmlFor="custom-color" className="text-sm font-medium text-gray-700">
              Custom:
            </label>
            <input
              id="custom-color"
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="Choose custom color"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const color = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(color)) {
                  setCustomColor(color);
                  handleColorSelect(color);
                }
              }}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>

          {/* Remove Color Button */}
          {showRemoveColor && (
            <button
              onClick={handleRemoveColor}
              className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200 flex items-center justify-center gap-2"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
              Remove Color
            </button>
          )}
        </div>
      )}
    </div>
  );
}