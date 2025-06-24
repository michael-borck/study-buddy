# GitHub Workflows Documentation

This document explains the GitHub Actions workflows configured for Study Buddy.

## Workflows Overview

### 1. Build and Test (`build.yml`)
**Triggers**: Push to `main`/`develop`, Pull Requests to `main`

**What it does**:
- Tests on Node.js 18.x and 20.x
- Runs linting and builds Next.js app
- Builds Electron apps for all platforms (macOS, Windows, Linux)
- Uploads build artifacts for 30 days

**Platforms**: 
- **macOS**: `.dmg` (Intel + Apple Silicon)
- **Windows**: `.exe` installer + portable `.exe`
- **Linux**: `.AppImage` + `.deb` package

### 2. Release (`release.yml`)
**Triggers**: Git tags matching `v*.*.*` (e.g., `v1.0.0`)

**What it does**:
- Builds production releases for all platforms
- Creates GitHub release with auto-generated release notes
- Uploads distribution files as release assets

**To create a release**:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### 3. PR Checks (`pr-check.yml`)
**Triggers**: Pull Requests to `main`

**What it does**:
- Runs comprehensive code quality checks
- ESLint, TypeScript checking, formatting
- Security audit and dependency checks
- Ensures PRs meet quality standards

## Code Signing (Optional)

For production releases, you can add code signing certificates as repository secrets:

### macOS Code Signing
```
CSC_LINK=<base64-encoded-p12-certificate>
CSC_KEY_PASSWORD=<certificate-password>
APPLE_ID=<your-apple-id>
APPLE_ID_PASS=<app-specific-password>
APPLE_TEAM_ID=<your-team-id>
```

### Windows Code Signing  
```
WIN_CSC_LINK=<base64-encoded-p12-certificate>
WIN_CSC_KEY_PASSWORD=<certificate-password>
```

## Build Outputs

### macOS
- `StudyBuddy-x.x.x.dmg` - Universal installer (Intel + Apple Silicon)
- `StudyBuddy-x.x.x-arm64.dmg` - Apple Silicon only
- `StudyBuddy-x.x.x-x64.dmg` - Intel only

### Windows
- `StudyBuddy Setup x.x.x.exe` - NSIS installer
- `StudyBuddy x.x.x.exe` - Portable executable

### Linux
- `StudyBuddy-x.x.x.AppImage` - Universal Linux app
- `study-buddy_x.x.x_amd64.deb` - Debian/Ubuntu package

## Workflow Status

Check workflow status at: `https://github.com/michael-borck/study-buddy/actions`

## Development Tips

### Local Testing
```bash
# Test Next.js build
npm run build

# Test Electron build (current platform only)
npm run dist

# Run linting
npm run lint
```

### Debugging Workflows
- Check the Actions tab for detailed logs
- Build artifacts are available for download for 30 days
- Failed builds will show detailed error messages

### Release Process
1. Ensure all tests pass on `main` branch
2. Update version in `package.json`
3. Create and push a git tag
4. GitHub will automatically build and create a release

## Security Notes

- Workflows use pinned action versions for security
- Code signing certificates should be stored as encrypted secrets
- npm audit is run on every PR to catch vulnerabilities
- Build artifacts are automatically cleaned up after 30 days