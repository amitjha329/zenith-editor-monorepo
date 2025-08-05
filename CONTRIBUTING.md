# Contributing to Zenith Editor

Thank you for your interest in contributing to Zenith Editor! We welcome contributions from the community and are grateful for any help you can provide.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+ (recommended package manager)
- Git

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/zenith-editor.git
   cd zenith-editor
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Build the Package**

   ```bash
   pnpm build:package
   ```

4. **Run the Demo**

   ```bash
   pnpm demo
   ```

5. **Run Tests**
   ```bash
   pnpm test
   ```

## 📋 Development Workflow

### Making Changes

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Edit code in the `packages/zenith-editor/src/` directory
   - Add tests for new features in `__tests__` directories
   - Update documentation as needed

3. **Test Your Changes**

   ```bash
   # Run tests
   pnpm test

   # Test in the demo app
   pnpm demo

   # Build and check for errors
   pnpm build:package
   ```

4. **Lint and Format**
   ```bash
   pnpm lint:fix
   ```

### Project Structure

```
packages/zenith-editor/
├── src/
│   ├── components/          # React components
│   │   ├── Editor.tsx      # Main editor component
│   │   ├── Toolbar.tsx     # Toolbar component
│   │   └── __tests__/      # Component tests
│   ├── hooks/              # Custom React hooks
│   │   └── useZenithEditor.ts
│   ├── extensions/         # Tiptap extensions
│   │   └── index.ts
│   ├── styles/            # CSS styles
│   │   └── editor.css
│   └── index.ts           # Main export file
├── package.json
└── README.md
```

## 🧪 Testing

We use Jest and React Testing Library for testing. Please ensure:

- **Unit Tests**: Write unit tests for new functions and hooks
- **Component Tests**: Test React components with user interactions
- **Integration Tests**: Test component integration where applicable

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### Writing Tests

Example test structure:

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const handleClick = jest.fn();
    render(<YourComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📝 Code Style

We use ESLint and Prettier for code formatting:

- **ESLint**: Linting rules for code quality
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking

### Guidelines

1. **TypeScript**: All code must be properly typed
2. **JSDoc**: Document public APIs with JSDoc comments
3. **Component Props**: Use TypeScript interfaces for props
4. **Hooks**: Follow React Hook naming conventions
5. **CSS**: Use Tailwind CSS classes where possible

### Example Code Style

```tsx
/**
 * Props for the CustomComponent
 */
interface CustomComponentProps {
  /** The title to display */
  title: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Callback fired when clicked */
  onClick?: () => void;
}

/**
 * A custom component that demonstrates our coding standards
 *
 * @param props - The component props
 * @returns JSX element
 */
export function CustomComponent({
  title,
  disabled = false,
  onClick,
}: CustomComponentProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {title}
    </button>
  );
}
```

## 📖 Documentation

When adding features, please update:

1. **README.md**: Main package documentation
2. **JSDoc Comments**: Inline code documentation
3. **Type Definitions**: Export types for public APIs
4. **Demo App**: Add examples to the demo application

## 🚀 Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Add JSDoc comments for new APIs
   - Update type definitions

2. **Add Tests**
   - Write tests for new features
   - Ensure existing tests pass
   - Maintain or improve test coverage

3. **Create Pull Request**

   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   git push origin feature/your-feature-name
   ```

4. **PR Description**
   - Describe what changed and why
   - Include screenshots for UI changes
   - Link related issues
   - Add breaking change notes if applicable

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build process or auxiliary tool changes

Examples:

```
feat: add image drag and drop support
fix: resolve toolbar positioning issue
docs: update API reference
test: add toolbar component tests
```

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Clear Description**: What happened vs. what you expected
2. **Reproduction Steps**: Minimal steps to reproduce the issue
3. **Environment**: Browser, OS, Node.js version
4. **Code Example**: Minimal code that reproduces the problem
5. **Screenshots**: If applicable

### Feature Requests

When requesting features:

1. **Use Case**: Describe the problem you're trying to solve
2. **Proposed Solution**: How you think it should work
3. **Alternatives**: Other solutions you've considered
4. **Examples**: Reference implementations or similar features

## 🏷️ Release Process

1. **Version Bump**: Update version in `package.json`
2. **Changelog**: Update `CHANGELOG.md` with changes
3. **Tag Release**: Create Git tag with version
4. **Publish**: Publish to npm registry
5. **GitHub Release**: Create GitHub release with notes

## 🤝 Community

- **Discussions**: Use GitHub Discussions for questions and ideas
- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discord**: Join our Discord community for real-time chat

## 📋 Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## ❓ Questions?

If you have questions that aren't covered here:

1. Check existing [GitHub Discussions](https://github.com/zenith-editor/zenith-editor/discussions)
2. Search [GitHub Issues](https://github.com/zenith-editor/zenith-editor/issues)
3. Create a new discussion or issue

Thank you for contributing to Zenith Editor! 🙏
