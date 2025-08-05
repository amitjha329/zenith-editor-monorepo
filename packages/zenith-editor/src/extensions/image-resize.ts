import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ImageResize } from '../components/ImageResize';

export interface ImageResizeOptions {
  HTMLAttributes: Record<string, any>;
  allowBase64: boolean;
  inline: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      /**
       * Add an image with resizing capabilities
       */
      setImageResize: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: number;
        height?: number;
      }) => ReturnType;
    };
  }
}

export const ImageResizeExtension = Node.create<ImageResizeOptions>({
  name: 'imageResize',

  addOptions() {
    return {
      HTMLAttributes: {},
      allowBase64: true,
      inline: false,
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('width'),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute('height'),
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `img[src]:not([src^="data:"]):not([src*="base64"])`,
      },
      {
        tag: `img[src^="data:"]`,
        getAttrs: () => (this.options.allowBase64 ? {} : false),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setImageResize:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageResize);
  },

  addInputRules() {
    return [
      // Auto-detect image URLs and convert them
      {
        find: /!\[([^\]]*)\]\(([^)]*)\)/g,
        handler: ({ state, range, match }) => {
          const [, alt, src] = match;
          const { tr } = state;
          const start = range.from;
          const end = range.to;

          tr.replaceWith(
            start,
            end,
            this.type.create({
              src,
              alt: alt || null,
            })
          );
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    return [
      // Plugin to handle drag and drop of images
      new Plugin({
        key: new PluginKey('imageResize'),
        props: {
          handleDrop(view, event, slice, moved) {
            if (moved || !event.dataTransfer) return false;

            const files = Array.from(event.dataTransfer.files);
            const imageFiles = files.filter((file) =>
              file.type.startsWith('image/')
            );

            if (imageFiles.length === 0) return false;

            const pos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            if (!pos) return false;

            event.preventDefault();

            imageFiles.forEach(async (file) => {
              const reader = new FileReader();
              reader.onload = () => {
                const src = reader.result as string;
                const node = view.state.schema.nodes.imageResize.create({
                  src,
                  alt: file.name,
                });

                const transaction = view.state.tr.insert(pos.pos, node);
                view.dispatch(transaction);
              };
              reader.readAsDataURL(file);
            });

            return true;
          },
          handlePaste(view, event, _slice) {
            const items = Array.from(event.clipboardData?.items || []);
            const imageItems = items.filter((item) =>
              item.type.startsWith('image/')
            );

            if (imageItems.length === 0) return false;

            event.preventDefault();

            imageItems.forEach((item) => {
              const file = item.getAsFile();
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                const src = reader.result as string;
                const node = view.state.schema.nodes.imageResize.create({
                  src,
                  alt: file.name,
                });

                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              };
              reader.readAsDataURL(file);
            });

            return true;
          },
        },
      }),
    ];
  },
});

export default ImageResizeExtension;
