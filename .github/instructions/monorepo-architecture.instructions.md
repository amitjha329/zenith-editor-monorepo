---
description: "Use when editing, reviewing, or scaffolding code in this TypeScript monorepo. Covers workspace boundaries, package exports, build pipeline, dependency flow, and implementation status of all modules. Use when: monorepo structure, package boundaries, cross-package imports, tsconfig paths, build order, feature status, extension system, font loading."
applyTo: "**/*.{ts,tsx,js,jsx,json,css}"
---

# Zenith Editor — Monorepo Architecture & Workspace Boundaries

## Project Overview

Zenith Editor is a production-ready WYSIWYG editor built on **Tiptap**, packaged as a monorepo using **pnpm workspaces**. The core package (`packages/zenith-editor`) is published to npm, while `apps/demo` demonstrates usage in Next.js App Router.

**Key Architecture:**
- **Component-Hook Pattern**: `<ZenithEditor>` wraps `useZenithEditor()` hook which wraps Tiptap's `useEditor()`. All editor logic lives in the hook, components handle presentation.
- **Font Loading System**: Custom `FontLoader` class (singleton) + `useFontLoader()` hook manages FontFace Web API integration for custom fonts. This is a core feature differentiator.
- **Extension System**: Tiptap extensions are configured in `src/extensions/index.ts`. Custom extensions (like `image-resize.ts`) extend base Tiptap extensions.

## Monorepo Strategy

- **Tool**: pnpm workspaces (no Turborepo/Nx). Defined in `pnpm-workspace.yaml` as `packages/*` and `apps/*`.
- **Node**: >=18.0.0 | **pnpm**: >=8.0.0 | **TypeScript**: 5.5.4 (root), 5.3.3 (package)
- **Never use npm or yarn.** Lockfile is `pnpm-lock.yaml`.

### Build & Test Commands
```bash
# Root commands (always prefer these over cd-ing into packages)
pnpm build          # Build all packages
pnpm build:package  # Build only the zenith-editor package
pnpm test           # Run all tests
pnpm test:core      # Run tests excluding fontLoader (used in CI)
pnpm demo           # Start demo app on localhost:3000

# Package-specific (from packages/zenith-editor/)
pnpm dev            # Watch mode for development
pnpm test:coverage  # Generate coverage report
```

**Important**: Always run `pnpm build:package` before testing integration with demo app. The demo imports from the built package, not source.

### Publishing Workflow
- Publishing is automated via GitHub Actions on tag push (`v*`)
- Pre-publish checks: `lint`, `type-check`, `test:core`, `build`
- Manual: `cd packages/zenith-editor && pnpm prepublishOnly && pnpm publish`

## Workspace Boundaries — CRITICAL

### Two isolated workspaces:

| Workspace | Path | Purpose | Private |
|-----------|------|---------|---------|
| `zenith-editor` | `packages/zenith-editor/` | Published npm package (core editor) | No |
| `zenith-editor-demo` | `apps/demo/` | Next.js App Router demo | Yes |

### Import rules:
- **`apps/demo/` → `packages/zenith-editor/`**: Via `workspace:*` dependency. Demo imports from the *built* package (`dist/`), not source. Always run `pnpm build:package` before testing integration.
- **`packages/zenith-editor/` → `apps/demo/`**: NEVER. The core package must not reference the demo app.
- **Cross-package type sharing**: All shared types are exported from `packages/zenith-editor/src/index.ts`. Do not create ambient `.d.ts` files or manual type paths between workspaces.

### tsconfig path aliases:
```
Root tsconfig.json:
  "zenith-editor" → "./packages/zenith-editor/src"   (monorepo dev resolution)
  "@/*"           → "./src/*"                          (demo app internal)
```
The root alias lets the IDE resolve `zenith-editor` to source during development, but the demo's runtime always uses the built `dist/` artifacts.

## Package Exports (packages/zenith-editor)

### package.json "exports" field:
```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.mjs",
    "require": "./dist/index.js"
  },
  "./styles": "./dist/styles/editor.css"
}
```
- Dual format: CommonJS (`index.js`) + ESM (`index.mjs`)
- CSS must be imported separately: `import 'zenith-editor/styles'`
- `sideEffects: ["*.css"]` ensures CSS survives tree-shaking

### Public API Surface (`src/index.ts`):

**Components:**
- `ZenithEditor` (default + named export), `Toolbar`, `FontSelector`, `ColorPicker`

**Hooks:**
- `useZenithEditor` — main editor factory hook
- `useFontLoader` — generic font lifecycle manager
- `useEditorFonts` — editor-specific font variant

**Extensions:**
- `defaultExtensions` — array of 20+ configured Tiptap extensions
- `PlaceholderExtension` — custom placeholder via data-attribute
- `lowlight` — syntax highlighting instance

**Font Utilities:**
- `FontLoader` (singleton class), `loadCustomFont`, `loadCustomFonts`, `isCustomFontSupported`

**Exported Types:**
- Props: `ZenithEditorProps`, `ToolbarProps`, `FontSelectorProps`, `ColorPickerProps`
- Ref: `ZenithEditorRef`
- Options: `ZenithEditorOptions`
- Font: `CustomFontDefinition`, `FontLoadOptions`, `FontLoadResult`, `FontLoadStatus`, `FontLoadingState`, `UseFontLoaderOptions`, `UseFontLoaderReturn`

> When adding new public APIs, always export from `src/index.ts` with proper TypeScript types.

## Build Pipeline (tsup)

```
src/index.ts → tsup → dist/index.js (CJS) + dist/index.mjs (ESM) + dist/index.d.ts
                     → dist/styles/editor.css
```

- **Entry**: Single entry point (`src/index.ts`)
- **Banner**: Injects `"use client"` for Next.js RSC compatibility
- **External**: `react`, `react-dom`, `highlight.js` language modules
- **Source maps + declaration maps** enabled for debugging

## Code Conventions & Patterns

### Next.js SSR Compatibility
**Critical**: Editor must be dynamically imported with `ssr: false` in Next.js:
```tsx
const ZenithEditor = dynamic(
  () => import('zenith-editor').then((mod) => mod.ZenithEditor),
  { ssr: false, loading: () => <LoadingSkeleton /> }
);
```
The package uses `immediatelyRender: false` in Tiptap config to prevent hydration mismatches. All components have `"use client"` banner (added by tsup).

### TypeScript Patterns
- **Strict mode enabled**: All props must be typed, no implicit `any`
- **Ref forwarding**: `ZenithEditor` uses `forwardRef<ZenithEditorRef>` for imperative access
- **Hook return objects**: All hooks return objects (not tuples) for better discoverability

### Component Architecture
```
components/
  Editor.tsx        # Main wrapper, handles ref forwarding
  Toolbar.tsx       # Floating toolbar with format buttons
  FontSelector.tsx  # Dropdown for font selection
  ColorPicker.tsx   # Color picker for text/background
  ImageResize.tsx   # Resizable image with 8 drag handles
```
Components are "dumb" — they receive `editor` instance and call `editor.chain()` commands. No business logic in components.

### Image Upload Handler
`onImageUpload` prop is **required** for image functionality. Editor doesn't include upload logic — consumers provide their own:
```tsx
<ZenithEditor
  onImageUpload={async (file) => {
    // Upload to your CDN/server
    return imageUrl;
  }}
/>
```

## Dependency Flow

```
Consumer (e.g., apps/demo)
  └─ import { ZenithEditor } from 'zenith-editor'
     └─ Editor.tsx (forwardRef wrapper)
        └─ useZenithEditor() hook
           ├─ Tiptap useEditor() with defaultExtensions + PlaceholderExtension + custom
           ├─ useFontLoader() for custom font lifecycle
           └─ Image drop/paste handling
  └─ import 'zenith-editor/styles'
     └─ editor.css (Tailwind @apply + custom selectors + syntax highlighting)
```

### Font Loading System
Two entry points:
1. **Utility class**: `FontLoader.getInstance().loadFont(fontDef)` for manual loading
2. **React hook**: `useFontLoader(fonts, options)` for declarative loading in components

Font definitions use `CustomFontDefinition` interface with auto-format detection from file extension.

## Module Implementation Status

### PRODUCTION-READY (complete, typed, tested):

| Module | Path | Notes |
|--------|------|-------|
| `Editor.tsx` | `src/components/Editor.tsx` | forwardRef + useImperativeHandle, full ref API |
| `Toolbar.tsx` | `src/components/Toolbar.tsx` | 12+ buttons, link dialog, image upload, undo/redo |
| `FontSelector.tsx` | `src/components/FontSelector.tsx` | 11 system fonts + custom, editor event sync |
| `ColorPicker.tsx` | `src/components/ColorPicker.tsx` | 12 preset colors, custom input, remove option |
| `ImageResize.tsx` | `src/components/ImageResize.tsx` | 8 resize handles, aspect ratio, keyboard shortcuts |
| `useZenithEditor` | `src/hooks/useZenithEditor.ts` | Full editor factory with font integration |
| `useFontLoader` | `src/hooks/useFontLoader.ts` | Font lifecycle: load/unload/track/CSS generation |
| `FontLoader` | `src/utils/fontLoader.ts` | Singleton, FontFace API, timeout, dedup |
| `defaultExtensions` | `src/extensions/index.ts` | 20+ configured Tiptap extensions |
| `ImageResizeExtension` | `src/extensions/image-resize.ts` | Custom Node with ReactNodeViewRenderer |
| `editor.css` | `src/styles/editor.css` | Tailwind + hljs syntax themes + dark mode + responsive |

### MINOR GAPS (non-blocking):

| Item | Location | Detail |
|------|----------|--------|
| `useEditorFonts` hook | `src/hooks/useFontLoader.ts` | Interface defined, implementation may be incomplete |
| `console.log` in Toolbar | `src/components/Toolbar.tsx` | Debug logging in font/color callbacks — not stubs, just verbose |
| Demo image upload | `apps/demo/app/page.tsx` | Uses base64 data URL (intentionally mock for demo) |

### ZERO TODO comments found across entire codebase.

## Extension System Architecture

Extensions are composed in `useZenithEditor`:
```
[...defaultExtensions, PlaceholderExtension, ...userCustomExtensions]
```

The `defaultExtensions` array (20+ extensions) covers:
- **Structure**: Document, Paragraph, Text, Heading (1-3), Lists, HardBreak
- **Formatting**: Bold, Italic, Underline, Strike, TextStyle, FontFamily, Color
- **Content**: Link (noopener), ImageResize (base64-capable), Blockquote, CodeBlockLowlight
- **UX**: History (100 depth), Gapcursor, Dropcursor

All extensions use `HTMLAttributes` with `zenith-*` CSS class prefixes for scoped styling.

To add a new extension:
1. Add to `defaultExtensions` in `src/extensions/index.ts`
2. Add toolbar button in `Toolbar.tsx` with `editor.chain().command().run()`
3. Add CSS class in `src/styles/editor.css` using `zenith-*` prefix
4. Export any new types from `src/index.ts`

## Testing Conventions

- **Framework**: Jest 29 + React Testing Library + ts-jest
- **Environment**: jsdom (mocked FontFace, mocked Tiptap editor)
- **Test location**: `__tests__/` directories adjacent to source
- **CI command**: `pnpm test:core` (excludes `fontLoader.test.ts` — JSDOM lacks FontFace API)
- **Coverage thresholds**: Intentionally low (2-5%) — tests target critical paths only
- **Pattern**: Mock the Tiptap `editor` with chained method stubs (`chain().focus().setBold().run()`)

## CSS & Styling Rules

- All editor CSS classes use `zenith-*` prefix (e.g., `zenith-paragraph`, `zenith-bold`)
- Styles use Tailwind `@apply` directives — not inline styles
- Dark mode via `@media (prefers-color-scheme: dark)`
- Responsive breakpoint at 640px
- Syntax highlighting via `hljs-*` classes (highlight.js tokens)
- Consumers must import CSS: `import 'zenith-editor/styles'`

## Peer Dependencies

The core package expects consumers to provide:
- `react` >= 18.0.0
- `react-dom` >= 18.0.0

Do not add React as a direct dependency to `packages/zenith-editor/package.json`.

## Key Files Reference

| Purpose | Path |
|---------|------|
| Main hook (all editor options) | `packages/zenith-editor/src/hooks/useZenithEditor.ts` |
| FontFace API wrapper (singleton) | `packages/zenith-editor/src/utils/fontLoader.ts` |
| Main component (ref forwarding) | `packages/zenith-editor/src/components/Editor.tsx` |
| Build config ("use client" banner) | `packages/zenith-editor/tsup.config.ts` |
| Public API surface (all exports) | `packages/zenith-editor/src/index.ts` |
| pnpm workspace definition | `pnpm-workspace.yaml` |
