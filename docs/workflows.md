# 🔄 GitHub Actions Workflows

This repository includes several automated workflows to ensure code quality, automated testing, and seamless publishing to npm.

## 📋 Available Workflows

### 1. 🧪 CI/CD Pipeline (`ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**

- **Tests**: Runs the test suite on Node.js 18 & 20
- **Linting**: Checks code style with ESLint
- **Formatting**: Validates Prettier formatting
- **Type Checking**: Validates TypeScript types
- **Build Check**: Ensures package builds successfully
- **Security Audit**: Runs `pnpm audit` for vulnerabilities

### 2. 📦 Publish to NPM (`publish.yml`)

**Triggers:**

- When a tag starting with `v` is pushed (e.g., `v1.0.0`)
- Manual workflow dispatch with version selection

**What it does:**

- Builds and tests the package
- Publishes to npm with the specified version
- Creates a GitHub release with changelog
- Tags the repository

**Manual Usage:**

```bash
# Trigger manually from GitHub Actions tab
# Select version type: patch, minor, major, or prerelease
```

### 3. 🏷️ Release (`release.yml`)

**Triggers:**

- Manual workflow dispatch only

**What it does:**

- Bumps version in package.json
- Creates git tag
- Generates changelog
- Creates GitHub release
- Triggers npm publish workflow

**Usage:**

1. Go to "Actions" tab in GitHub
2. Select "🏷️ Release" workflow
3. Click "Run workflow"
4. Choose release type (patch/minor/major/prerelease)

### 4. 🔄 Update Dependencies (`update-deps.yml`)

**Triggers:**

- Scheduled: Every Monday at 9 AM UTC
- Manual workflow dispatch

**What it does:**

- Updates all dependencies to latest versions
- Runs tests to ensure compatibility
- Creates a pull request with changes

## 🔑 Required Secrets

To use these workflows, you'll need to set up the following secrets in your GitHub repository:

### NPM_TOKEN

1. Go to [npmjs.com](https://www.npmjs.com)
2. Log in to your account
3. Go to "Access Tokens" in your profile settings
4. Create a new "Automation" token
5. Copy the token
6. In your GitHub repo, go to Settings → Secrets and variables → Actions
7. Create a new secret named `NPM_TOKEN` with your token value

### GITHUB_TOKEN (Automatic)

This is automatically provided by GitHub Actions - no setup required.

## 🚀 Publishing Workflow

### Automated Publishing (Recommended)

1. **Create a release:**

   ```bash
   # Method 1: Use GitHub Actions
   # Go to Actions → Release → Run workflow → Select version type

   # Method 2: Create tag manually
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **The workflow will:**
   - Run all tests
   - Build the package
   - Publish to npm
   - Create GitHub release

### Manual Publishing

```bash
# 1. Update version
cd packages/zenith-editor
pnpm version patch  # or minor, major

# 2. Build and test
pnpm build
pnpm test

# 3. Publish
pnpm publish

# 4. Create git tag
git add .
git commit -m "chore: bump version to vX.X.X"
git tag vX.X.X
git push origin main --tags
```

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build package
pnpm build:package

# Run tests
pnpm test

# Run linting
pnpm lint

# Type check
pnpm type-check

# Build demo
pnpm demo

# Pre-release check (runs all checks)
pnpm prerelease
```

## 📦 Package Information

- **Package Name**: `zenith-editor`
- **Registry**: [npmjs.com/package/zenith-editor](https://www.npmjs.com/package/zenith-editor)
- **Repository**: [GitHub](https://github.com/amitjha329/zenith-editor-monorepo)

## 🐛 Troubleshooting

### Workflow fails with "NPM_TOKEN not found"

- Ensure you've added the NPM_TOKEN secret to your repository
- Verify the token has "Automation" permissions
- Check that the token hasn't expired

### Build fails in CI

- Run `pnpm build:package` locally to test
- Check for TypeScript errors with `pnpm type-check`
- Ensure all tests pass with `pnpm test`

### Version conflicts

- Make sure version in `packages/zenith-editor/package.json` matches git tags
- Use semantic versioning (e.g., 1.0.0, 1.1.0, 2.0.0)

## 📝 Notes

- All workflows use pnpm for faster, more reliable builds
- Tests must pass before any release
- TypeScript checks are enforced
- Security audits are run automatically
- Dependencies are updated weekly via automated PRs
