/**
 * Zenith Editor - A modern, production-ready WYSIWYG editor
 * Built with React, TypeScript, and Tiptap
 */

// Main components
export { ZenithEditor as default, ZenithEditor } from './components/Editor';
export { Toolbar } from './components/Toolbar';
export { FontSelector } from './components/FontSelector';
export { ColorPicker } from './components/ColorPicker';

// Hooks
export { useZenithEditor } from './hooks/useZenithEditor';
export { useFontLoader, useEditorFonts } from './hooks/useFontLoader';
export { useImageUpload } from './hooks/useImageUpload';

// Extensions
export {
  defaultExtensions,
  PlaceholderExtension,
  lowlight,
} from './extensions';

// Font utilities
export {
  FontLoader,
  loadCustomFont,
  loadCustomFonts,
  isCustomFontSupported,
} from './utils/fontLoader';

// Types
export type { ZenithEditorProps, ZenithEditorRef } from './components/Editor';
export type { ToolbarProps } from './components/Toolbar';
export type { FontSelectorProps } from './components/FontSelector';
export type { ColorPickerProps } from './components/ColorPicker';
export type { ZenithEditorOptions } from './hooks/useZenithEditor';
export type {
  ImageUploadState,
  UseImageUploadOptions,
  UseImageUploadReturn,
} from './hooks/useImageUpload';
export type {
  CustomFontDefinition,
  FontLoadOptions,
  FontLoadResult,
  FontLoadStatus,
} from './utils/fontLoader';
export type {
  FontLoadingState,
  UseFontLoaderOptions,
  UseFontLoaderReturn,
  UseEditorFontsOptions,
  UseEditorFontsReturn,
} from './hooks/useFontLoader';

// CSS (users can import this separately)
import './styles/editor.css';
