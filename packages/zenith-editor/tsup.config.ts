import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react', 
    'react-dom',
    'highlight.js/lib/languages/javascript',
    'highlight.js/lib/languages/typescript',
    'highlight.js/lib/languages/css',
    'highlight.js/lib/languages/xml',
    'highlight.js/lib/languages/python',
    'highlight.js/lib/languages/json'
  ],
  esbuildOptions(options: any) {
    options.banner = {
      js: '"use client";',
    };
  },
});
