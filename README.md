# Zenith Editor

[![npm version](https://badge.fury.io/js/zenith-editor.svg)](https://badge.fury.io/js/zenith-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A modern, production-ready WYSIWYG editor built with React, TypeScript, and Tiptap. Perfect for Next.js applications with full SSR support.

## 🎯 Why Zenith Editor?

- **🚀 Production Ready**: Built for enterprise applications with robust error handling
- **⚡ Performance**: Lightweight and fast with minimal dependencies
- **🎨 Modern Design**: Clean, minimalist UI that works everywhere
- **🔧 Developer Experience**: Fully typed TypeScript API with excellent IntelliSense
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **🌐 SSR Compatible**: Full Next.js Server-Side Rendering support
- **🎨 Customizable**: Easy theming with Tailwind CSS
- **🔒 Open Source**: No vendor lock-in, MIT licensed

## ✨ Features

### Rich Text Editing

- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1, H2, H3 with proper hierarchy
- **Lists**: Ordered and unordered lists with nesting
- **Links**: Smart link editing with popup dialog
- **Blockquotes**: Beautiful blockquote styling
- **Code Blocks**: Syntax-highlighted code with language support

### Media & Assets

- **Images**: Drag & drop, paste, or upload with custom handlers
- **File Upload**: Flexible upload system for any backend

### User Experience

- **History**: Full undo/redo functionality
- **Keyboard Shortcuts**: Standard shortcuts (Ctrl+B, Ctrl+I, etc.)
- **Accessibility**: ARIA labels and keyboard navigation
- **Responsive**: Mobile-first design

### Developer Experience

- **TypeScript**: 100% TypeScript with full type safety
- **SSR Ready**: Works with Next.js App Router out of the box
- **Extensible**: Built on Tiptap for maximum customization
- **Testing**: Comprehensive test suite included
- **Documentation**: Detailed docs with examples

## 📦 Installation

```bash
# Using pnpm (recommended)
pnpm add zenith-editor

# Using npm
npm install zenith-editor

# Using yarn
yarn add zenith-editor
```

### Peer Dependencies

```bash
pnpm add react react-dom
```

## 🚀 Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { ZenithEditor } from 'zenith-editor';
import 'zenith-editor/styles';

function MyComponent() {
  const [content, setContent] = useState('<p>Hello world!</p>');

  return (
    <ZenithEditor
      initialContent={content}
      placeholder="Start typing..."
      onUpdate={({ html, json }) => {
        setContent(html);
        console.log('Content updated:', { html, json });
      }}
    />
  );
}
```

### Next.js App Router (Recommended)

For Next.js applications, use dynamic imports for optimal SSR compatibility:

```tsx
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const ZenithEditor = dynamic(
  () => import('zenith-editor').then((mod) => mod.ZenithEditor),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>,
  }
);

export default function EditorPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ZenithEditor
        initialContent="<p>Start writing...</p>"
        placeholder="What's on your mind?"
        onUpdate={({ html }) => console.log(html)}
        onImageUpload={async (file) => {
          // Your upload logic here
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const { url } = await response.json();
          return url;
        }}
      />
    </div>
  );
}
```

## 📚 Documentation

- **[Complete API Reference](./packages/zenith-editor/README.md)** - Detailed documentation with all props and methods
- **[Demo Application](./apps/demo)** - Live examples and use cases
- **[TypeScript Guide](./docs/typescript.md)** - Type definitions and usage
- **[Customization Guide](./docs/customization.md)** - Theming and styling
- **[Next.js Integration](./docs/nextjs.md)** - SSR setup and best practices

## 🎮 Live Demo

Experience Zenith Editor in action:

```bash
# Clone the repository
git clone https://github.com/zenith-editor/zenith-editor.git
cd zenith-editor

# Install dependencies
pnpm install

# Run the demo
pnpm demo
```

Visit [http://localhost:3000](http://localhost:3000) to see the editor in action.

## 🏗️ Project Structure

This is a monorepo built with pnpm workspaces:

```
zenith-editor/
├── packages/
│   └── zenith-editor/          # Core editor package
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── hooks/         # Custom hooks
│       │   ├── extensions/    # Tiptap extensions
│       │   └── styles/        # CSS styles
│       └── package.json
├── apps/
│   └── demo/                  # Next.js demo application
│       ├── app/              # App Router pages
│       └── package.json
├── package.json              # Root workspace config
└── README.md
```

## 🧪 Testing

The package includes a comprehensive test suite:

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test --coverage

# Run tests in watch mode
pnpm test --watch
```

### Example Test

```tsx
import { render, screen } from '@testing-library/react';
import { ZenithEditor } from 'zenith-editor';

test('renders editor with placeholder', () => {
  render(<ZenithEditor placeholder="Type something..." />);

  expect(screen.getByText('Type something...')).toBeInTheDocument();
});
```

## 🚀 CI/CD & Publishing

This project uses GitHub Actions for automated testing and publishing:

### Automated Workflows

- **🧪 CI Pipeline**: Runs tests, linting, and type checking on every PR
- **📦 NPM Publishing**: Automatically publishes to npm when tags are created
- **🏷️ Release Management**: Creates GitHub releases with changelogs
- **🔄 Dependency Updates**: Weekly automated dependency updates

### Publishing a New Version

```bash
# Method 1: Automated (Recommended)
# 1. Go to GitHub Actions → Release workflow
# 2. Click "Run workflow" and select version type
# 3. The workflow will handle everything automatically

# Method 2: Manual
git tag v1.0.0
git push origin v1.0.0
# This triggers automatic npm publishing
```

### Development Workflow

```bash
# Pre-release checks (runs all validations)
pnpm prerelease

# Individual checks
pnpm lint          # ESLint
pnpm type-check    # TypeScript
pnpm test          # Test suite
pnpm build:package # Build verification
```

For detailed workflow documentation, see [docs/workflows.md](./docs/workflows.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/zenith-editor/zenith-editor.git
cd zenith-editor

# Install dependencies
pnpm install

# Build the package
pnpm build:package

# Run tests
pnpm test

# Start the demo
pnpm demo
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/zenith-editor/zenith-editor/issues)
- **Discussions**: [Community discussions and Q&A](https://github.com/zenith-editor/zenith-editor/discussions)
- **Documentation**: [Comprehensive docs and guides](./docs)

## 🚀 Roadmap

- [ ] **Tables**: Rich table editing with resize and styling
- [ ] **Collaborative Editing**: Real-time collaboration with conflict resolution
- [ ] **Math Support**: LaTeX math equation rendering
- [ ] **Export Features**: PDF and Word document export
- [ ] **Plugin System**: Marketplace for community extensions
- [ ] **Mobile SDK**: React Native integration
- [ ] **AI Integration**: Smart writing assistance
- [ ] **Advanced Media**: Video embeds and galleries

## 🙏 Acknowledgments

Built with these amazing open-source projects:

- [Tiptap](https://tiptap.dev/) - Headless editor framework
- [ProseMirror](https://prosemirror.net/) - Rich text editing toolkit
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Next.js](https://nextjs.org/) - React framework

---

<div align="center">
  <p>Made with ❤️ by the Zenith Editor team</p>
  <p>
    <a href="https://github.com/amitjha329/zenith-editor-monorepo">GitHub</a> •
    <a href="https://www.npmjs.com/package/zenith-editor">npm</a> •
    <!-- <a href="https://zenith-editor.dev">Website</a> -->
  </p>
</div>
