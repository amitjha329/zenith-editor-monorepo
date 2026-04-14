#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGE_DIR = path.join(ROOT_DIR, 'packages', 'zenith-editor');
const ROOT_PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');
const PACKAGE_JSON_PATH = path.join(PACKAGE_DIR, 'package.json');
const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
const RELEASE_TYPES = new Set(['patch', 'minor', 'major', 'prerelease']);

main();

function main() {
  try {
    const options = parseArguments(process.argv.slice(2));

    if (options.help) {
      printHelp();
      return;
    }

    const rootPackageJson = readJson(ROOT_PACKAGE_JSON_PATH);
    const packageJson = readJson(PACKAGE_JSON_PATH);
    const currentVersion = packageJson.version;
    const nextVersion = options.targetVersion || bumpVersion(currentVersion, options.releaseType, options.preid);
    const distTag = options.tag || inferDistTag(nextVersion);

    if (!options.dryRun && !options.allowDirty) {
      ensureCleanGitTree();
    }

    console.log(`Package: ${packageJson.name}`);
    console.log(`Current package version: ${currentVersion}`);

    if (rootPackageJson.version !== currentVersion) {
      console.log(`Current root version: ${rootPackageJson.version}`);
    }

    console.log(`Next version: ${nextVersion}`);
    console.log(`npm dist-tag: ${distTag}`);

    if (options.dryRun) {
      console.log('Dry run complete. No files were changed and nothing was published.');
      return;
    }

    const originalRootPackageJson = JSON.stringify(rootPackageJson, null, 2) + '\n';
    const originalPackageJson = JSON.stringify(packageJson, null, 2) + '\n';

    rootPackageJson.version = nextVersion;
    packageJson.version = nextVersion;

    writeJson(ROOT_PACKAGE_JSON_PATH, rootPackageJson);
    writeJson(PACKAGE_JSON_PATH, packageJson);

    const cleanupNpmrc = configureRegistryAuth(PACKAGE_DIR);

    try {
      if (!options.skipChecks) {
        runCommand('pnpm', ['prerelease'], ROOT_DIR);
      }

      verifyNpmAuth();

      const publishArgs = ['publish', '--access', 'public'];

      if (distTag !== 'latest') {
        publishArgs.push('--tag', distTag);
      }

      if (options.otp) {
        publishArgs.push('--otp', options.otp);
      }

      runCommand('npm', publishArgs, PACKAGE_DIR);
    } catch (error) {
      fs.writeFileSync(ROOT_PACKAGE_JSON_PATH, originalRootPackageJson, 'utf8');
      fs.writeFileSync(PACKAGE_JSON_PATH, originalPackageJson, 'utf8');
      cleanupNpmrc();
      throw error;
    }

    cleanupNpmrc();

    console.log(`Successfully published ${packageJson.name}@${nextVersion}.`);
    console.log(`Commit the version bump and create tag v${nextVersion} if you want the repository state to match the published package.`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

function parseArguments(args) {
  const options = {
    allowDirty: false,
    dryRun: false,
    help: false,
    otp: undefined,
    preid: 'alpha',
    releaseType: undefined,
    skipChecks: false,
    tag: undefined,
    targetVersion: undefined,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--help' || argument === '-h') {
      options.help = true;
      continue;
    }

    if (argument === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (argument === '--skip-checks') {
      options.skipChecks = true;
      continue;
    }

    if (argument === '--allow-dirty') {
      options.allowDirty = true;
      continue;
    }

    if (argument === '--preid') {
      options.preid = readOptionValue(args, index, '--preid');
      index += 1;
      continue;
    }

    if (argument.startsWith('--preid=')) {
      options.preid = argument.split('=')[1];
      continue;
    }

    if (argument === '--tag') {
      options.tag = readOptionValue(args, index, '--tag');
      index += 1;
      continue;
    }

    if (argument.startsWith('--tag=')) {
      options.tag = argument.split('=')[1];
      continue;
    }

    if (argument === '--otp') {
      options.otp = readOptionValue(args, index, '--otp');
      index += 1;
      continue;
    }

    if (argument.startsWith('--otp=')) {
      options.otp = argument.split('=')[1];
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown option: ${argument}`);
    }

    if (options.releaseType || options.targetVersion) {
      throw new Error('Provide only one release target. Use a release type or an explicit version.');
    }

    if (RELEASE_TYPES.has(argument)) {
      options.releaseType = argument;
      continue;
    }

    if (VERSION_PATTERN.test(argument)) {
      options.targetVersion = argument;
      continue;
    }

    throw new Error(`Invalid release target: ${argument}`);
  }

  if (!options.help && !options.releaseType && !options.targetVersion) {
    throw new Error('Missing release target. Use patch, minor, major, prerelease, or an explicit version.');
  }

  return options;
}

function readOptionValue(args, index, optionName) {
  const value = args[index + 1];

  if (!value) {
    throw new Error(`Missing value for ${optionName}`);
  }

  return value;
}

function parseVersion(version) {
  const match = VERSION_PATTERN.exec(version);

  if (!match) {
    throw new Error(`Invalid semver version: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] || null,
  };
}

function bumpVersion(currentVersion, releaseType, preid) {
  const parsedVersion = parseVersion(currentVersion);
  const baseVersion = `${parsedVersion.major}.${parsedVersion.minor}.${parsedVersion.patch}`;

  switch (releaseType) {
    case 'major':
      return `${parsedVersion.major + 1}.0.0`;
    case 'minor':
      return `${parsedVersion.major}.${parsedVersion.minor + 1}.0`;
    case 'patch':
      if (parsedVersion.prerelease) {
        return baseVersion;
      }

      return `${parsedVersion.major}.${parsedVersion.minor}.${parsedVersion.patch + 1}`;
    case 'prerelease':
      if (!parsedVersion.prerelease) {
        return `${parsedVersion.major}.${parsedVersion.minor}.${parsedVersion.patch + 1}-${preid}.1`;
      }

      return incrementPrerelease(baseVersion, parsedVersion.prerelease, preid);
    default:
      throw new Error(`Unsupported release type: ${releaseType}`);
  }
}

function incrementPrerelease(baseVersion, prerelease, preid) {
  const [currentPreid, currentNumber] = prerelease.split('.');

  if (currentPreid === preid && /^\d+$/.test(currentNumber || '')) {
    return `${baseVersion}-${preid}.${Number(currentNumber) + 1}`;
  }

  return `${baseVersion}-${preid}.1`;
}

function inferDistTag(version) {
  const parsedVersion = parseVersion(version);

  if (!parsedVersion.prerelease) {
    return 'latest';
  }

  return parsedVersion.prerelease.split('.')[0] || 'next';
}

function ensureCleanGitTree() {
  const output = execFileSync('git', ['status', '--porcelain'], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
  }).trim();

  if (output) {
    throw new Error('Git working tree is not clean. Commit or stash changes first, or rerun with --allow-dirty.');
  }
}

function verifyNpmAuth() {
  try {
    runCommand('npm', ['whoami'], ROOT_DIR);
  } catch (_error) {
    throw new Error('npm authentication failed. Run npm login or set NODE_AUTH_TOKEN/NPM_TOKEN before publishing.');
  }
}

function configureRegistryAuth(targetDirectory) {
  const authToken = process.env.NODE_AUTH_TOKEN || process.env.NPM_TOKEN;

  if (!authToken) {
    return () => {};
  }

  const npmrcPath = path.join(targetDirectory, '.npmrc');
  const hadExistingFile = fs.existsSync(npmrcPath);
  const previousContents = hadExistingFile ? fs.readFileSync(npmrcPath, 'utf8') : null;

  fs.writeFileSync(npmrcPath, `//registry.npmjs.org/:_authToken=${authToken}\n`, 'utf8');

  return () => {
    if (hadExistingFile) {
      fs.writeFileSync(npmrcPath, previousContents, 'utf8');
      return;
    }

    if (fs.existsSync(npmrcPath)) {
      fs.unlinkSync(npmrcPath);
    }
  };
}

function runCommand(command, args, cwd) {
  const executable = process.platform === 'win32' ? `${command}.cmd` : command;
  const result = spawnSync(executable, args, {
    cwd,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status || 1}.`);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function printHelp() {
  console.log(`Usage: pnpm publish:npm <patch|minor|major|prerelease|x.y.z> [options]

Options:
  --dry-run       Resolve the next version and tag without changing files
  --skip-checks   Skip the pnpm prerelease checks before publishing
  --allow-dirty   Allow publishing when the git working tree has local changes
  --preid <id>    Prerelease identifier to use with prerelease bumps (default: alpha)
  --tag <tag>     Override the npm dist-tag (default: latest or prerelease identifier)
  --otp <code>    Pass an npm one-time password for 2FA-protected publishes
  --help          Show this message
`);
}