# Study Buddy

<!-- BADGES:START -->
[![ai-tutor](https://img.shields.io/badge/-ai--tutor-blue?style=flat-square)](https://github.com/topics/ai-tutor) [![css](https://img.shields.io/badge/-css-1572b6?style=flat-square)](https://github.com/topics/css) [![desktop-application](https://img.shields.io/badge/-desktop--application-blue?style=flat-square)](https://github.com/topics/desktop-application) [![electron](https://img.shields.io/badge/-electron-47848f?style=flat-square)](https://github.com/topics/electron) [![javascript](https://img.shields.io/badge/-javascript-f7df1e?style=flat-square)](https://github.com/topics/javascript) [![local-inference](https://img.shields.io/badge/-local--inference-blue?style=flat-square)](https://github.com/topics/local-inference) [![privacy-focused](https://img.shields.io/badge/-privacy--focused-blue?style=flat-square)](https://github.com/topics/privacy-focused) [![typescript](https://img.shields.io/badge/-typescript-3178c6?style=flat-square)](https://github.com/topics/typescript) [![offline-application](https://img.shields.io/badge/-offline--application-blue?style=flat-square)](https://github.com/topics/offline-application) [![edtech](https://img.shields.io/badge/-edtech-4caf50?style=flat-square)](https://github.com/topics/edtech)
<!-- BADGES:END -->

> An open-source AI personal tutor that runs entirely on your computer. Private by design. Bring your own model.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-Latest-9FEAF9)](https://www.electronjs.org/)

## Why Study Buddy?

Most AI tutoring tools require you to create an account, hand over your data, and pay a subscription. NotebookLM needs a Google account. ChatGPT needs OpenAI. DeepTutor needs uploads and cloud processing. They're powerful, but they're not private, and they're not yours.

Study Buddy takes a different approach:

**You own the whole stack.** The app runs on your laptop. The AI runs on your laptop (via Ollama). Your questions, your notes, your learning — none of it leaves your machine. There's no account to create, no data to leak, no subscription to cancel.

**It does one thing well.** Type a topic, get a grounded tutor. Study Buddy searches the web for sources, reads them, and uses that content to teach you — reducing hallucinations and keeping answers factual. It's a focused conversation, not a research platform. When the session ends, you take away what you learned. Like a real tutor.

**It's designed for students, not power users.** The interface uses plain language (not developer jargon), generous whitespace, and a calm visual style built specifically for university students — including ESL learners who are already spending mental energy working in a second language. Settings say "Secret key" not "API Key", "AI Brain" not "Model".

**Bring your own key, or don't.** Works with Ollama locally (free, no key needed) or any cloud provider you prefer — OpenAI, Anthropic, Google, Groq, Together AI. You choose where your data goes.

## How it works

Study Buddy is a simple grounded tutor — a lightweight RAG (retrieval-augmented generation) pipeline that runs fresh for each session:

1. **You type a topic** and choose an education level (Elementary through Graduate)
2. **Study Buddy searches the web** for relevant sources (DuckDuckGo by default — free, no key needed)
3. **It reads those pages** and extracts the content
4. **If the content is too large** for your model's context window, it auto-summarises the sources
5. **The AI teaches you** from that grounded material at your chosen level, with an interactive quiz-style conversation
6. **You ask follow-up questions** and the tutor responds in context

You can also paste your own notes (lecture slides, textbook excerpts) and the tutor will teach from those alongside the web sources.

There's no persistent knowledge base, no embeddings, no vector store. Each session starts fresh. The simplicity is deliberate — it keeps the app fast, private, and easy to understand.

## What it's not

Study Buddy is not trying to be NotebookLM, DeepTutor, or a general-purpose research assistant. It doesn't do multi-document analysis, audio generation, collaborative notebooks, or knowledge graphs. Those tools are excellent at what they do, but they require accounts, cloud processing, and complexity.

Study Buddy is for a student who wants to open an app, type "photosynthesis", and have a private, grounded conversation about it. Then close the app and get back to studying.

## Installation

### Download

Grab the latest release from the [Releases page](https://github.com/michael-borck/study-buddy/releases):

- **Windows:** `StudyBuddy-Setup-x.x.x.exe`
- **macOS:** `StudyBuddy-x.x.x.dmg`
- **Linux:** `StudyBuddy-x.x.x.AppImage`

### Set up a local AI (recommended)

1. Install [Ollama](https://ollama.com/)
2. Pull a model: `ollama pull llama3.1:8b`
3. Open Study Buddy — it connects to Ollama automatically

That's it. No account, no API key, no internet required after the model is downloaded.

### Or use a cloud provider

Open Settings and choose your provider (OpenAI, Anthropic, Google, Groq, Together AI). Add your secret key. Study Buddy works with any provider, but your questions will leave your machine.

## Development

```bash
git clone https://github.com/michael-borck/study-buddy.git
cd study-buddy
npm install
npm run electron-dev
```

### Project structure

```
study-buddy/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (chat, search, settings)
│   ├── settings/          # Settings page
│   └── page.tsx           # Main tutor interface
├── components/            # React components
├── utils/
│   └── providers/         # LLM provider integrations
├── main.js               # Electron main process
└── docs/                  # Documentation
```

### Technical stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Desktop:** Electron
- **Design:** Studio Calm (shared with [Talk Buddy](https://github.com/michael-borck/talk-buddy))
- **AI:** Ollama, OpenAI, Anthropic, Google, Groq, Together AI
- **Search:** DuckDuckGo (default), Brave, Bing, Serper, SearXNG

### Build for distribution

```bash
npm run build
npm run electron-pack
```

## The Buddy suite

Study Buddy is part of a family of apps for university students:

| App | Purpose | Accent colour |
|-----|---------|---------------|
| [Talk Buddy](https://github.com/michael-borck/talk-buddy) | Speech practice for high-stakes scenarios | Eucalyptus sage |
| **Study Buddy** | AI personal tutor | Dusty bluebell |
| Career Compass (planned) | Career guidance and interview prep | Warm ochre |

All three share the same design system ([Studio Calm](https://github.com/michael-borck/talk-buddy/blob/main/docs/design/studio-calm.md)) — same font, same warm palette, same calm interface. The only difference is the accent colour. A student who uses one recognises the others instantly.

## Credits

Study Buddy is based on [Llama Tutor](https://github.com/Nutlope/llamatutor) by Hassan El Mghari ([@nutlope](https://github.com/nutlope)). The original project demonstrated how simple and effective an AI tutor could be. Study Buddy builds on that foundation with local-first privacy, provider flexibility, and a design system built for the students who need it most.

## Licence

MIT — see [LICENSE](LICENSE).
