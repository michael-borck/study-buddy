"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const docsContent = {
  overview: {
    title: "Overview",
    content: `
# Study Buddy Documentation

Welcome to Study Buddy — an open-source AI personal tutor that runs on your computer.

## What Study Buddy does

Type a topic, get a grounded tutor. Study Buddy searches the web for sources, reads them, and uses that content to teach you — reducing hallucinations and keeping answers factual. When the session ends, you take away what you learned. Like a real tutor.

## Quick start

**Step 1: Set up an AI**
- Install Ollama from ollama.com (free, runs locally)
- Pull a model: ollama pull llama3.1:8b
- Or go to Settings and enter a secret key for a cloud provider

**Step 2: Start learning**
- Type a topic in the main input
- Choose your education level
- Pick a teaching strategy (Explain, Quiz me, Socratic, etc.)
- Press the arrow button or hit Enter

**Step 3: Have a conversation**
- The tutor will teach you based on web sources
- Ask follow-up questions
- Switch strategies mid-conversation if you want
- Use the microphone button for voice input
- Click the speaker icon to hear responses read aloud

## Privacy

Study Buddy is private by design. When using Ollama locally, your questions never leave your machine. Web search queries go to your chosen search engine (DuckDuckGo by default). No accounts, no data collection, no subscriptions.

## Navigation

Use the sidebar to explore specific topics:
- **User Guide** — How to use the app step by step
- **Features** — Learning strategies, audio, notes, and more
- **Settings** — Configuring your AI provider, search, and audio
- **Troubleshooting** — Solutions for common problems
- **Technical** — Architecture and API details for developers
    `
  },

  "user-guide": {
    title: "User Guide",
    content: `
# User Guide

Learn how to use Study Buddy effectively.

## The learning flow

Study Buddy has three phases:

### 1. Landing page

This is where you set up your session:

- **Topic input** — Type what you want to learn about (e.g. "Photosynthesis" or "How do databases work?")
- **Education level** — Choose from Elementary School through Graduate. This controls how complex the explanations are.
- **Topic suggestions** — Click one of the quick-start topics (Basketball, Machine Learning, Personal Finance) to fill in the input.
- **Teaching strategy** — Choose how the tutor should interact with you (see Features for details).
- **Make me think** — Tick this to add reflection prompts to every response.
- **Search the web** — On by default. Untick to skip web search.
- **Paste your own material** — Click to open a text area where you can paste lecture notes, textbook excerpts, or other material.

When you paste notes, you can choose:
- **Add to web search results** — Your notes are used alongside web sources
- **Use only my notes** — Web search is skipped; the tutor teaches only from your material

### 2. Preparation phase

After you press the submit button, Study Buddy shows a progress screen:

- **Searching for sources** — Finds relevant web pages
- **Reading web pages** — Extracts the content
- **Summarising sources to fit** — Only appears if the content is too large for your AI model
- **Preparing your tutor** — Builds the teaching prompt

If web search is off, the search and reading steps are skipped.

### 3. Chat

The main learning experience:

- The tutor greets you and presents the topic
- You ask follow-up questions by typing or using the microphone
- The tutor responds based on the source material
- You can switch teaching strategies using the small buttons above the input
- Hover over a tutor response to see the speaker icon — click it to hear the response read aloud

## Source attribution

Below the topic heading, you will see a line like:

"Based on 5 web sources" or "Based on your notes"

Click "View sources" to expand the list of web pages that were used. This tells you where the information came from.

## When there are no sources

If you turn off web search and do not paste notes, the tutor teaches from its own knowledge. A warning appears:

"No web sources or notes provided. The tutor is teaching from its own knowledge, which may not always be accurate. Check important facts independently."

The AI model may get things wrong when it has no sources to ground its answers. Use this mode with caution.

## Tips for better sessions

- **Be specific with your topic.** "Explain how photosynthesis converts CO2 to glucose" works better than just "photosynthesis."
- **Use Quiz me** to test yourself after learning a concept.
- **Paste your lecture notes** and let the tutor explain them at your level.
- **Try different strategies.** If Explain feels passive, switch to Socratic or Devil's advocate.
- **Turn on "Make me think"** to force yourself to engage with every response.
    `
  },

  features: {
    title: "Features",
    content: `
# Features

## Learning strategies

Study Buddy offers eight teaching strategies. You choose one on the landing page and can switch at any time during the conversation.

### Explain (default)
The tutor teaches the topic with clear explanations, examples, and analogies appropriate for your education level. It checks understanding before moving on. This is the most familiar mode — like a patient teacher explaining a concept.

### Quiz me
The tutor becomes a quiz master. It asks you questions drawn from the source material, one at a time. If you answer wrong, it gives you a hint — not the answer. After 2-3 wrong attempts, it guides you to the answer. It keeps a running score. This is active recall, the most evidence-backed learning technique.

### Socratic
The tutor never gives direct answers. Instead, it responds with questions that guide your thinking: "What do you think happens when...?", "If that were true, what would follow?" This forces you to reason through concepts rather than passively absorbing them. Best for conceptual topics.

### Devil's advocate
The tutor takes the opposing view to whatever you say. If you state a common position, it challenges you to defend it. When you make a strong argument, it acknowledges it. This sharpens your thinking and is excellent for essay prep, debate prep, or any topic with multiple valid perspectives.

### Perspectives
The tutor presents the topic through at least three different professional lenses — for example, how a marketer, engineer, and legal counsel would each think about the same issue. Then it asks which perspective resonates with you and why. Good for business topics, ethics, and policy.

### Feynman
Named after physicist Richard Feynman's learning technique. The tutor gives a brief overview, then asks you to explain the concept back in simple words — as if teaching a 10-year-old. It evaluates your explanation, points out gaps, and asks you to try again until your understanding is solid. Forces deep comprehension.

### Spaced recall
The tutor teaches a concept, moves on to the next one, then circles back: "Earlier we discussed X. Without looking back, can you explain...?" This mimics spaced repetition within a single session. The forgetting is the point — retrieving information under difficulty strengthens your memory.

### Worked examples
Best for STEM, maths, and problem-solving topics. The tutor solves a problem step by step, then presents a similar problem for you to solve. If you get stuck, it hints at the specific step — not the whole solution. Difficulty increases gradually.

## Make me think (reflection prompts)

When turned on, every tutor response ends with a bold reflection prompt:
- "Does this match what you expected?"
- "Can you explain this back to me in your own words?"
- "What still feels unclear?"
- "How does this connect to something you already know?"

These prompts interrupt passive reading and push you to actively engage with the material. They rotate so you do not see the same one twice in a row.

## Audio

### Voice input (microphone)
Click the microphone button next to the text input to speak your question instead of typing. Press it once to start recording, press again to stop. Your spoken words appear in the text input, where you can edit them before sending.

Two voice input methods are available (configurable in Settings):
- **Online (Google)** — Fast and accurate. Uses the browser's built-in speech recognition. Your audio is processed by Google's servers (no account needed).
- **Local (Whisper)** — Fully private. Runs a speech recognition model on your computer. Requires a one-time 40 MB download. Slightly slower.

### Read aloud (speaker)
Hover over any tutor response to see a speaker icon in the top right corner. Click it to have the response read aloud using your computer's built-in voices. Click again to stop.

You can also turn on "Read responses aloud automatically" in Settings, and every new tutor response will be read aloud as soon as it finishes.

Voice selection (male or female) is available in Settings.

## Paste your own notes

Click "Paste your own material" on the landing page to open a text area. You can paste lecture notes, textbook excerpts, assignment briefs, or any other text. The tutor will use this material alongside web sources (or instead of web sources if you choose "Use only my notes").

This means you do not need to upload files in specific formats. Just copy and paste text. The tutor works with whatever you give it.

## Auto-summarise

If the total content (web sources plus your notes) is too large for your AI model's context window, Study Buddy automatically summarises the web sources to fit. You will see a "Summarising sources to fit..." step in the preparation phase when this happens. You do not need to configure anything.

## Web search toggle

On the landing page, you can untick "Search the web" to skip web search entirely. This is useful when:
- You want the tutor to teach only from your pasted notes
- You are offline
- You want a quick conversation without waiting for sources
    `
  },

  settings: {
    title: "Settings",
    content: `
# Settings

Access Settings from the navigation bar at the top of the app.

## AI Provider

### Provider
Choose which AI service to use:
- **Ollama (Local)** — Free. Runs on your computer. Recommended for privacy.
- **OpenAI** — Requires a secret key. Uses GPT models.
- **Anthropic (Claude)** — Requires a secret key.
- **Google (Gemini)** — Requires a secret key.
- **Groq** — Requires a secret key. Fast inference.
- **OpenRouter** — Requires a secret key. Access to hundreds of models from many providers through one key.
- **Together AI** — Requires a secret key. Open-source models.

### Secret key
Your authentication key for cloud providers. Leave empty for local Ollama (unless your Ollama instance requires authentication).

This key is stored only on your computer in the app's local storage. It is never sent anywhere except to the provider you chose.

### Server address
The URL where your AI provider is running. For Ollama, this is usually http://localhost:11434. For cloud providers, the default is filled in automatically.

### AI Brain
The specific model to use. Click the "Refresh" button to see available models from your provider, or type a model name directly. For Ollama, common choices include llama3.1:8b, mistral, and gemma2.

## Web Search

### Search provider
Choose how Study Buddy finds web sources:
- **DuckDuckGo (Free)** — No secret key needed. Good default.
- **Brave Search** — Requires a secret key.
- **Serper (Google Search)** — Requires a secret key.
- **Bing Search** — Requires a secret key.
- **SearXNG (Self-hosted)** — Requires a server address.
- **Disabled** — No web search. The tutor uses only your notes or its own knowledge.

Use the "Test" button to verify your search configuration is working.

## Defaults

### Default education level
The education level that is pre-selected when you start a new conversation. You can still change it each time.

## Audio

### Tutor voice
Choose Male or Female. This uses your computer's built-in voices. Quality varies by operating system — macOS generally has the best voices.

### Read responses aloud automatically
When turned on, every new tutor response is read aloud as soon as it finishes. You can always click the speaker icon on individual responses regardless of this setting.

### Voice input method
Choose how the microphone button works:

**Online (Google, via browser)**
Uses your browser's built-in speech recognition, which sends audio to Google's servers for processing. Fast and accurate. No account or secret key needed. This is the same technology used by voice typing in Google Docs.

**Local (Whisper, private)**
Runs a Whisper speech recognition model entirely on your computer. Your audio never leaves your machine. Requires a one-time download of about 40 MB. Transcription takes a few seconds per phrase instead of being instant.

You can download the Whisper model in advance from the Settings page, or it will download automatically the first time you use the microphone with Local mode selected.

## Saving settings

Click "Save and apply" to save your changes. Settings take effect immediately — no restart needed. Click "Reset to defaults" to restore all settings to their original values.
    `
  },

  troubleshooting: {
    title: "Troubleshooting",
    content: `
# Troubleshooting

## Quick checklist

1. **Check Settings** — Is your AI provider configured with the right server address and secret key?
2. **Test the connection** — Click the Refresh button next to AI Brain to see if your provider responds.
3. **Restart the app** — Close and reopen Study Buddy.
4. **Check your internet** — Needed for web search and cloud AI providers.

## Common problems

### Nothing happens after I submit a topic
- Check that your AI provider is running. If using Ollama, make sure it is started (run "ollama serve" in a terminal).
- Check the server address in Settings. For Ollama, it should be http://localhost:11434.
- Try the Refresh button to verify the connection.

### The tutor gives very short or unhelpful answers
- Try a larger model. Small models (under 7B parameters) may struggle with complex topics or strategies like Quiz and Socratic.
- Make sure web search is turned on so the tutor has source material to work from.
- Try the Explain strategy first — it is the most reliable with small models.

### Quiz me mode still gives explanations instead of questions
- Small local models sometimes ignore instructions. Try a larger model (13B+ parameters) or a cloud provider.
- The quiz prompt is designed to be forceful, but very small models may still default to explaining.

### Search returns no results
- Check your internet connection.
- If using DuckDuckGo, try again in a moment (it rate-limits frequent requests).
- Try a different search provider in Settings.
- Use the Test button to verify your search configuration.

### The microphone button does not work
- Make sure you have given the app permission to use your microphone. Your operating system may show a permission prompt.
- If using Local (Whisper) mode, the model needs to download first (about 40 MB). Check the console for download progress.
- Try switching to Online mode in Settings to test if the issue is with Whisper specifically.

### Read aloud does not produce any sound
- Check that your computer's volume is turned up.
- Some operating systems have limited built-in voices. macOS generally works best.
- Try switching between Male and Female in Settings to find a working voice.

### The app says "Could not find a production build"
- This is an Electron startup issue. Run "npm run build" first, then try again.
- For development, use "npm run electron-dev" which handles this automatically.

### Settings are not saving
- Check that the app can write to your user directory.
- Try the "Reset to defaults" button and reconfigure.
- Settings are stored in your browser's local storage and in the app's data directory.

## Platform-specific issues

### macOS
- **Security warning on first launch** — Right-click the app, then click Open to bypass Gatekeeper.
- **Microphone permission** — Go to System Settings, then Privacy & Security, then Microphone. Make sure Study Buddy is allowed.

### Windows
- **App does not start** — Try running as Administrator.
- **Antivirus blocks the app** — Add Study Buddy to your antivirus exclusions.

### Linux
- **AppImage does not run** — Make it executable: chmod +x StudyBuddy-*.AppImage
- **Missing FUSE** — Install with: sudo apt install fuse

## Getting help

- **GitHub Issues** — Report bugs at github.com/michael-borck/study-buddy/issues
- **Discussions** — Ask questions at github.com/michael-borck/study-buddy/discussions
    `
  },

  shortcuts: {
    title: "Keyboard Shortcuts",
    content: `
# Keyboard Shortcuts

## Chat

| Shortcut | Action |
|----------|--------|
| **Enter** | Send your message |
| **Shift + Enter** | New line in your message |

## Navigation

| Shortcut | Action |
|----------|--------|
| **Tab** | Move to the next interactive element |
| **Shift + Tab** | Move to the previous element |
| **Space** | Activate the focused button |
| **Escape** | Close open panels or stop audio |

## Text editing

| Shortcut | Action |
|----------|--------|
| **Ctrl/Cmd + C** | Copy selected text |
| **Ctrl/Cmd + V** | Paste from clipboard |
| **Ctrl/Cmd + A** | Select all text in the input |
| **Ctrl/Cmd + Z** | Undo last text change |

## Tips

- **Enter** sends your message. Use **Shift + Enter** if you need a line break.
- **Tab** through the strategy buttons to switch strategies with the keyboard.
- Use **Ctrl/Cmd + F** to search within the current page (useful in long tutor responses).
    `
  },

  technical: {
    title: "Technical Overview",
    content: `
# Technical Overview

## Architecture

Study Buddy is a hybrid desktop application:

- **Frontend**: Next.js 14 with React, TypeScript, and Tailwind CSS
- **Desktop**: Electron wraps the Next.js app as a native application
- **Design**: Studio Calm design system (shared with Talk Buddy)
- **AI**: Provider-agnostic — supports Ollama, OpenAI, Anthropic, Google, Groq, Together AI
- **Search**: DuckDuckGo (default), Brave, Bing, Serper, SearXNG
- **Audio**: Web Speech API for TTS/STT, optional Transformers.js for local Whisper STT

## How a session works

### 1. Search
User submits a topic. The /api/getSources endpoint queries the configured search engine and returns up to 9 URLs.

### 2. Parse
The /api/getParsedSources endpoint fetches each URL, extracts readable text using Mozilla Readability, and cleans it.

### 3. Auto-summarise (conditional)
If total content exceeds 20,000 characters, the /api/summariseSources endpoint sends each source through the LLM with a "summarise in 200-300 words" prompt. Sources are summarised in parallel.

### 4. System prompt construction
The getSystemPrompt function in utils/utils.ts builds the system message from:
- Parsed (or summarised) source content
- User-pasted notes (if any)
- Education level
- Teaching strategy prompt (from utils/strategies.ts)
- Reflection prompt (if "Make me think" is enabled)

### 5. Streaming chat
The /api/getChat endpoint sends the messages to the configured LLM provider and streams the response back via Server-Sent Events.

### 6. Mid-conversation strategy switching
When the user changes strategy or toggles reflection prompts during a conversation, the system prompt (messages[0]) is rebuilt with the new strategy. The conversation history is preserved.

## Teaching strategies

Strategies are defined in utils/strategies.ts. Each strategy is a prompt paragraph that tells the LLM how to behave. The Quiz and Socratic strategies use forceful "CRITICAL INSTRUCTION" formatting to ensure small local models follow them.

## Audio architecture

### Text-to-Speech
Uses the browser's speechSynthesis API. Voices are provided by the operating system. The app heuristically groups available English voices into male and female categories by name.

### Speech-to-Text (Web)
Uses the browser's SpeechRecognition API (webkit-prefixed in Chromium). Audio is sent to Google's servers for processing. Returns interim and final transcription results.

### Speech-to-Text (Whisper)
Uses @xenova/transformers to run the Whisper tiny model (~40 MB) in the browser via ONNX Runtime WebAssembly. Audio is recorded via MediaRecorder, converted to a 16kHz Float32Array, and fed to the model. Fully local — no network calls.

## Project structure

study-buddy/
- app/ — Next.js App Router
  - api/getChat/ — LLM streaming endpoint
  - api/getSources/ — Web search endpoint
  - api/getParsedSources/ — Content extraction
  - api/summariseSources/ — LLM-based source summarisation
  - api/models/ — Model discovery
  - api/settings/ — Settings persistence
  - settings/ — Settings page
  - about/ — About page
  - docs/ — This documentation
  - legal/ — Licences and acknowledgments
  - page.tsx — Main tutor interface
- components/ — React components
  - Header, Footer, Hero — Landing page
  - Chat — Conversation view with audio controls
  - FinalInputArea — Follow-up input
  - InitialInputArea — Topic input
  - PreparationPhase — Progress steps
- utils/
  - providers/ — LLM provider abstractions (Ollama, OpenAI, etc.)
  - strategies.ts — Teaching strategy definitions
  - speech.ts — TTS, STT, audio recording
  - settings.ts — Settings management
  - utils.ts — System prompt builder, text cleaning
- main.js — Electron main process

## API endpoints

### POST /api/getChat
Streams an AI response. Accepts a messages array. Returns Server-Sent Events.

### POST /api/getSources
Searches the web. Accepts a question string. Returns an array of {name, url} objects.

### POST /api/getParsedSources
Fetches and extracts text from URLs. Accepts a sources array. Returns sources with fullContent.

### POST /api/summariseSources
Summarises source content via the LLM. Accepts a sources array with fullContent. Returns sources with summarised fullContent.

### GET/POST /api/settings
Retrieves or updates application settings.

### POST /api/models
Discovers available models from the configured provider.

## Configuration headers

All API endpoints accept an X-StudyBuddy-Settings header containing JSON-encoded settings. This allows the frontend to pass runtime settings (including secret keys) to the backend without storing them server-side.
    `
  },

  development: {
    title: "Development",
    content: `
# Development Guide

## Prerequisites

- Node.js 18+
- npm
- (Optional) Ollama for local AI

## Quick start

# Clone and install
git clone https://github.com/michael-borck/study-buddy.git
cd study-buddy
npm install

# Run in development mode (Next.js + Electron with hot reload)
npm run electron-dev

# Or run Next.js only (opens in browser at localhost:3000)
npm run dev

## Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start Next.js development server |
| npm run electron-dev | Start Next.js + Electron with hot reload |
| npm run build | Build Next.js for production |
| npm run dist | Build Electron distributables |
| npm run lint | Run ESLint |

## Environment variables

You can configure defaults via environment variables, but most users will use the in-app Settings page instead.

| Variable | Default | Description |
|----------|---------|-------------|
| LLM_PROVIDER | ollama | AI provider name |
| OLLAMA_BASE_URL | http://localhost:11434 | Ollama server address |
| OLLAMA_MODEL | llama3.1:8b | Default model |
| SEARCH_ENGINE | disabled | Search engine |

## Code style

- TypeScript strict mode
- ESLint + Prettier
- Tailwind CSS utility-first
- Studio Calm design tokens (see app/globals.css)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run npm run build to verify
5. Open a pull request

See the GitHub repository for full contribution guidelines.
    `
  },
};

const navigationItems = [
  { id: 'overview', title: 'Overview', icon: '📖' },
  { id: 'user-guide', title: 'User Guide', icon: '👤' },
  { id: 'features', title: 'Features', icon: '⭐' },
  { id: 'settings', title: 'Settings', icon: '⚙️' },
  { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' },
  { id: 'shortcuts', title: 'Shortcuts', icon: '⌨️' },
  { id: 'technical', title: 'Technical', icon: '🔬' },
  { id: 'development', title: 'Development', icon: '💻' },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentContent = docsContent[activeSection as keyof typeof docsContent] || docsContent.overview;

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-hairline bg-paper transition-transform duration-slow lg:static lg:inset-0 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-hairline p-4 lg:hidden">
              <h2 className="text-lg font-semibold text-ink">Documentation</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-soft p-2 text-ink-quiet transition-colors duration-normal hover:text-ink"
              >
                &times;
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              <h2 className="mb-4 hidden text-lg font-semibold text-ink lg:block">Documentation</h2>

              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex w-full items-center rounded-soft px-3 py-2 text-sm transition-colors duration-normal ${
                    activeSection === item.id
                      ? 'border-r-2 border-accent bg-accent-soft font-medium text-ink'
                      : 'text-ink-muted hover:bg-accent-soft hover:text-ink'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </nav>

            <div className="border-t border-hairline p-4">
              <div className="space-y-1 text-xs text-ink-quiet">
                <p>In-app documentation</p>
                <p>Always up-to-date</p>
                <p>Search with Ctrl+F</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-ink/60 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="sticky top-0 z-30 border-b border-hairline bg-paper lg:hidden">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-soft p-2 text-ink-quiet transition-colors duration-normal hover:text-ink"
              >
                <span className="sr-only">Open sidebar</span>
                &#9776;
              </button>
              <h1 className="text-lg font-semibold text-ink">{currentContent.title}</h1>
              <div className="w-10" />
            </div>
          </div>

          <main className="flex-1">
            <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
              <div className="rounded-soft border border-hairline p-8">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-ink">
                    {currentContent.content.split('\n').map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={index} className="mb-4 mt-8 text-3xl font-semibold text-ink first:mt-0">{line.substring(2)}</h1>;
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={index} className="mb-3 mt-6 text-2xl font-semibold text-ink">{line.substring(3)}</h2>;
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={index} className="mb-2 mt-5 text-xl font-medium text-ink">{line.substring(4)}</h3>;
                      }

                      if (line.startsWith('')) {
                        return null;
                      }

                      if (line.startsWith('- ')) {
                        return <li key={index} className="ml-4 text-ink-muted">{line.substring(2)}</li>;
                      }

                      if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                          <p key={index} className="mb-2 text-ink-muted">
                            {parts.map((part, i) =>
                              i % 2 === 1 ? <strong key={i} className="font-semibold text-ink">{part}</strong> : part
                            )}
                          </p>
                        );
                      }

                      if (line.includes('[') && line.includes('](')) {
                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                        const parts = line.split(linkRegex);
                        return (
                          <p key={index} className="mb-2 text-ink-muted">
                            {parts.map((part, i) => {
                              if (i % 3 === 1) {
                                return <a key={i} href={parts[i + 1]} className="text-ink underline transition-colors duration-normal hover:text-accent" target="_blank" rel="noopener noreferrer">{part}</a>;
                              } else if (i % 3 === 2) {
                                return null;
                              }
                              return part;
                            })}
                          </p>
                        );
                      }

                      if (line.trim()) {
                        return <p key={index} className="mb-2 text-ink-muted">{line}</p>;
                      }

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
