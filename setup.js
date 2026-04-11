#!/usr/bin/env node

/**
 * Installation and setup script for Zenith Editor
 * This script helps users get started with the Zenith Editor monorepo
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Zenith Editor...\n');

// Check if pnpm is installed
try {
  execSync('pnpm --version', { stdio: 'ignore' });
  console.log('✅ pnpm is installed');
} catch (error) {
  console.log('❌ pnpm is not installed. Please install pnpm first:');
  console.log('   npm install -g pnpm');
  console.log('   or visit: https://pnpm.io/installation');
  process.exit(1);
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);

if (majorVersion < 18) {
  console.log(
    `❌ Node.js ${nodeVersion} is not supported. Please upgrade to Node.js 18 or later.`
  );
  process.exit(1);
}

console.log(`✅ Node.js ${nodeVersion} is supported`);

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('pnpm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.log('❌ Failed to install dependencies');
  process.exit(1);
}

// Build the package
console.log('\n🔨 Building the Zenith Editor package...');
try {
  execSync('pnpm build:package', { stdio: 'inherit' });
  console.log('✅ Package built successfully');
} catch (error) {
  console.log('❌ Failed to build package');
  process.exit(1);
}

// Run tests
console.log('\n🧪 Running tests...');
try {
  execSync('pnpm test', { stdio: 'inherit' });
  console.log('✅ All tests passed');
} catch (error) {
  console.log('⚠️  Some tests failed, but installation is complete');
}

console.log('\n🎉 Setup complete! You can now:');
console.log('   • Run the demo: pnpm demo');
console.log('   • Build the package: pnpm build:package');
console.log('   • Run tests: pnpm test');
console.log('   • Start developing: pnpm dev');
console.log('\n📖 Check out the README.md for more information!');
