# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.0] - 2025-11-13

### Added

- **🎨 Text Color Picker**: New color picker component in the toolbar for text color selection
- **🌈 Predefined Color Palette**: Built-in palette with 10 commonly used colors
- **🎯 Custom Color Input**: HTML5 color picker for selecting any custom color
- **🔄 Remove Color Option**: Ability to remove color formatting and revert to default
- **📝 Color Demo Section**: New demo section showcasing color picker functionality

### Fixed

- **🔧 Initial Content Visibility**: Fixed issue where initial content wasn't visible for some users
- **⚡ Editor Mounting**: Added `onCreate` callback to ensure initial content is properly set after editor creation
- **🎨 Demo Styling**: Removed problematic red text color from demo that was confusing users
- **📱 SSR Hydration**: Improved SSR compatibility with better content initialization

### Enhanced

- **📚 Updated Documentation**: Comprehensive README updates with color picker usage examples
- **🧪 Troubleshooting Section**: Added troubleshooting guide for common issues
- **🎯 Better Examples**: Enhanced demo content with color examples and clearer feature showcasing
- **🔧 Framework Support**: Updated compatibility notes for Next.js 16 and React 19

### Technical

- Enhanced Tiptap Color extension integration
- Improved editor initialization flow
- Better error handling for content mounting
- Updated TypeScript definitions for color picker props

### Dependencies

- Updated `@tiptap/extension-color@^2.2.4` (already included)
- Enhanced toolbar component with color picker integration

## [1.3.4] - 2025-10-25

- **Minor Changes**: Minor Bug Fixes

## [1.3.3] - 2025-10-25

- **Minor Changes**: Minor Bug Fixes

## [1.3.2] - 2025-10-25

- **Minor Changes**: Updated Readme and Changelogs

## [1.3.1] - 2025-10-25

- **Minor Changes**: Changes to docs and Core File Structure

## [1.3.0] - 2025-10-25

### Added

- **🎨 Font Selector Component**: New font selector dropdown in the toolbar for easy font family changes
- **📝 System Fonts Support**: Built-in support for 11 common system fonts (Arial, Georgia, Times New Roman, etc.)
- **🔤 Custom Font Integration**: Seamless integration with the existing FontLoader system for custom fonts
- **⚡ TipTap Extensions**: Added `@tiptap/extension-font-family` and `@tiptap/extension-text-style` for font manipulation
- **🎯 Current Font Detection**: Smart detection and display of currently applied font in the selector
- **🛡️ Error Handling**: Graceful degradation in test environments and missing dependencies

### Features

- **Font Selector UI**: Intuitive dropdown component with system and custom font options
- **Real-time Font Application**: Instant font changes applied to selected text in the editor
- **Custom Font Loading**: Dynamic font loading with FontFace Web API integration
- **Toolbar Integration**: Seamlessly integrated into the existing toolbar component
- **TypeScript Support**: Full type definitions for all font-related components and utilities

### Technical

- Enhanced toolbar with font selection capabilities
- Updated extensions configuration with font family support
- Improved editor component with font loading state management
- Added comprehensive test coverage for font selector functionality
- Maintained backwards compatibility with existing editor implementations

### Dependencies

- Added `@tiptap/extension-font-family@^2.26.4`
- Added `@tiptap/extension-text-style@^2.26.4`

## [1.2.0] - 2024-11-15

### Added

- Initial release of Zenith Editor
- Core WYSIWYG editing functionality
- React and TypeScript support
- Next.js SSR compatibility
- Tailwind CSS styling
- Comprehensive test suite
- Demo application

### Features

- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1, H2, H3 support
- **Lists**: Ordered and unordered lists
- **Links**: Link creation and editing with popup dialog
- **Images**: Image upload with custom handler support
- **Code Blocks**: Syntax-highlighted code blocks
- **Blockquotes**: Beautiful blockquote styling
- **History**: Undo/redo functionality
- **Responsive Design**: Mobile-first responsive layout
- **Accessibility**: ARIA labels and keyboard navigation
- **TypeScript**: Full type safety and IntelliSense support

### Technical

- Built on Tiptap 2.x for extensibility
- Uses ProseMirror for rich text editing
- Tailwind CSS for styling
- Jest and React Testing Library for testing
- ESLint and Prettier for code quality
- pnpm workspaces for monorepo management

## [1.0.0] - 2024-08-04

### Added

- Initial release of Zenith Editor package
- Complete monorepo setup with demo application
- Comprehensive documentation and examples
- MIT license for open source usage

---

For the complete list of changes, see the [commit history](https://github.com/zenith-editor/zenith-editor/commits/main).
