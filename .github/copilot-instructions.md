# Zenith Editor — Quick Reference

Zenith Editor is a Tiptap-based WYSIWYG editor published as `zenith-editor` on npm, structured as a **pnpm workspaces** monorepo.

> Detailed architecture, exports, module status, and patterns are in `.github/instructions/monorepo-architecture.instructions.md` — loaded automatically when editing code files.

## Essential Rules

- **pnpm only** — never use npm or yarn
- **Build before demo**: `pnpm build:package` before testing in `apps/demo/`
- **SSR**: Always dynamic-import with `ssr: false` in Next.js consumers
- **Package → demo**: one-way dependency. Core package must never import from `apps/demo/`
- **Public API**: All exports go through `packages/zenith-editor/src/index.ts`
- **CSS**: Consumers must `import 'zenith-editor/styles'` separately

## Common Commands
```bash
pnpm build:package  # Build core package
pnpm test:core      # Tests for CI (excludes fontLoader)
pnpm demo           # Start Next.js demo on :3000
```
