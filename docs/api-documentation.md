# API Documentation

Study Buddy's backend API provides endpoints for AI chat interactions, search functionality, and configuration management. All APIs are built using Next.js API routes.

## Base URL

```
http://localhost:3000/api  (Development)
file://app.asar/api        (Production Electron)
```

## Authentication

No authentication is required as Study Buddy runs locally. API keys for external services are managed through the settings system.

## API Endpoints

### Chat API

#### `POST /api/getChat`

Initiate a streaming chat conversation with the configured AI provider.

**Request Body:**
```typescript
{
  messages: {
    role: "user" | "assistant" | "system";
    content: string;
  }[]
}
```

**Headers:**
```
Content-Type: application/json
X-StudyBuddy-Settings: string (optional, JSON-encoded settings)
```

**Response:**
- **Content-Type**: `text/event-stream`
- **Status**: 200 (success), 500 (error)

**Streaming Response Format:**
```
data: {"type": "chunk", "content": "Partial response text"}

data: {"type": "chunk", "content": " continuation..."}

data: {"type": "done"}
```

**Error Response:**
```typescript
{
  error: string;
  details?: string;
}
```

**Example:**
```javascript
const response = await fetch('/api/getChat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Explain photosynthesis' }
    ]
  })
});

// Handle streaming response
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Process chunk...
}
```

### Search API

#### `POST /api/getSources`

Search for relevant information sources based on a query.

**Request Body:**
```typescript
{
  question: string;
}
```

**Headers:**
```
Content-Type: application/json
X-StudyBuddy-Settings: string (optional, JSON-encoded settings)
```

**Response:**
```typescript
{
  sources: {
    name: string;    // Page title or description
    url: string;     // Source URL
  }[]
}
```

**Error Response:**
```typescript
{
  error: string;
  details?: string;
}
```

**Search Engine Support:**

| Engine | Type | API Key Required | Features |
|--------|------|------------------|----------|
| `bing` | Commercial API | Yes | High-quality results, fast |
| `serper` | Google API proxy | Yes | Google results, reliable |
| `searxng` | Self-hosted | No | Privacy-focused, customizable |
| `duckduckgo` | Web scraping | No | Privacy-focused, free |
| `brave` | Independent API | Yes | Ad-free results, privacy |
| `disabled` | None | No | Disables search functionality |

**Example:**
```javascript
const response = await fetch('/api/getSources', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'renewable energy sources'
  })
});

const data = await response.json();
console.log(data.sources); // Array of search results
```

#### `POST /api/getParsedSources`

Parse and extract content from provided source URLs.

**Request Body:**
```typescript
{
  sources: {
    name: string;
    url: string;
  }[]
}
```

**Response:**
```typescript
{
  sources: {
    name: string;
    url: string;
    fullContent: string;  // Extracted text content
  }[]
}
```

### Settings API

#### `GET /api/settings`

Retrieve current application settings (API keys are redacted for security).

**Response:**
```typescript
{
  llmProvider: "openai" | "together" | "custom";
  llmApiKey: "";        // Always empty for security
  llmBaseUrl: string;
  llmModel: string;
  searchEngine: "bing" | "serper" | "searxng" | "duckduckgo" | "brave" | "disabled";
  searchApiKey: "";     // Always empty for security
  searchUrl: string;
  defaultEducationLevel: string;
}
```

#### `POST /api/settings`

Update application settings.

**Request Body:**
```typescript
{
  llmProvider?: "openai" | "together" | "custom";
  llmApiKey?: string;
  llmBaseUrl?: string;
  llmModel?: string;
  searchEngine?: "bing" | "serper" | "searxng" | "duckduckgo" | "brave" | "disabled";
  searchApiKey?: string;
  searchUrl?: string;
  defaultEducationLevel?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

## Error Handling

### Standard Error Format

All API endpoints return errors in a consistent format:

```typescript
{
  error: string;           // Human-readable error message
  details?: string;        // Additional error details
  code?: number;          // Optional error code
}
```

### Common HTTP Status Codes

- **200**: Success
- **400**: Bad Request (invalid input)
- **500**: Internal Server Error
- **429**: Too Many Requests (rate limiting)

### Error Examples

**Invalid Request:**
```json
{
  "error": "Invalid request format",
  "details": "Messages array is required"
}
```

**Service Unavailable:**
```json
{
  "error": "AI service unavailable",
  "details": "OpenAI API returned 503 status"
}
```

**Configuration Error:**
```json
{
  "error": "API key required",
  "details": "OpenAI API key not configured in settings"
}
```

## Rate Limiting

### Search APIs
- **SearXNG**: 2-second delay between requests to same server
- **DuckDuckGo**: Built-in delays to prevent blocking  
- **Commercial APIs**: Respect provider rate limits

### AI APIs
- **OpenAI**: Follows OpenAI rate limits
- **Together AI**: Follows Together AI rate limits
- **Custom**: No built-in limits (configure at provider level)

## Configuration Headers

### X-StudyBuddy-Settings

Some endpoints accept runtime settings via the `X-StudyBuddy-Settings` header:

```javascript
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
```

This allows frontend components to override server-side settings temporarily.

## Request/Response Examples

### Complete Chat Flow

```javascript
// 1. Search for sources
const sourcesRes = await fetch('/api/getSources', {
  method: 'POST',
  body: JSON.stringify({ question: 'quantum physics basics' })
});
const { sources } = await sourcesRes.json();

// 2. Parse source content
const parsedRes = await fetch('/api/getParsedSources', {
  method: 'POST', 
  body: JSON.stringify({ sources })
});
const { sources: parsedSources } = await parsedRes.json();

// 3. Start AI chat with context
const chatRes = await fetch('/api/getChat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [
      {
        role: 'system',
        content: `Context: ${parsedSources.map(s => s.fullContent).join('\n')}`
      },
      {
        role: 'user', 
        content: 'Explain quantum physics at a high school level'
      }
    ]
  })
});

// 4. Handle streaming response
const reader = chatRes.body.getReader();
// ... process stream
```

### Settings Management

```javascript
// Get current settings
const currentSettings = await fetch('/api/settings').then(r => r.json());

// Update provider
await fetch('/api/settings', {
  method: 'POST',
  body: JSON.stringify({
    llmProvider: 'together',
    llmApiKey: 'your-api-key',
    llmModel: 'meta-llama/Llama-3.1-8B-Instruct-Turbo'
  })
});
```

## WebSocket Alternative

While Study Buddy uses Server-Sent Events (SSE) for streaming, you could implement WebSocket support:

```javascript
// Hypothetical WebSocket implementation
const ws = new WebSocket('ws://localhost:3000/api/chat-ws');

ws.send(JSON.stringify({
  type: 'chat',
  messages: [{ role: 'user', content: 'Hello' }]
}));

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'chunk') {
    // Handle streaming chunk
  }
};
```

---

*For implementation details and source code, see the [GitHub repository](https://github.com/michael-borck/study-buddy).*