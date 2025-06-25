# Development Setup

Get Study Buddy running in development mode and contribute to the project.

## Prerequisites

### Required Software
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **npm 9+**: Included with Node.js
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Recommended Tools
- **GitHub Desktop**: For Git GUI
- **Postman**: For API testing
- **React DevTools**: Browser extension for debugging

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/michael-borck/study-buddy.git
cd study-buddy
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy example environment file
cp .example.env .env.local

# Edit with your API keys (optional for development)
nano .env.local
```

### 4. Start Development Server
```bash
# Web development
npm run dev

# Electron development (desktop app)
npm run electron-dev
```

## Development Commands

### Core Commands
```bash
npm run dev              # Next.js development server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run electron        # Run Electron in development
npm run electron-dev    # Electron with hot reload
npm run build-electron  # Build desktop applications
npm run dist            # Build and package for distribution
```

### Code Quality
```bash
npm run lint            # Check code style
npm run lint:fix        # Fix linting issues automatically
npm run type-check      # TypeScript type checking
npm run format          # Format code with Prettier
```

## Project Structure

```
study-buddy/
├── app/                     # Next.js app directory
│   ├── api/                # Backend API routes
│   ├── components/         # Shared React components
│   ├── docs/              # In-app documentation
│   ├── about/             # About page
│   ├── legal/             # Legal/licenses page
│   ├── settings/          # Settings page
│   └── page.tsx           # Homepage
├── components/             # Reusable UI components
├── utils/                  # Utility functions and helpers
├── public/                # Static assets
├── docs/                  # GitHub Pages documentation
├── build/                 # Electron build assets
├── main.js                # Electron main process
├── package.json           # Dependencies and scripts
└── README.md              # Project overview
```

## Environment Configuration

### .env.local File
```bash
# AI Providers (optional - can be set in UI)
OPENAI_API_KEY=sk-...
TOGETHER_API_KEY=...

# Search Engines (optional - can be set in UI)
BING_API_KEY=...
SERPER_API_KEY=...
SEARXNG_URL=https://searx.example.com

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
```

### Runtime Configuration
Settings can also be configured through the UI:
1. Start development server
2. Go to Settings page
3. Configure AI provider and search engine
4. Save and test configuration

## Development Workflow

### Feature Development
1. **Create Branch**: `git checkout -b feature/your-feature`
2. **Make Changes**: Implement your feature
3. **Test Locally**: Verify functionality works
4. **Commit Changes**: Use conventional commits
5. **Push Branch**: `git push origin feature/your-feature`
6. **Create PR**: Submit for review

### Debugging

#### Web Development
```bash
# Start with debugging
npm run dev

# Open browser DevTools (F12)
# Check Console tab for errors
# Use React DevTools for component inspection
```

#### Electron Development
```bash
# Start Electron with DevTools
npm run electron-dev

# In Electron app:
# Ctrl/Cmd+Shift+I to open DevTools
# Check both main and renderer process logs
```

#### API Debugging
```bash
# Test API endpoints directly
curl http://localhost:3000/api/settings

# Check server logs in terminal
# Use Postman for complex API testing
```

## Testing

### Manual Testing
```bash
# Test web version
npm run dev
# Visit http://localhost:3000

# Test Electron version
npm run electron-dev
# Desktop app should open

# Test production build
npm run build
npm run start
```

### API Testing
```bash
# Test settings endpoint
curl http://localhost:3000/api/settings

# Test chat with sample data
curl -X POST http://localhost:3000/api/getChat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

### Cross-Platform Testing
- **Windows**: Test on Windows 10/11
- **macOS**: Test on macOS 10.15+
- **Linux**: Test on Ubuntu/Debian distributions

## Building for Production

### Web Build
```bash
npm run build
npm run start
```

### Desktop Applications
```bash
# Build for all platforms (requires platform-specific tools)
npm run build-electron

# Build for specific platform
npm run build-electron -- --win
npm run build-electron -- --mac  
npm run build-electron -- --linux
```

### Distribution Packages
```bash
# Create distributable packages
npm run dist

# Outputs:
# dist/Study Buddy Setup.exe (Windows)
# dist/Study Buddy.dmg (macOS)
# dist/Study Buddy.AppImage (Linux)
```

## Contributing Guidelines

### Code Style
- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow project ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use camelCase for variables, PascalCase for components

### Commit Messages
Follow conventional commits:
```
feat: add new search engine support
fix: resolve API key validation issue
docs: update development setup guide
style: format code with prettier
refactor: improve error handling logic
test: add unit tests for settings
```

### Pull Request Process
1. **Fork Repository**: Create your own fork
2. **Create Branch**: Feature or bugfix branch
3. **Make Changes**: Implement and test changes
4. **Update Docs**: Update relevant documentation
5. **Submit PR**: With clear description and testing notes

### Code Review Criteria
- **Functionality**: Does it work as intended?
- **Performance**: Does it maintain good performance?
- **Security**: Are there any security concerns?
- **Documentation**: Is it properly documented?
- **Testing**: Has it been tested thoroughly?

## Troubleshooting Development Issues

### Common Problems

#### "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

#### Electron app won't start
```bash
# Rebuild Electron
npm run electron-rebuild

# Clear Electron cache
rm -rf ~/.cache/electron
```

#### TypeScript errors
```bash
# Check TypeScript configuration
npm run type-check

# Update TypeScript
npm update typescript
```

### Development Tips

#### Hot Reload Issues
- **Next.js**: Restart dev server if hot reload stops working
- **Electron**: Use `npm run electron-dev` for automatic restarts
- **Clear Cache**: Sometimes clearing browser cache helps

#### Performance Optimization
- **Bundle Analysis**: Use `npm run analyze` to check bundle size
- **Memory Profiling**: Use browser DevTools memory tab
- **API Response Times**: Monitor API response times in Network tab

#### Debugging Electron
- **Main Process**: Use `console.log` in main.js, check terminal
- **Renderer Process**: Use browser DevTools in Electron window
- **IPC Communication**: Debug inter-process communication carefully

## IDE Setup

### VS Code Extensions
Recommended extensions for development:
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**  
- **ESLint**
- **Prettier**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## Deployment Preparation

### Pre-deployment Checklist
- [ ] All tests pass
- [ ] Code is properly formatted and linted
- [ ] Documentation is updated
- [ ] Version number is bumped (package.json)
- [ ] Changelog is updated
- [ ] Cross-platform testing completed

### Release Process
1. **Update Version**: Bump version in package.json
2. **Update Changelog**: Document changes in CHANGELOG.md
3. **Create Tag**: `git tag v1.0.0`
4. **Push Tags**: `git push --tags`
5. **GitHub Actions**: Automatic builds will trigger
6. **Verify Release**: Test downloaded artifacts

---

*Ready to contribute? Check out our [Contributing Guide](../CONTRIBUTING.md) and [GitHub Issues](https://github.com/michael-borck/study-buddy/issues) for ways to help!*