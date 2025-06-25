# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- (Optional) [Ollama](https://ollama.com/) for local AI

### Quick Start

```bash
# Clone and install
git clone https://github.com/michael-borck/study-buddy.git
cd study-buddy
npm install

# Development with hot reload
npm run electron-dev

# Or run components separately
npm run dev        # Next.js only
npm run electron   # Electron only (after Next.js is running)
```

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run electron` | Launch Electron app (needs Next.js running) |
| `npm run electron-dev` | **Recommended**: Start both Next.js and Electron with hot reload |
| `npm run build` | Build Next.js for production |
| `npm run dist` | Build Electron distributables |
| `npm run lint` | Run ESLint |

## Linux Development Notes

### Sandbox Issues
If you encounter sandbox errors on Linux:
```
FATAL:sandbox/linux/suid/client/setuid_sandbox_host.cc:163
```

This is already handled in our scripts with `--no-sandbox` flags. If you see this error, ensure you're using:
- `npm run electron-dev` (recommended)
- `npm run electron` 

Both scripts disable the sandbox for development.

### Graphics Warnings
These warnings are normal on Linux and don't affect functionality:
```
MESA-INTEL: warning: Haswell Vulkan support is incomplete
libva error: /usr/lib/x86_64-linux-gnu/dri/iHD_drv_video.so init failed
```

## Configuration

### Environment Variables
Copy `.env.example` to `.env.local` and configure:

```bash
# AI Provider (default: ollama)
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Search (default: disabled)
SEARCH_ENGINE=disabled
```

### Settings UI
Access settings at `http://localhost:3000/settings` or use the Settings link in the app header.

## Architecture

### Project Structure
```
study-buddy/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── getChat/       # LLM streaming endpoint
│   │   ├── getSources/    # Search endpoint
│   │   └── getParsedSources/ # Content parsing
│   ├── settings/          # Settings page
│   └── page.tsx          # Main app page
├── components/            # React components
├── utils/
│   └── providers/         # LLM provider abstractions
├── main.js               # Electron main process
└── .github/workflows/    # CI/CD workflows
```

### Key Components
- **Provider System**: `utils/providers/` - Abstracted LLM providers
- **Search System**: Optional web search with multiple backends
- **Settings**: Browser-based configuration UI
- **Electron**: Desktop app wrapper with embedded Next.js server

## Testing

```bash
# Build test
npm run build

# Lint check
npm run lint

# Local distribution build
npm run dist
```

## Debugging

### Electron DevTools
In development, DevTools open automatically. In production builds, use:
- **macOS/Linux**: `Cmd/Ctrl + Shift + I`
- **Windows**: `F12`

### Logs
- **Electron logs**: Check terminal output
- **Next.js logs**: Available in Electron DevTools console
- **API logs**: Server-side logs in terminal

### Common Issues

1. **Port conflicts**: Next.js auto-increments ports (3000 → 3001 → 3002...)
2. **Ollama not found**: Ensure Ollama is running on `localhost:11434`
3. **Build failures**: Check `npm run build` works before `npm run dist`

## Contributing

### Code Style
- ESLint configuration enforced
- Prettier for formatting
- TypeScript strict mode
- Conventional commit messages

### Pull Request Process
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Release Process
1. Update version: `npm version patch/minor/major`
2. Push changes: `git push && git push --tags`
3. GitHub Actions will build and release automatically

## Deployment

### GitHub Actions
- **Build workflow**: Tests and builds on every push
- **Release workflow**: Creates distributables on git tags
- **PR checks**: Code quality enforcement

### Manual Release
```bash
# Update version and create release
npm version patch
git push origin main --tags

# Or build locally
npm run dist
```

## Troubleshooting

### Cannot start Electron
1. Check Node.js version (18+ required)
2. Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
3. Try sandbox flags: `npm run electron` (uses `--no-sandbox`)

### Build errors
1. Ensure dependencies are installed: `npm ci`
2. Check TypeScript: `npx tsc --noEmit`
3. Test Next.js build: `npm run build`

### Performance issues
1. Check Ollama is running: `ollama list`
2. Monitor memory usage in Activity Monitor/Task Manager
3. Close unused browser tabs/applications

---

**Need help?** Open an issue on GitHub or check our [troubleshooting guide](.github/WORKFLOWS.md).