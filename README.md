# Zenith Editor

A modern, production-ready WYSIWYG editor built with React, TypeScript, and Tiptap. Perfect for Next.js applications with full SSR support and comprehensive font management.

## ✨ Features

- 🎨 **Modern UI**: Clean, minimalist floating toolbar design
- 🔧 **TypeScript**: Fully typed for excellent developer experience
- 🚀 **SSR Ready**: Full Next.js Server-Side Rendering compatibility
- 📱 **Responsive**: Works perfectly on desktop and mobile devices
- 🎯 **Lightweight**: Only open-source dependencies, no vendor lock-in
- 🧩 **Extensible**: Built on Tiptap for maximum customization
- 🎨 **Tailwind CSS**: Styled with Tailwind for easy customization
- ✨ **Font Selector**: Built-in font selector with system and custom fonts

### Built-in Features

- **🎨 Font Selection**: Intuitive font selector dropdown with system fonts and custom font integration
- **Text Formatting**: Bold, Italic, Underline, Strikethrough
- **Custom Font Loading**: Load fonts using FontFace Web API with fallback support
- **Content Styling**: Custom fonts, colors, spacing, and typography
- **Multi-language Support**: Full Unicode support with custom font loading
- **Headings**: H1, H2, H3 with proper hierarchy
- **Lists**: Ordered and unordered lists
- **Links**: Easy link creation and editing with popup dialog
- **Images**: Drag & drop or paste images with custom upload handling
- **Code Blocks**: Syntax-highlighted code blocks
- **Blockquotes**: Beautiful blockquote styling
- **History**: Full undo/redo support
- **Output**: Clean HTML and JSON export

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

### Next.js App Router Usage

For Next.js applications, use dynamic imports to ensure proper SSR compatibility:

```tsx
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Import the editor dynamically to avoid SSR issues
const ZenithEditor = dynamic(
  () => import('zenith-editor').then((mod) => mod.ZenithEditor),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

export default function EditorPage() {
  const [content, setContent] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Editor</h1>

      <ZenithEditor
        initialContent="<p>Start writing your content here...</p>"
        placeholder="What's on your mind?"
        onUpdate={({ html, json }) => {
          setContent(html);
        }}
        onImageUpload={async (file) => {
          // Implement your image upload logic
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

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Output:</h2>
        <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">{content}</pre>
      </div>
    </div>
  );
}
```

### Image Upload Implementation

```tsx
import { ZenithEditor } from 'zenith-editor';

function EditorWithImageUpload() {
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      // Option 1: Upload to your API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      return url;

      // Option 2: Upload to cloud storage (e.g., AWS S3)
      // const { url } = await uploadToS3(file);
      // return url;

      // Option 3: Convert to base64 (not recommended for production)
      // return new Promise((resolve) => {
      //   const reader = new FileReader();
      //   reader.onload = () => resolve(reader.result as string);
      //   reader.readAsDataURL(file);
      // });
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  return (
    <ZenithEditor
      onImageUpload={handleImageUpload}
      placeholder="Type something or drag an image..."
    />
  );
}
```

## 🔧 API Reference

### ZenithEditor Props

| Prop                 | Type                                    | Default             | Description                                   |
| -------------------- | --------------------------------------- | ------------------- | --------------------------------------------- |
| `initialContent`     | `string \| JSONContent`                 | `''`                | Initial content as HTML string or Tiptap JSON |
| `placeholder`        | `string`                                | `'Start typing...'` | Placeholder text when editor is empty         |
| `editable`           | `boolean`                               | `true`              | Whether the editor should be editable         |
| `showToolbar`        | `boolean`                               | `true`              | Whether to show the toolbar                   |
| `autoFocus`          | `boolean \| 'start' \| 'end' \| number` | `false`             | Auto focus behavior on mount                  |
| `className`          | `string`                                | `undefined`         | Additional CSS class for the editor           |
| `containerClassName` | `string`                                | `undefined`         | Additional CSS class for the container        |
| `editorClassName`    | `string`                                | `undefined`         | Additional CSS class for the editor content   |
| `style`              | `React.CSSProperties`                   | `undefined`         | Inline styles for the container               |
| `contentStyle`       | `React.CSSProperties`                   | `undefined`         | Inline styles for the editor content         |
| `customFonts`        | `CustomFontDefinition[]`                | `[]`                | Custom fonts to load using FontFace API      |
| `fontLoadOptions`    | `FontLoadOptions`                       | `{}`                | Options for font loading behavior             |
| `onFontsLoaded`      | `(fonts: string[]) => void`             | `undefined`         | Callback when fonts are successfully loaded   |
| `onFontLoadError`    | `(error) => void`                       | `undefined`         | Callback when font loading fails             |
| `onUpdate`           | `(props) => void`                       | `undefined`         | Callback when content changes                 |
| `onImageUpload`      | `(file: File) => Promise<string>`       | `undefined`         | Custom image upload handler                   |
| `extensions`         | `Extension[]`                           | `[]`                | Additional Tiptap extensions                  |
| `toolbar`            | `React.ComponentType`                   | `Toolbar`           | Custom toolbar component                      |

### onUpdate Callback

```tsx
onUpdate: ({ editor, html, json }) => {
  // editor: Tiptap Editor instance
  // html: Current content as HTML string
  // json: Current content as Tiptap JSON object
};
```

### useZenithEditor Hook

For advanced use cases, you can use the hook directly:

```tsx
import { useZenithEditor } from 'zenith-editor';

function CustomEditor() {
  const {
    editor,
    getHTML,
    getJSON,
    setContent,
    clearContent,
    focus,
    isEmpty,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useZenithEditor({
    initialContent: '<p>Hello</p>',
    onUpdate: ({ html }) => console.log(html),
  });

  return (
    <div>
      <button onClick={() => setContent('<p>New content</p>')}>
        Set Content
      </button>
      <button onClick={clearContent}>Clear</button>
      <button onClick={focus}>Focus</button>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>

      <EditorContent editor={editor} />

      <div>
        <strong>Empty:</strong> {isEmpty ? 'Yes' : 'No'}
      </div>
    </div>
  );
}
```

### Imperative API with Refs

```tsx
import { useRef } from 'react';
import { ZenithEditor, ZenithEditorRef } from 'zenith-editor';

function EditorWithRef() {
  const editorRef = useRef<ZenithEditorRef>(null);

  const handleSave = () => {
    if (editorRef.current) {
      const html = editorRef.current.getHTML();
      const json = editorRef.current.getJSON();

      // Save content...
      console.log({ html, json });
    }
  };

  const handleClear = () => {
    editorRef.current?.clearContent();
  };

  return (
    <div>
      <ZenithEditor ref={editorRef} />

      <div className="mt-4 space-x-2">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}
```

## 🎨 Customization

### Content Styling

Customize the appearance of your editor content with the `contentStyle` prop. This allows you to apply custom fonts, colors, spacing, and other CSS properties directly to the editor content:

```tsx
import { ZenithEditor } from 'zenith-editor';

function StyledEditor() {
  return (
    <ZenithEditor
      initialContent="<h2>Custom Styled Content</h2><p>This content has custom styling applied.</p>"
      contentStyle={{
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        lineHeight: '1.8',
        color: '#2c3e50',
        letterSpacing: '0.5px'
      }}
    />
  );
}
```

#### Content Styling Examples

**Elegant Serif Style:**
```tsx
<ZenithEditor
  contentStyle={{
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#2c3e50'
  }}
/>
```

**Modern Sans-Serif Style:**
```tsx
<ZenithEditor
  contentStyle={{
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#374151',
    letterSpacing: '0.025em'
  }}
/>
```

**Developer/Technical Style:**
```tsx
<ZenithEditor
  contentStyle={{
    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#1f2937',
    backgroundColor: '#f8fafc'
  }}
/>
```

**Creative/Artistic Style:**
```tsx
<ZenithEditor
  contentStyle={{
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '17px',
    lineHeight: '1.8',
    color: '#7c3aed',
    textAlign: 'center'
  }}
/>
```

The `contentStyle` prop accepts any valid CSS properties and applies them to the editor content area, giving you complete control over the visual appearance of your text.

### Custom Font Loading

Zenith Editor supports loading custom fonts using the modern FontFace Web API. This allows you to use any web font, including Google Fonts, Adobe Fonts, or your own hosted font files.

#### Basic Font Loading

```tsx
import { ZenithEditor } from 'zenith-editor';

function EditorWithCustomFont() {
  return (
    <ZenithEditor
      initialContent="<p>This text uses a custom font!</p>"
      customFonts={[
        {
          fontFamily: 'Roboto',
          src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
          format: 'woff2',
          fontDisplay: 'swap'
        }
      ]}
      contentStyle={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '16px'
      }}
    />
  );
}
```

#### Multiple Font Weights and Styles

```tsx
<ZenithEditor
  customFonts={[
    {
      fontFamily: 'Inter',
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: '400',
      fontStyle: 'normal'
    },
    {
      fontFamily: 'Inter',
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: '700',
      fontStyle: 'normal'
    },
    {
      fontFamily: 'Inter',
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: '400',
      fontStyle: 'italic'
    }
  ]}
  contentStyle={{ fontFamily: 'Inter, sans-serif' }}
/>
```

#### Local Font Files

```tsx
<ZenithEditor
  customFonts={[
    {
      fontFamily: 'MyCustomFont',
      src: '/fonts/my-custom-font.woff2',
      format: 'woff2'
    },
    {
      fontFamily: 'HindiFont',
      src: '/fonts/hindi_font.ttf',
      format: 'truetype',
      unicodeRange: 'U+0900-097F' // Devanagari script
    }
  ]}
  contentStyle={{
    fontFamily: 'MyCustomFont, sans-serif'
  }}
/>
```

#### Font Loading Configuration

```tsx
<ZenithEditor
  customFonts={[
    {
      fontFamily: 'CustomFont',
      src: '/fonts/custom.woff2',
      fontDisplay: 'swap', // or 'block', 'fallback', 'optional'
      fontWeight: 'normal',
      fontStyle: 'normal'
    }
  ]}
  fontLoadOptions={{
    autoLoad: true,     // Load fonts automatically (default: true)
    timeout: 10000,     // Timeout in milliseconds (default: 5000)
    testString: 'ABC'   // Test string for loading detection
  }}
  onFontsLoaded={(fonts) => {
    console.log('Successfully loaded fonts:', fonts);
  }}
  onFontLoadError={(error) => {
    console.error('Font loading failed:', error);
  }}
/>
```

#### Advanced Font Loading with Hooks

For more control over font loading, use the font loading hooks:

```tsx
import { useFontLoader, ZenithEditor } from 'zenith-editor';

function AdvancedFontExample() {
  const {
    state,
    loadFont,
    isFontLoaded,
    getLoadedFonts
  } = useFontLoader([
    {
      fontFamily: 'Poppins',
      src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJDUc1NECPY.woff2'
    }
  ]);

  const handleLoadAdditionalFont = async () => {
    await loadFont({
      fontFamily: 'Montserrat',
      src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2'
    });
  };

  return (
    <div>
      <div className="mb-4">
        <p>Loading: {state.isLoading ? 'Yes' : 'No'}</p>
        <p>Loaded fonts: {getLoadedFonts().join(', ')}</p>
        <button onClick={handleLoadAdditionalFont}>
          Load Additional Font
        </button>
      </div>
      
      <ZenithEditor
        contentStyle={{
          fontFamily: isFontLoaded('Poppins') 
            ? 'Poppins, sans-serif' 
            : 'sans-serif'
        }}
      />
    </div>
  );
}
```

### Custom Styling

The editor uses Tailwind CSS classes that can be customized:

```css
/* Custom styles for your application */
.zenith-editor-container {
  @apply border-2 border-blue-500 rounded-xl;
}

.zenith-toolbar {
  @apply bg-blue-50 border-blue-200;
}

.zenith-editor-content .zenith-paragraph {
  @apply text-lg leading-relaxed;
}

.zenith-editor-content .zenith-heading {
  @apply text-blue-900;
}
```

### Custom Toolbar

```tsx
import { Editor } from '@tiptap/react';

interface CustomToolbarProps {
  editor: Editor;
  onImageUpload?: (file: File) => Promise<string>;
}

function CustomToolbar({ editor }: CustomToolbarProps) {
  return (
    <div className="flex gap-2 p-2 border-b">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Bold
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Italic
      </button>
    </div>
  );
}

// Use custom toolbar
<ZenithEditor
  toolbar={CustomToolbar}
  // ... other props
/>;
```

### Adding Custom Extensions

```tsx
import { ZenithEditor } from 'zenith-editor';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';

function EditorWithCustomExtensions() {
  const customExtensions = [
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Color.configure({
      types: ['textStyle'],
    }),
  ];

  return (
    <ZenithEditor
      extensions={customExtensions}
      // ... other props
    />
  );
}
```

## 🔤 Font Utilities

Zenith Editor provides utility functions for working with custom fonts:

### FontLoader Class

```tsx
import { FontLoader } from 'zenith-editor';

const fontLoader = FontLoader.getInstance();

// Check if FontFace API is supported
if (FontLoader.isSupported()) {
  // Load a single font
  const result = await fontLoader.loadFont({
    fontFamily: 'MyFont',
    src: '/fonts/myfont.woff2'
  });

  // Load multiple fonts
  const results = await fontLoader.loadFonts([
    { fontFamily: 'Font1', src: '/fonts/font1.woff2' },
    { fontFamily: 'Font2', src: '/fonts/font2.woff2' }
  ]);

  // Check if font is loaded
  if (fontLoader.isFontLoaded('MyFont')) {
    console.log('Font is ready to use');
  }

  // Get all loaded fonts
  const loadedFonts = fontLoader.getLoadedFonts();

  // Remove a font
  fontLoader.removeFont('MyFont');

  // Clear all fonts
  fontLoader.clearAllFonts();
}
```

### Standalone Font Loading

```tsx
import { loadCustomFont, loadCustomFonts } from 'zenith-editor';

// Load a single font
const result = await loadCustomFont({
  fontFamily: 'CustomFont',
  src: '/fonts/custom.woff2',
  fontDisplay: 'swap'
});

if (result.status === 'loaded') {
  console.log('Font loaded successfully');
} else {
  console.error('Font loading failed:', result.error);
}

// Load multiple fonts
const results = await loadCustomFonts([
  { fontFamily: 'Font1', src: '/fonts/font1.woff2' },
  { fontFamily: 'Font2', src: '/fonts/font2.woff2' }
]);

results.forEach(result => {
  console.log(`${result.fontFamily}: ${result.status}`);
});
```

### CSS Generation

```tsx
import { FontLoader } from 'zenith-editor';

// Generate CSS @font-face rule
const cssRule = FontLoader.createCSSFontFace({
  fontFamily: 'MyFont',
  src: '/fonts/myfont.woff2',
  fontWeight: '400',
  fontStyle: 'normal'
});

console.log(cssRule);
// Output:
// @font-face {
//   font-family: 'MyFont';
//   src: url('/fonts/myfont.woff2') format('woff2');
//   font-weight: 400;
//   font-style: normal;
//   font-stretch: normal;
//   font-display: swap;
// }
```

## 🧪 Testing

The package includes comprehensive tests. To run them:

```bash
# In the package directory
pnpm test

# Run with coverage
pnpm test --coverage

# Run in watch mode
pnpm test --watch
```

Example test for your components:

```tsx
import { render, screen } from '@testing-library/react';
import { ZenithEditor } from 'zenith-editor';

test('renders editor with placeholder', () => {
  render(<ZenithEditor placeholder="Type something..." />);

  expect(screen.getByText('Type something...')).toBeInTheDocument();
});
```

## 🏗️ Building from Source

```bash
# Clone the repository
git clone https://github.com/zenith-editor/zenith-editor.git
cd zenith-editor

# Install dependencies
pnpm install

# Build the package
pnpm build:package

# Run the demo
pnpm demo
```

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 🐛 Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/zenith-editor/zenith-editor/issues).

## 🎯 Roadmap

- [ ] Table support
- [ ] Collaborative editing
- [ ] Math equation support
- [ ] Export to PDF/Word
- [ ] Plugin marketplace
- [ ] Mobile app integration

---

Made with ❤️ by the Zenith Editor team
