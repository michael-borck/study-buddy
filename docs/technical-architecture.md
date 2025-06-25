# Technical Architecture

This document outlines the technical architecture, design decisions, and implementation details of Study Buddy.

## System Overview

Study Buddy is built as a hybrid desktop application using modern web technologies, combining the reach of web development with the power of native desktop applications.

### Technology Stack

```
┌─────────────────────────────────────────┐
│              Electron Shell             │
├─────────────────────────────────────────┤
│            Next.js Frontend             │
├─────────────────────────────────────────┤
│         Node.js Backend APIs            │
├─────────────────────────────────────────┤
│    External Services (AI, Search)      │
└─────────────────────────────────────────┘
```

#### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Components**: Modern functional components with hooks

#### Backend Stack
- **Next.js API Routes**: Serverless API endpoints
- **Node.js Runtime**: Server-side JavaScript execution
- **Zod**: Runtime type validation and parsing
- **Streaming APIs**: Real-time response handling

#### Desktop Integration
- **Electron 36**: Cross-platform desktop framework
- **Electron Builder**: Application packaging and distribution
- **Native Menus**: Platform-specific UI integration

## Architecture Patterns

### 1. Model-View-Controller (MVC)
```
Model (Data)     ←→     Controller (API)     ←→     View (React)
├─ Settings            ├─ /api/settings            ├─ Settings Page
├─ Chat History        ├─ /api/getChat             ├─ Chat Interface  
└─ Search Results      └─ /api/getSources          └─ Results Display
```

### 2. Provider Pattern
```typescript
// AI Provider abstraction allows switching between services
interface LLMProvider {
  chat(messages: Message[]): Promise<ReadableStream>;
  getModels(): Promise<string[]>;
}

// Implementations: OpenAI, Together AI, Custom endpoints
```

### 3. Settings Management
```typescript
// Centralized configuration with runtime updates
interface AppSettings {
  llmProvider: 'openai' | 'together' | 'custom';
  llmApiKey: string;
  llmBaseUrl: string;
  searchEngine: 'bing' | 'serper' | 'searxng' | 'duckduckgo' | 'brave';
  defaultEducationLevel: string;
}
```

## Data Flow Architecture

### 1. User Interaction Flow
```
User Input → React Component → API Route → External Service → Stream Response → UI Update
```

### 2. Settings Persistence Flow
```
User Settings → localStorage → File System (Electron) → Runtime Configuration
```

### 3. Search Integration Flow
```
User Query → Search API → Web Scraping → Content Parsing → AI Context → Response
```

## API Architecture

### Core Endpoints

#### `/api/getChat`
**Purpose**: Handle AI chat interactions with streaming responses

```typescript
interface ChatRequest {
  messages: { role: string; content: string }[];
}

interface ChatResponse {
  // Streaming text response
  stream: ReadableStream<string>;
}
```

**Flow**:
1. Receive messages array from frontend
2. Apply current settings configuration
3. Create appropriate AI provider instance
4. Stream response back to client
5. Handle errors gracefully

#### `/api/getSources`
**Purpose**: Search and retrieve relevant information sources

```typescript
interface SourcesRequest {
  question: string;
}

interface SourcesResponse {
  sources: {
    name: string;
    url: string;
  }[];
}
```

**Supported Engines**:
- **Bing**: Commercial API with high-quality results
- **Serper**: Google search results via API
- **SearXNG**: Self-hosted open-source metasearch
- **DuckDuckGo**: Privacy-focused search scraping
- **Brave**: Independent search index API

#### `/api/settings`
**Purpose**: Manage application configuration

```typescript
// GET: Retrieve current settings
interface SettingsResponse extends AppSettings {}

// POST: Update settings
interface SettingsRequest extends Partial<AppSettings> {}
```

### Error Handling Strategy

```typescript
// Consistent error response format
interface APIError {
  error: string;
  details?: string;
  code?: number;
}

// Graceful degradation for services
try {
  return await primaryService();
} catch (error) {
  console.warn('Primary service failed, trying fallback');
  return await fallbackService();
}
```

## Component Architecture

### Page Components
```
app/
├── page.tsx                 # Homepage with chat interface
├── settings/page.tsx        # Configuration management
├── about/page.tsx          # Application information
├── legal/page.tsx          # Open source acknowledgments
└── docs/                   # In-app documentation
```

### Shared Components
```
components/
├── Header.tsx              # Navigation and branding
├── Footer.tsx              # Links and attribution
├── Chat.tsx                # Main chat interface
├── Hero.tsx                # Landing page content
├── Sources.tsx             # Search results display
└── InitialInputArea.tsx    # Topic input form
```

### Utility Modules
```
utils/
├── settings.ts             # Configuration management
├── file-settings.js        # Electron file persistence
├── TogetherAIStream.ts     # AI provider implementations
└── utils.ts                # Shared utilities
```

## State Management

### 1. Local Component State (useState)
- **UI State**: Modal visibility, loading states, form inputs
- **Temporary Data**: Current conversation, search results

### 2. Settings State (Global)
- **Persistent Configuration**: API keys, preferences, defaults
- **Runtime Updates**: Dynamic setting changes without restart

### 3. Electron State (Native)
- **Window Management**: Size, position, visibility
- **File System**: Persistent data storage
- **Native Integration**: Menu items, notifications

## Security Architecture

### 1. API Key Protection
```typescript
// Frontend: Never expose API keys
const safeSettings = {
  ...settings,
  llmApiKey: '', // Redacted for client
  searchApiKey: '', // Redacted for client
};

// Backend: Secure key handling
const apiKey = getSettings().llmApiKey;
if (!apiKey) throw new Error('API key required');
```

### 2. Input Validation
```typescript
// Zod schemas for runtime validation
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })),
});
```

### 3. CORS and CSP
```typescript
// Content Security Policy headers
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
};
```

## Performance Optimization

### 1. Streaming Responses
- **Real-time Updates**: Stream AI responses as they're generated
- **Reduced Latency**: Show partial responses immediately
- **Better UX**: Users see progress instead of waiting

### 2. Efficient Searches
- **Rate Limiting**: Prevent overwhelming search APIs
- **Result Caching**: Store recent search results temporarily
- **Parallel Processing**: Handle multiple sources concurrently

### 3. Resource Management
- **Memory Usage**: Clean up streams and event listeners
- **Bundle Size**: Code splitting and dynamic imports
- **Electron Optimization**: Minimize main process overhead

## Deployment Architecture

### Development Environment
```bash
# Next.js development server
npm run dev                 # http://localhost:3000

# Electron development
npm run electron-dev        # Desktop app with hot reload
```

### Production Builds
```bash
# Web build
npm run build              # Optimized Next.js bundle

# Desktop builds
npm run build-electron     # Cross-platform Electron packages
```

### Distribution Strategy
- **GitHub Releases**: Automated builds for all platforms
- **Electron Builder**: Native installers (DMG, NSIS, AppImage)
- **Auto-updater**: Built-in update mechanism

## Monitoring and Debugging

### Development Tools
- **Next.js DevTools**: React component inspection
- **Electron DevTools**: Chromium debugging interface
- **TypeScript**: Compile-time error detection

### Production Monitoring
- **Error Boundaries**: Graceful error handling in React
- **Logging**: Structured console output for debugging
- **Health Checks**: API endpoint status monitoring

### Performance Metrics
- **Bundle Analysis**: webpack-bundle-analyzer
- **Lighthouse**: Core Web Vitals and performance
- **Memory Profiling**: Electron memory usage tracking

---

*This technical documentation is maintained alongside the codebase. For implementation details, see the source code in the [GitHub repository](https://github.com/michael-borck/study-buddy).*