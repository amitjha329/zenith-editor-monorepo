# 🔑 NPM Token Setup Guide

## ❌ Current Issue
Your GitHub Actions workflow is failing because the `NPM_TOKEN` secret is not properly configured. The workflow shows:
```
NODE_AUTH_TOKEN: 
```
This empty value means the secret is missing or incorrectly named.

## ✅ Solution: Set Up NPM_TOKEN Secret

### Step 1: Create NPM Automation Token

1. **Log in to npmjs.com**
   - Go to [npmjs.com](https://npmjs.com) and sign in to your account

2. **Access Token Settings**
   - Click your profile picture (top right)
   - Select **"Access Tokens"**

3. **Generate New Token**
   - Click **"Generate New Token"**
   - Select **"Classic Token"**
   - Choose **"Automation"** token type (⚠️ IMPORTANT: Must be "Automation", not "Publish")

4. **Set Permissions**
   - Ensure **"Read and write"** permissions are selected
   - This allows the token to publish packages

5. **Copy the Token**
   - Copy the generated token immediately
   - ⚠️ You won't be able to see it again!

### Step 2: Add Secret to GitHub Repository

1. **Go to Repository Settings**
   - Navigate to your GitHub repository
   - Click **"Settings"** tab (top right of repo)

2. **Access Secrets Section**
   - In left sidebar, click **"Secrets and variables"**
   - Click **"Actions"**

3. **Create New Secret**
   - Click **"New repository secret"**
   - Name: `NPM_TOKEN` (exactly this name)
   - Value: Paste your npm token from Step 1
   - Click **"Add secret"**

### Step 3: Verify Setup

1. **Check Secret Exists**
   - You should see `NPM_TOKEN` listed in your repository secrets
   - The value will show as `***` (hidden for security)

2. **Test the Workflow**
   - Push a new tag: `git tag v1.2.1 && git push --tags`
   - Or trigger manually from GitHub Actions tab
   - The workflow should now authenticate successfully

## 🔧 Troubleshooting

### Token Type Issues
- ❌ **"Publish" tokens** - Don't work with GitHub Actions
- ❌ **"Read-only" tokens** - Can't publish packages
- ✅ **"Automation" tokens** - Required for CI/CD

### Common Mistakes
- Wrong secret name (must be exactly `NPM_TOKEN`)
- Expired token
- Token without write permissions
- Token from wrong npm account

### Verify Token Locally (Optional)
```bash
# Test your token works
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN_HERE
npm whoami
# Should show your npm username
```

## 📋 Quick Checklist

- [ ] Created "Automation" token on npmjs.com
- [ ] Token has "Read and write" permissions  
- [ ] Added secret named `NPM_TOKEN` to GitHub repo
- [ ] Pasted the complete token value
- [ ] Tested workflow runs without authentication errors

Once completed, your workflow will successfully authenticate and publish to npm! 🎉
