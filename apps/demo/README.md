# Zenith Editor Demo

This is a demonstration application showcasing the Zenith Editor - a modern, production-ready WYSIWYG editor built with React, TypeScript, and Tiptap.

## Features Demonstrated

- ✨ Rich text formatting (bold, italic, underline, strikethrough)
- 📝 Headings (H1, H2, H3)
- 📋 Lists (ordered and unordered)
- 🔗 Links with popup editor
- 🖼️ Image upload and management
- 💻 Code blocks with syntax highlighting
- 💬 Blockquotes
- ↩️ Undo/redo functionality
- 🎨 Tailwind CSS styling
- 📱 Responsive design
- 🚀 Next.js App Router compatibility
- 🖱️ Drag & drop support

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the demo.

### Building

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## Usage Examples

The demo includes several pre-built templates:

- **Blog Post**: Sample blog post with headings, paragraphs, and quotes
- **Meeting Notes**: Structured meeting notes with attendees and action items
- **Documentation**: Technical documentation with code examples

## Image Upload

The demo includes a mock image upload function that converts images to base64. In a production environment, you would replace this with your actual image upload service:

```typescript
const handleImageUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const { url } = await response.json();
  return url;
};
```

## Technology Stack

- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Zenith Editor**: WYSIWYG editor
- **Tiptap**: Headless editor framework

## Learn More

- [Zenith Editor Documentation](../../packages/zenith-editor/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tiptap Documentation](https://tiptap.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
