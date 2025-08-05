/**
 * Zenith Editor - A modern, production-ready WYSIWYG editor
 * Built with React, TypeScript, and Tiptap
 */

// Main components
export { ZenithEditor as default, ZenithEditor } from './components/Editor';
export { Toolbar } from './components/Toolbar';

// Hooks
export { useZenithEditor } from './hooks/useZenithEditor';

// Extensions
export { defaultExtensions, PlaceholderExtension, lowlight } from './extensions';

// Types
export type { ZenithEditorProps, ZenithEditorRef } from './components/Editor';
export type { ToolbarProps } from './components/Toolbar';
export type { ZenithEditorOptions } from './hooks/useZenithEditor';

// CSS (users can import this separately)
import './styles/editor.css';
