"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

// Documentation content (you could also load this from markdown files)
const docsContent = {
  overview: {
    title: "Documentation Overview",
    content: `
# Study Buddy Documentation

Welcome to Study Buddy's comprehensive documentation! Everything you need to know about using and configuring your AI personal tutor.

## Quick Navigation

**For New Users:**
- Start with the [User Guide](#user-guide) to learn the basics
- Check out [Features](#features) to see what's possible
- Configure your [Settings](#settings) for optimal experience

**For Advanced Users:**
- Explore [Technical Details](#technical) for architecture info
- Review [Troubleshooting](#troubleshooting) for common issues
- Learn about [Keyboard Shortcuts](#shortcuts) for faster usage

**For Developers:**
- Check the [API Documentation](#api) for integration details
- Review [Design System](#design) for UI components
- Visit our [GitHub repository](https://github.com/michael-borck/study-buddy) for source code

## About This Documentation

This documentation is available both within the app and on GitHub for your convenience. All information is kept up-to-date with the latest version of Study Buddy.

Study Buddy is an open-source AI personal tutor that runs locally on your computer, providing personalized learning experiences while maintaining complete privacy.
    `
  },
  
  "user-guide": {
    title: "User Guide",
    content: `
# User Guide

Learn how to use Study Buddy effectively for your learning goals.

## Getting Started

### First Steps
1. **Configure AI Provider**: Go to Settings and choose OpenAI, Together AI, or a custom endpoint
2. **Add API Key**: Enter your API key for the chosen provider
3. **Select Search Engine**: Choose your preferred search provider (or disable for chat-only mode)
4. **Set Education Level**: Pick your default learning level

### Basic Usage

#### Starting a Learning Session
1. **Enter a Topic**: Type what you want to learn about in the main input field
2. **Select Education Level**: Choose from Elementary to Graduate level
3. **Generate Tutor**: Click the button to start your personalized session

#### Education Levels Explained
- **Elementary (Ages 6-11)**: Simple explanations with basic vocabulary
- **Middle School (Ages 11-14)**: Intermediate complexity with examples
- **High School (Ages 14-18)**: Advanced concepts with detailed analysis
- **Undergraduate**: College-level depth and academic rigor
- **Graduate**: Research-level discussions and advanced theory

## Tips for Better Learning

### Asking Effective Questions
- **Be Specific**: "Explain photosynthesis" vs "How do plants make food?"
- **Set Context**: "I'm a high school student learning about..."
- **Request Examples**: "Can you give me a real-world example?"

### Making the Most of Conversations
- **Follow Up**: Ask clarifying questions about concepts you don't understand
- **Connect Ideas**: "How does this relate to what we just discussed?"
- **Test Knowledge**: Ask the AI to quiz you on the material
- **Request Summaries**: "Can you summarize the key points?"

## Privacy and Security

Study Buddy is designed with privacy as a core principle:
- **Local Storage**: Your conversations are stored locally on your device
- **No Tracking**: We don't collect usage data or analytics
- **Open Source**: The entire codebase is available for inspection
- **Transparent Sources**: All information sources are clearly cited
    `
  },
  
  features: {
    title: "Features Overview", 
    content: `
# Features Overview

Study Buddy provides comprehensive AI-powered tutoring with flexible configuration options.

## Core Features

### 🎓 Personalized AI Tutoring
- **Adaptive Learning Levels**: Content adjusts to your chosen education level
- **Interactive Conversations**: Natural chat interface with context awareness
- **Quiz Integration**: Test your knowledge with built-in assessments
- **Follow-up Support**: Ask questions and dive deeper into topics

### 🔍 Intelligent Research
- **Multi-Engine Search**: Bing, Google (Serper), DuckDuckGo, SearXNG, Brave
- **Source Verification**: See where information comes from
- **Content Processing**: Automatic web page content extraction
- **Real-time Updates**: Access to current information online

### 🛡️ Privacy-First Design
- **Local Processing**: Your conversations stay on your device
- **No Analytics**: No tracking or data collection
- **Open Source**: Transparent and auditable code
- **User Control**: Complete control over data and settings

### ⚙️ Flexible Configuration
- **Multiple AI Providers**: OpenAI, Together AI, or custom endpoints
- **Search Options**: Multiple search engines or disable search entirely
- **Model Selection**: Choose specific AI models for different needs
- **Customizable Interface**: Adjust settings to your preferences

## Advanced Features

### 🔧 Developer-Friendly
- **Cross-Platform**: Windows, macOS, Linux support
- **API Architecture**: RESTful design with streaming support
- **Open Source**: MIT license for maximum flexibility
- **Extensible**: Plugin-friendly architecture

### 📱 Modern Experience
- **Responsive Design**: Works on all screen sizes
- **Keyboard Shortcuts**: Power user features
- **Accessibility**: Screen reader and keyboard navigation support
- **Fast Performance**: Streaming responses and efficient caching

## AI Provider Options

### OpenAI
- GPT-3.5, GPT-4, and newer models
- High-quality responses with broad knowledge
- Commercial API with usage-based pricing

### Together AI  
- Open-source models like Llama 3.1
- Cost-effective option with good performance
- Supports various model sizes and capabilities

### Custom Endpoints
- Use any OpenAI-compatible API
- Support for local models (Ollama, etc.)
- Self-hosted or third-party providers

## Search Engine Options

### Commercial APIs
- **Bing**: High-quality results, fast responses
- **Serper**: Google search results via API
- **Brave**: Independent search with privacy focus

### Free Options
- **DuckDuckGo**: Privacy-focused, no API key required
- **SearXNG**: Self-hosted open-source search

### Disabled Mode
- Chat-only experience without web search
- Faster responses, relies on AI training data
    `
  },
  
  settings: {
    title: "Settings Guide",
    content: `
# Settings Guide

Configure Study Buddy to work best for your needs and preferences.

## AI Provider Configuration

### OpenAI Setup
1. **Get API Key**: Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Create Key**: Click "Create new secret key"
3. **Copy Key**: Save it securely (you won't see it again)
4. **Enter in Settings**: Paste into AI Provider section
5. **Test Connection**: Verify it works before saving

**Recommended Models:**
- **GPT-3.5-turbo**: Fast and cost-effective
- **GPT-4**: Higher quality but slower and more expensive
- **GPT-4-turbo**: Balance of quality and speed

### Together AI Setup
1. **Sign Up**: Visit [api.together.xyz](https://api.together.xyz/)
2. **Get API Key**: Generate API key from dashboard
3. **Choose Model**: Popular options include:
   - **Llama-3.1-8B-Instruct-Turbo**: Fast and efficient
   - **Llama-3.1-70B-Instruct-Turbo**: Higher quality responses
   - **Mixtral-8x7B-Instruct-v0.1**: Good balance of speed/quality

### Custom Endpoint Setup
1. **Base URL**: Enter your custom API endpoint
2. **API Key**: Provide authentication key if required
3. **Model**: Specify model name your endpoint supports
4. **Test**: Verify connection works properly

**Compatible Services:**
- Ollama (local models)
- LM Studio
- Text Generation WebUI
- Azure OpenAI
- AWS Bedrock (with proxy)

## Search Engine Configuration

### Bing Search
1. **Get API Key**: Visit [portal.azure.com](https://portal.azure.com)
2. **Create Resource**: Search for "Bing Search v7"
3. **Get Keys**: Copy key from resource page
4. **Enter in Settings**: Paste into Search Engine section

### Serper (Google)
1. **Sign Up**: Visit [serper.dev](https://serper.dev/)
2. **Get API Key**: Generate key from dashboard
3. **Check Credits**: Monitor usage to avoid limits

### SearXNG Setup
1. **Find Instance**: Visit [searx.space](https://searx.space/) for public instances
2. **Choose Server**: Select fast, reliable instance
3. **Enter URL**: Use format like https://searx.example.com
4. **Test Search**: Verify instance works

**Self-Hosting SearXNG:**
Docker setup:
docker run -d --name searxng
  -p 8080:8080
  searxng/searxng

### DuckDuckGo
- **No Setup Required**: Works immediately
- **Privacy Focused**: No tracking or personal data collection
- **Rate Limited**: May be slower during high usage

### Brave Search
1. **Get API Key**: Visit [api.search.brave.com](https://api.search.brave.com/)
2. **Subscribe**: Choose appropriate plan
3. **Generate Key**: Create API key from dashboard

## Default Settings

### Education Level
Set your preferred default education level:
- **Elementary**: Simple explanations for young learners
- **Middle School**: Intermediate complexity
- **High School**: Advanced concepts with examples
- **Undergraduate**: College-level depth
- **Graduate**: Research and advanced theory

This setting is remembered and applied automatically to new conversations.

### Advanced Options

#### Connection Timeouts
- Default: 30 seconds for AI responses
- Default: 10 seconds for search queries
- Adjust if you have slow internet connection

#### Rate Limiting
- Built-in delays prevent overwhelming services
- SearXNG: 2-second delays between requests
- Commercial APIs: Respect provider limits

#### Caching
- Search results cached for 15 minutes
- Model lists cached for 1 hour
- Clear cache by restarting application

## Security Best Practices

### API Key Management
- **Never Share**: Keep API keys private
- **Rotate Regularly**: Change keys periodically
- **Monitor Usage**: Check provider dashboards for unusual activity
- **Revoke if Compromised**: Immediately revoke exposed keys

### Local Data Protection
- Settings stored in user directory
- Conversations saved locally only
- No cloud synchronization by default

### Network Security
- All connections use HTTPS
- API keys transmitted securely
- No telemetry or tracking data sent

## Troubleshooting Settings

### Connection Issues
1. **Check API Key**: Ensure correct key without extra spaces
2. **Verify Internet**: Test with other applications
3. **Try Different Provider**: Switch temporarily to isolate issue
4. **Check Firewall**: Ensure ports 80/443 are open

### Model Discovery Problems
1. **Manual Entry**: Type model name instead of using discovery
2. **Check Permissions**: Ensure API key has model access
3. **Provider Status**: Check if service is experiencing issues

### Search Problems
1. **Test Different Engine**: Try multiple search providers
2. **Check API Quotas**: Verify you haven't exceeded limits
3. **SearXNG Issues**: Try different instance from searx.space

### Settings Not Saving
1. **File Permissions**: Ensure app can write to user directory
2. **Disk Space**: Verify sufficient storage available
3. **Antivirus**: Check if security software blocks file writes
4. **Reset Config**: Delete settings file and reconfigure
    `
  },
  
  troubleshooting: {
    title: "Troubleshooting",
    content: `
# Troubleshooting Guide

Quick solutions for common issues with Study Buddy.

## Quick Diagnostics

### First Steps
1. **Check Settings**: Verify AI provider and search engine are configured
2. **Test Connection**: Use built-in connection test in Settings
3. **Restart App**: Close and reopen Study Buddy
4. **Check Internet**: Ensure stable network connection

## Common Issues

### "API Key Required" Error
**Problem**: Can't start conversations
**Solutions**:
1. Go to Settings → AI Provider
2. Enter valid API key for your chosen provider
3. Click "Test Connection" to verify
4. Save settings and try again

**Getting API Keys**:
- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Together AI**: [api.together.xyz](https://api.together.xyz/)

### "Connection Failed" Error
**Problem**: Can't connect to AI service
**Common Causes**:

1. **Invalid API Key**:
   - Check for typos or extra spaces
   - Verify key hasn't been revoked
   - Ensure sufficient credits/quota

2. **Network Issues**:
   - Test internet connection
   - Try different network
   - Check firewall settings

3. **Service Outage**:
   - Check provider status pages
   - Try again later
   - Switch to backup provider

### Search Not Working
**Problem**: No search results or search errors
**Solutions by Engine**:

**Bing/Serper**: Verify API key and check quota
**DuckDuckGo**: Wait if rate limited, try again
**SearXNG**: Check server URL, try different instance
**Brave**: Verify API key and credit balance

### Slow Performance
**Problem**: App feels sluggish
**Optimizations**:
1. **Use Faster Models**: GPT-3.5 vs GPT-4
2. **Disable Search**: For simple questions
3. **Check Internet Speed**: Use speedtest.net
4. **Close Other Apps**: Free up system resources
5. **Restart Application**: Clear memory usage

### Settings Not Saving
**Problem**: Configuration resets after restart
**Solutions**:
1. **Check Permissions**: Ensure app can write files
2. **Verify Disk Space**: Need space for config files
3. **Disable Antivirus**: Temporarily to test file writing
4. **Reset Configuration**: Delete settings file and reconfigure

## Error Messages

### HTTP Error Codes
- **401 Unauthorized**: Invalid API key
- **403 Forbidden**: API key lacks permissions
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Provider service issue
- **503 Service Unavailable**: Service temporarily down

### Application Errors
- **"Failed to Load Settings"**: File permission or corruption issue
- **"Model Discovery Failed"**: API connection problem
- **"Search Configuration Error"**: Search engine setup issue

## Platform-Specific Issues

### Windows
- **App Won't Start**: Run as Administrator
- **Antivirus Blocking**: Add Study Buddy to exclusions
- **Missing Dependencies**: Install Visual C++ Redistributables

### macOS
- **Security Warning**: Right-click → Open to bypass Gatekeeper
- **Permission Denied**: Check System Preferences → Security & Privacy

### Linux
- **AppImage Issues**: Make executable with chmod +x
- **Missing FUSE**: Install with sudo apt install fuse
- **Permission Errors**: Check file ownership and permissions

## Advanced Troubleshooting

### Enable Debug Mode
**Electron App**: Run from terminal to see detailed logs
**Web Version**: Open browser Developer Tools (F12)

### Reset Configuration
If all else fails:
1. **Backup API Keys**: Note them down
2. **Delete Config Folder**:
   - Windows: %APPDATA%/study-buddy/
   - macOS: ~/Library/Application Support/study-buddy/
   - Linux: ~/.config/study-buddy/
3. **Restart App**: Reconfigure from scratch

### Network Diagnostics
Test API connectivity:

# Test OpenAI
curl -H "Authorization: Bearer YOUR_KEY" https://api.openai.com/v1/models

# Test connectivity
ping api.openai.com


## Getting More Help

### Self-Service
1. **Check Other Docs**: Review User Guide and Features
2. **Settings Help**: Built-in tooltips and examples
3. **About Page**: Version and feature information

### Community Support
1. **GitHub Issues**: [Report bugs](https://github.com/michael-borck/study-buddy/issues)
2. **Discussions**: [Ask questions](https://github.com/michael-borck/study-buddy/discussions)
3. **Feature Requests**: [Suggest improvements](https://github.com/michael-borck/study-buddy/issues/new)

### Reporting Issues
Include these details:
- Operating system and version
- Study Buddy version (from About page)
- Exact error messages
- Steps to reproduce the problem
- Which AI provider and search engine you're using

**Privacy Note**: Never share API keys publicly when reporting issues.
    `
  },
  
  shortcuts: {
    title: "Keyboard Shortcuts",
    content: `
# Keyboard Shortcuts

Speed up your Study Buddy experience with these keyboard shortcuts.

## Global Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Ctrl/Cmd + ,** | Open Settings | Quick access to configuration |
| **Ctrl/Cmd + N** | New Conversation | Start fresh chat session |
| **Ctrl/Cmd + R** | Refresh Page | Reload current page |
| **Escape** | Close Modal | Dismiss open dialogs |

## Chat Interface

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Enter** | Send Message | Submit your question or response |
| **Shift + Enter** | New Line | Add line break in message |
| **Ctrl/Cmd + A** | Select All | Select all text in input |
| **Ctrl/Cmd + Z** | Undo | Undo last text change |

## Navigation

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Tab** | Next Element | Move to next interactive element |
| **Shift + Tab** | Previous Element | Move to previous element |
| **Space** | Activate Button | Click focused button |
| **Arrow Keys** | Navigate Lists | Move through dropdown options |

## Text Editing

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Ctrl/Cmd + C** | Copy | Copy selected text |
| **Ctrl/Cmd + V** | Paste | Paste from clipboard |
| **Ctrl/Cmd + X** | Cut | Cut selected text |
| **Ctrl/Cmd + A** | Select All | Select all text |

## Settings Page

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Tab** | Next Field | Move to next input field |
| **Enter** | Submit Form | Save current settings |
| **Escape** | Cancel Changes | Discard unsaved changes |

## Browser-Specific (Web Version)

| Shortcut | Action | Description |
|----------|--------|-------------|
| **F5** | Refresh | Reload the page |
| **Ctrl/Cmd + Shift + I** | Dev Tools | Open browser developer tools |
| **Ctrl/Cmd + L** | Address Bar | Focus on URL bar |
| **F11** | Full Screen | Toggle fullscreen mode |

## Accessibility Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Alt + Text** | Focus Element | Jump to element with access key |
| **Shift + F10** | Context Menu | Open right-click menu |
| **Ctrl + Home** | Top of Page | Jump to page beginning |
| **Ctrl + End** | Bottom of Page | Jump to page end |

## Tips for Efficiency

### Quick Settings Access
- Use **Ctrl/Cmd + ,** to rapidly access settings
- Make configuration changes without leaving your conversation
- Test connections immediately with keyboard navigation

### Faster Messaging
- **Enter** to send, **Shift + Enter** for new lines
- Use **Ctrl/Cmd + A** to select all text for editing
- **Escape** to quickly close any open dialogs

### Navigation Flow
- **Tab** through interface elements in logical order
- **Space** to activate buttons and checkboxes
- **Arrow keys** to navigate dropdown menus

### Text Selection
- **Ctrl/Cmd + A** to select all text in current field
- **Shift + Arrow** to extend text selection
- **Ctrl/Cmd + Left/Right** to jump by words

## Customization

### Browser Extensions
Some browser extensions add additional shortcuts:
- Password managers: Auto-fill API keys
- Text expanders: Quick topic templates
- Accessibility tools: Enhanced navigation

### Operating System
Leverage OS-level shortcuts:
- **Windows**: Win + V for clipboard history
- **macOS**: Cmd + Space for Spotlight search
- **Linux**: Alt + F2 for run dialog

## Troubleshooting Shortcuts

### When Shortcuts Don't Work
1. **Check Focus**: Ensure correct element is focused
2. **Browser Conflicts**: Some browsers override shortcuts
3. **Extension Conflicts**: Disable extensions temporarily
4. **Keyboard Layout**: Verify correct layout is active

### Alternative Methods
If keyboard shortcuts fail:
- Right-click for context menus
- Use mouse for navigation
- Check Settings for alternative input methods

## Power User Tips

### Rapid Configuration
1. **Ctrl/Cmd + ,** → Settings
2. **Tab** through fields quickly
3. **Enter** to save and return

### Efficient Learning Flow
1. Enter topic with typed input
2. **Tab** to education level dropdown
3. **Arrow keys** to select level
4. **Tab** to Generate button
5. **Enter** to start learning

### Quick Topic Switching
1. **Ctrl/Cmd + N** for new conversation
2. Type new topic immediately
3. **Enter** to generate new tutor
4. Continue learning without mouse

Remember: Keyboard shortcuts make Study Buddy more accessible and efficient for all users!
    `
  },
  
  technical: {
    title: "Technical Overview",
    content: `
# Technical Overview

Understanding Study Buddy's architecture and technical implementation.

## Architecture Overview

Study Buddy is built as a hybrid desktop application using:

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **React Components**: Modern functional components with hooks

### Backend Stack
- **Next.js API Routes**: Serverless API endpoints
- **Node.js Runtime**: Server-side JavaScript execution
- **Streaming APIs**: Real-time response handling
- **Zod**: Runtime type validation

### Desktop Integration
- **Electron 36**: Cross-platform desktop framework
- **Electron Builder**: Application packaging
- **Native Menus**: Platform-specific UI integration

## Data Flow

### Chat Interaction Flow

User Input → React Component → API Route → AI Provider → Stream Response → UI Update


### Search Integration Flow

User Query → Search API → Content Parsing → AI Context → Enhanced Response


### Settings Management Flow

User Settings → localStorage → File System (Electron) → Runtime Configuration


## API Architecture

### Core Endpoints

#### /api/getChat
- **Purpose**: Stream AI responses
- **Method**: POST
- **Input**: Messages array
- **Output**: Server-sent events stream

#### /api/getSources
- **Purpose**: Search for relevant sources
- **Method**: POST  
- **Input**: Question string
- **Output**: Array of source objects

#### /api/settings
- **Purpose**: Manage configuration
- **Methods**: GET (retrieve), POST (update)
- **Features**: API key protection, validation

### Streaming Implementation

Study Buddy uses Server-Sent Events (SSE) for real-time AI responses:


// Streaming response pattern
const stream = new ReadableStream({
  async start(controller) {
    // Send chunks as they arrive
    for await (const chunk of aiResponse) {
      controller.enqueue(chunk);
    }
    controller.close();
  }
});


## AI Provider Integration

### OpenAI Integration
- **Models**: GPT-3.5, GPT-4, and newer models
- **Authentication**: Bearer token with API key
- **Streaming**: Native streaming support
- **Rate Limits**: Respects OpenAI's rate limiting

### Together AI Integration
- **Models**: Llama 3.1, Mixtral, and other open-source models
- **Authentication**: API key in headers
- **Streaming**: Compatible with OpenAI format
- **Cost**: Generally more cost-effective than OpenAI

### Custom Endpoint Support
- **Compatibility**: Any OpenAI-compatible API
- **Examples**: Ollama, LM Studio, Azure OpenAI
- **Configuration**: Custom base URL and model names

## Search Engine Integration

### Multi-Engine Support

**Commercial APIs:**
- **Bing**: Microsoft's search API with high-quality results
- **Serper**: Google search results via third-party API
- **Brave**: Independent search index

**Free Options:**
- **DuckDuckGo**: HTML scraping with privacy focus
- **SearXNG**: Self-hosted open-source metasearch

### Content Processing Pipeline

1. **Query Execution**: Search multiple sources
2. **Result Filtering**: Remove irrelevant or blocked sites
3. **Content Extraction**: Parse HTML to extract text
4. **Context Preparation**: Format for AI consumption

## Security Architecture

### API Key Protection

// Frontend: Keys never exposed
const safeSettings = {
  ...settings,
  llmApiKey: '', // Redacted
  searchApiKey: '', // Redacted
};

// Backend: Secure handling
const apiKey = getSettings().llmApiKey;
if (!apiKey) throw new Error('API key required');


### Input Validation
- **Zod Schemas**: Runtime type checking
- **Sanitization**: Clean user inputs
- **Rate Limiting**: Prevent API abuse

### Local Data Storage
- **No External Storage**: All data stays local
- **Encrypted Preferences**: Sensitive settings protection
- **User Control**: Complete data ownership

## Performance Optimization

### Streaming Responses
- **Real-time Updates**: Show responses as generated
- **Reduced Latency**: Immediate feedback to users
- **Memory Efficient**: Process chunks without full buffering

### Caching Strategy
- **Search Results**: 15-minute cache for repeated queries
- **Model Lists**: 1-hour cache for provider discovery
- **Static Assets**: Browser caching for images/CSS

### Resource Management
- **Memory Cleanup**: Proper stream cleanup and garbage collection
- **Connection Pooling**: Reuse HTTP connections
- **Bundle Optimization**: Code splitting and tree shaking

## Development Tools

### Build System

# Development
npm run dev              # Next.js dev server
npm run electron-dev     # Electron with hot reload

# Production
npm run build           # Next.js production build
npm run build-electron  # Electron packages


### Code Quality
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user workflow testing
- **Manual Testing**: Cross-platform verification

## Deployment Architecture

### Platform Builds
- **Windows**: NSIS installer and portable executable
- **macOS**: DMG package with Apple Silicon support
- **Linux**: AppImage and Debian packages

### Distribution Strategy
- **GitHub Releases**: Automated builds via GitHub Actions
- **Auto-updater**: Built-in update mechanism
- **Version Management**: Semantic versioning

### Configuration Management

User Data Directories:
- Windows: %APPDATA%/study-buddy/
- macOS: ~/Library/Application Support/study-buddy/
- Linux: ~/.config/study-buddy/

Contains:
- settings.json (user preferences)
- conversations/ (chat history)
- cache/ (temporary data)


## Monitoring and Debugging

### Development Mode
- **Console Logging**: Detailed operation logs
- **Error Boundaries**: Graceful error handling
- **DevTools Integration**: Browser debugging tools

### Production Monitoring
- **Error Tracking**: Local error logging
- **Performance Metrics**: Response time monitoring
- **Health Checks**: Service availability verification

## Extensibility

### Plugin Architecture
Study Buddy is designed for future extensibility:

- **Provider Plugins**: Add new AI providers
- **Search Plugins**: Integrate additional search engines
- **UI Themes**: Customizable appearance
- **Custom Prompts**: User-defined prompt templates

### API Compatibility
- **OpenAI Standard**: Compatible with OpenAI API format
- **RESTful Design**: Standard HTTP/JSON interfaces
- **Webhook Support**: Future integration capabilities

## Open Source Benefits

### Transparency
- **Full Source Code**: Available on GitHub
- **Security Audits**: Community review and verification
- **No Hidden Features**: Complete functionality visibility

### Community Contributions
- **Bug Reports**: Community-driven issue identification
- **Feature Requests**: User-directed development
- **Code Contributions**: Community improvements and fixes
- **Documentation**: Collaborative knowledge building

### Licensing
- **MIT License**: Maximum freedom for use and modification
- **Commercial Use**: Permitted for business applications
- **Modification Rights**: Full right to customize and extend
- **Distribution**: Can be redistributed with attribution
    `
  },
  
  development: {
    title: "Development Guide",
    content: `
# Development Guide

Quick development setup and workflow information for Study Buddy.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- (Optional) Ollama for local AI

### Quick Start

Development with hot reload:
npm run electron-dev

Or run components separately:
npm run dev        # Next.js only
npm run electron   # Electron only (after Next.js is running)

## Development Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start Next.js development server |
| npm run electron | Launch Electron app (needs Next.js running) |
| npm run electron-dev | **Recommended**: Start both Next.js and Electron with hot reload |
| npm run build | Build Next.js for production |
| npm run dist | Build Electron distributables |
| npm run lint | Run ESLint |

## Configuration

### Environment Variables
Copy .env.example to .env.local and configure:

AI Provider (default: ollama)
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

Search (default: disabled)
SEARCH_ENGINE=disabled

### Settings UI
Access settings at http://localhost:3000/settings or use the Settings link in the app header.

## Project Structure

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

## Debugging

### Electron DevTools
In development, DevTools open automatically. In production builds, use:
- **macOS/Linux**: Cmd/Ctrl + Shift + I
- **Windows**: F12

### Common Issues

1. **Port conflicts**: Next.js auto-increments ports (3000 → 3001 → 3002...)
2. **Ollama not found**: Ensure Ollama is running on localhost:11434
3. **Build failures**: Check npm run build works before npm run dist

## Contributing

### Code Style
- ESLint configuration enforced
- Prettier for formatting
- TypeScript strict mode
- Conventional commit messages

### Pull Request Process
1. Fork the repository
2. Create feature branch: git checkout -b feature/amazing-feature
3. Commit changes: git commit -m 'Add amazing feature'
4. Push branch: git push origin feature/amazing-feature
5. Open Pull Request

For complete development setup, see the full Development Setup guide.
    `
  },

  icons: {
    title: "Icon Generation Guide",
    content: `
# Icon Generation Guide 🎓

Complete guide for generating Study Buddy's graduation cap icons.

## Required Icon Sizes

### Web (favicon)
- app/favicon.ico - 16x16, 32x32 (multi-size ICO file)

### Electron (for cross-platform builds)
- build/icons/icon.icns (macOS) - Multi-size ICNS file
- build/icons/icon.ico (Windows) - Multi-size ICO file
- build/icons/icon.png (Linux) - 512x512 PNG (Electron will auto-scale)

### Additional sizes for Linux distributions
- build/icons/16x16.png through build/icons/1024x1024.png

## How to Generate Icons from 🎓 Emoji

### Option 1: Online Tools (Recommended)
1. Go to https://favicon.io/emoji-favicons/graduation-cap/
2. Download the graduation cap emoji favicon package
3. Extract and use the generated files

### Option 2: Manual Creation
1. **Create base image:**
   - Open image editor (Figma, Canva, GIMP, etc.)
   - Create 1024x1024 canvas with transparent background
   - Add graduation cap emoji 🎓 at large size
   - Center it with some padding around edges
   - Export as PNG

2. **Generate multiple sizes:**
   - Use online converter like https://icoconvert.com/
   - Upload your 1024x1024 PNG
   - Generate .ico files with multiple sizes (16, 32, 48, 64, 128, 256)
   - Generate .icns file for macOS
   - Generate individual PNG files for Linux

### Option 3: Command Line (ImageMagick)
If you have ImageMagick installed:

ICO for Windows (multi-size)
magick icon-1024.png -resize 256x256 -resize 128x128 -resize 64x64 -resize 48x48 -resize 32x32 -resize 16x16 build/icons/icon.ico

Individual PNGs for Linux
magick icon-1024.png -resize 16x16 build/icons/16x16.png
magick icon-1024.png -resize 32x32 build/icons/32x32.png
magick icon-1024.png -resize 48x48 build/icons/48x48.png
# ... continue for all sizes

## Package.json Configuration

Once you have the icons, add this to your package.json build config:

{
  "build": {
    "mac": {
      "icon": "build/icons/icon.icns"
    },
    "win": {
      "icon": "build/icons/icon.ico"
    },
    "linux": {
      "icon": "build/icons/icon.png"
    }
  }
}

## File Structure

study-buddy/
├── app/
│   └── favicon.ico          # Replace with graduation cap favicon
├── build/
│   └── icons/
│       ├── icon.icns        # macOS (multi-size)
│       ├── icon.ico         # Windows (multi-size)
│       ├── icon.png         # Linux main (512x512)
│       ├── 16x16.png        # Linux sizes
│       ├── 32x32.png
│       └── ... (all sizes)
└── public/
    └── favicon.ico          # Copy from app/ for consistency

## Design Guidelines

- **Style**: Clean graduation cap emoji 🎓 on transparent background
- **Padding**: Leave ~15% padding around edges so icon doesn't touch edges
- **Colors**: Use standard emoji colors (black cap, gold tassel)
- **Background**: Transparent for all sizes
- **Quality**: Vector-based or high-DPI source for clean scaling

## Testing

After generating icons:
1. Test favicon in browser (should show in tab)
2. Build Electron app: npm run electron-pack
3. Check generated apps show graduation cap icon in:
   - Windows: Taskbar, window title, file explorer
   - macOS: Dock, Finder, window title
   - Linux: Application menu, window manager

## Quick Start

The fastest way is to use https://favicon.io/emoji-favicons/graduation-cap/ and download the complete package, then organize the files according to the structure above.

**Note**: Study Buddy already has generated graduation cap icons! This guide is for reference if you need to regenerate or customize them.
    `
  },

  api: {
    title: "API Reference",
    content: `
# API Reference

Complete reference for Study Buddy's backend API endpoints.

## Base Information

**Base URL**: http://localhost:3000/api (Development)
**Authentication**: None required (local application)
**Content-Type**: application/json

## Chat API

### POST /api/getChat

Stream AI responses for conversational tutoring.

**Request Body:**
json
{
  "messages": [
    {
      "role": "user" | "assistant" | "system",
      "content": "string"
    }
  ]
}


**Headers:**

Content-Type: application/json
X-StudyBuddy-Settings: string (optional JSON-encoded settings)


**Response:** Server-Sent Events stream

data: {"type": "chunk", "content": "Partial response"}
data: {"type": "chunk", "content": " continuation..."}
data: {"type": "done"}


**Example:**
javascript
const response = await fetch('/api/getChat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Explain quantum physics' }
    ]
  })
});

// Handle streaming
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Process streaming chunk
}


## Search API

### POST /api/getSources

Search for relevant information sources.

**Request Body:**
json
{
  "question": "string"
}


**Response:**
json
[
  {
    "name": "Page title or description",
    "url": "https://example.com/page"
  }
]


**Search Engines Supported:**
- bing: Microsoft Bing API (requires API key)
- serper: Google via Serper API (requires API key)
- searxng: Self-hosted SearXNG (requires server URL)
- duckduckgo: DuckDuckGo scraping (no API key)
- brave: Brave Search API (requires API key)
- disabled: No search functionality

### POST /api/getParsedSources

Extract content from source URLs.

**Request Body:**
json
{
  "sources": [
    {
      "name": "string",
      "url": "string"
    }
  ]
}


**Response:**
json
[
  {
    "name": "string",
    "url": "string", 
    "fullContent": "Extracted text content"
  }
]


## Settings API

### GET /api/settings

Retrieve current application settings.

**Response:**
json
{
  "llmProvider": "openai" | "together" | "custom",
  "llmApiKey": "", // Always empty for security
  "llmBaseUrl": "string",
  "llmModel": "string",
  "searchEngine": "bing" | "serper" | "searxng" | "duckduckgo" | "brave" | "disabled",
  "searchApiKey": "", // Always empty for security
  "searchUrl": "string",
  "defaultEducationLevel": "string"
}


### POST /api/settings

Update application settings.

**Request Body:**
json
{
  "llmProvider": "openai" | "together" | "custom",
  "llmApiKey": "string",
  "llmBaseUrl": "string", 
  "llmModel": "string",
  "searchEngine": "bing" | "serper" | "searxng" | "duckduckgo" | "brave" | "disabled",
  "searchApiKey": "string",
  "searchUrl": "string",
  "defaultEducationLevel": "string"
}


**Response:**
json
{
  "success": true,
  "message": "Settings updated successfully"
}


## Error Handling

### Standard Error Format
All endpoints return errors in consistent format:

json
{
  "error": "Human-readable error message",
  "details": "Additional error details (optional)",
  "code": 500 // HTTP status code (optional)
}


### Common HTTP Status Codes
- **200**: Success
- **400**: Bad Request (invalid input)
- **401**: Unauthorized (invalid API key)
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error
- **503**: Service Unavailable

### Example Error Responses

**API Key Missing:**
json
{
  "error": "API key required",
  "details": "OpenAI API key not configured in settings"
}


**Service Unavailable:**
json
{
  "error": "AI service unavailable", 
  "details": "OpenAI API returned 503 status"
}


**Invalid Input:**
json
{
  "error": "Invalid request format",
  "details": "Messages array is required"
}


## Rate Limiting

### Search APIs
- **SearXNG**: 2-second delay between requests to same server
- **DuckDuckGo**: Built-in delays to prevent IP blocking
- **Commercial APIs**: Respect provider-specific rate limits

### AI APIs
- **OpenAI**: Follows OpenAI's tier-based rate limits
- **Together AI**: Follows Together AI's rate limits
- **Custom**: No built-in limits (configure at provider level)

## Configuration Headers

### X-StudyBuddy-Settings

Pass runtime settings to override server configuration:

javascript
const settings = JSON.stringify({
  llmProvider: 'openai',
  llmApiKey: 'sk-...',
  searchEngine: 'duckduckgo'
});

fetch('/api/getChat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-StudyBuddy-Settings': settings
  },
  body: JSON.stringify({ messages })
});


This allows frontend components to temporarily override settings.

## Advanced Usage Examples

### Complete Learning Flow

javascript
// 1. Search for sources
const sourcesRes = await fetch('/api/getSources', {
  method: 'POST',
  body: JSON.stringify({ 
    question: 'machine learning basics' 
  })
});
const { sources } = await sourcesRes.json();

// 2. Parse source content  
const parsedRes = await fetch('/api/getParsedSources', {
  method: 'POST',
  body: JSON.stringify({ sources })
});
const { sources: parsedSources } = await parsedRes.json();

// 3. Start AI chat with context
const messages = [
  {
    role: 'system',
    content: 'Teaching context: ' + parsedSources.map(s => s.fullContent).join('\\n')
  },
  {
    role: 'user',
    content: 'Explain machine learning at a high school level'
  }
];

const chatRes = await fetch('/api/getChat', {
  method: 'POST', 
  body: JSON.stringify({ messages })
});

// 4. Handle streaming response
const reader = chatRes.body.getReader();
// Process stream...


### Settings Management

javascript
// Get current settings
const settings = await fetch('/api/settings').then(r => r.json());

// Update AI provider
await fetch('/api/settings', {
  method: 'POST',
  body: JSON.stringify({
    llmProvider: 'together',
    llmApiKey: 'your-api-key',
    llmModel: 'meta-llama/Llama-3.1-8B-Instruct-Turbo'
  })
});

// Test new configuration
const testRes = await fetch('/api/getChat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }]
  })
});


## WebSocket Alternative

While Study Buddy uses SSE, WebSocket implementation would look like:

javascript
// Hypothetical WebSocket endpoint
const ws = new WebSocket('ws://localhost:3000/api/chat-ws');

ws.send(JSON.stringify({
  type: 'chat',
  messages: [{ role: 'user', content: 'Hello' }]
}));

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'chunk') {
    // Handle streaming chunk
  } else if (data.type === 'error') {
    // Handle error
  } else if (data.type === 'done') {
    // Response complete
  }
};


## Testing APIs

### Using curl

bash
# Test settings endpoint
curl http://localhost:3000/api/settings

# Test chat (note: streaming response)
curl -X POST http://localhost:3000/api/getChat \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Hello"}]}'

# Test search
curl -X POST http://localhost:3000/api/getSources \\
  -H "Content-Type: application/json" \\
  -d '{"question":"photosynthesis"}'


### Using Postman

1. **Import Collection**: Create collection with base URL
2. **Set Headers**: Content-Type: application/json
3. **Test Streaming**: Enable streaming for chat endpoint
4. **Environment Variables**: Store API keys securely

---

*For implementation details, see the source code at [GitHub](https://github.com/michael-borck/study-buddy).*
    `
  }
};

const navigationItems = [
  { id: 'overview', title: 'Overview', icon: '📖' },
  { id: 'user-guide', title: 'User Guide', icon: '👤' },
  { id: 'features', title: 'Features', icon: '⭐' },
  { id: 'settings', title: 'Settings', icon: '⚙️' },
  { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' },
  { id: 'shortcuts', title: 'Shortcuts', icon: '⌨️' },
  { id: 'development', title: 'Development', icon: '👨‍💻' },
  { id: 'icons', title: 'Icon Generation', icon: '🎨' },
  { id: 'technical', title: 'Technical', icon: '🔬' },
  { id: 'api', title: 'API Reference', icon: '🔌' },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentContent = docsContent[activeSection as keyof typeof docsContent] || docsContent.overview;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900">Documentation</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 hidden lg:block">Documentation</h2>
              
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </nav>
            
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>📚 In-App Documentation</p>
                <p>🔄 Always up-to-date</p>
                <p>🔍 Search with Ctrl+F</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open sidebar</span>
                ☰
              </button>
              <h1 className="text-lg font-semibold text-gray-900">{currentContent.title}</h1>
              <div className="w-10" /> {/* Spacer for center alignment */}
            </div>
          </div>

          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="prose prose-blue max-w-none">
                  <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {currentContent.content.split('\n').map((line, index) => {
                      // Handle headers
                      if (line.startsWith('# ')) {
                        return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">{line.substring(2)}</h1>;
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-2xl font-semibold text-gray-900 mt-6 mb-3">{line.substring(3)}</h2>;
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-xl font-medium text-gray-900 mt-5 mb-2">{line.substring(4)}</h3>;
                      }
                      
                      // Handle code blocks - skip triple backticks
                      if (line.startsWith('')) {
                        return null; // Skip code block delimiters
                      }
                      
                      // Handle lists
                      if (line.startsWith('- ')) {
                        return <li key={index} className="text-gray-700 ml-4">{line.substring(2)}</li>;
                      }
                      
                      // Handle bold text
                      if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                          <p key={index} className="text-gray-700 mb-2">
                            {parts.map((part, i) => 
                              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                            )}
                          </p>
                        );
                      }
                      
                      // Handle links
                      if (line.includes('[') && line.includes('](')) {
                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                        const parts = line.split(linkRegex);
                        return (
                          <p key={index} className="text-gray-700 mb-2">
                            {parts.map((part, i) => {
                              if (i % 3 === 1) {
                                return <a key={i} href={parts[i + 1]} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{part}</a>;
                              } else if (i % 3 === 2) {
                                return null; // Skip URL part
                              }
                              return part;
                            })}
                          </p>
                        );
                      }
                      
                      // Regular paragraphs
                      if (line.trim()) {
                        return <p key={index} className="text-gray-700 mb-2">{line}</p>;
                      }
                      
                      // Empty lines
                      return <div key={index} className="h-2" />;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}