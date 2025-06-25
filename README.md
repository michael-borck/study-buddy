# Study Buddy AI

> 🎓 An open-source AI personal tutor that runs locally on your computer
> 
> Based on [Llama Tutor](https://github.com/Nutlope/llamatutor) by [@nutlope](https://github.com/nutlope)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-Latest-9FEAF9)](https://www.electronjs.org/)

## About

Study Buddy is a desktop application that provides personalized AI tutoring without requiring internet access, accounts, or risking API abuse. It's a fork of the excellent Llama Tutor project, enhanced with:

- 🔌 **Provider-agnostic architecture** - Use Ollama (local), OpenAI, Together AI, or others
- 🖥️ **Desktop application** - Runs securely on your computer via Electron
- 🔒 **Privacy-first** - Default local mode means your data never leaves your device
- 💰 **Free to use** - No API costs with local Ollama mode
- 🎯 **Student-focused** - Simple interface designed for learners

## Features

- 📚 Generate comprehensive tutorials on any topic
- 🔍 Smart search integration for enriched content
- 💬 Interactive chat for follow-up questions
- 🎨 Clean, intuitive interface
- 📱 Works offline after initial setup
- ⚡ Fast local inference with Ollama

## Installation

### Prerequisites

- Node.js 18+ installed
- (Optional) [Ollama](https://ollama.com/) for local AI - recommended for students

### Quick Start

1. **Download the latest release** from the [Releases page](https://github.com/michael-borck/study-buddy/releases)
   - Windows: `StudyBuddy-Setup-x.x.x.exe`
   - macOS: `StudyBuddy-x.x.x.dmg`
   - Linux: `StudyBuddy-x.x.x.AppImage`

2. **Install and run** - that's it! Study Buddy will use Ollama if installed, or prompt for API configuration.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/michael-borck/study-buddy.git
cd study-buddy

# Install dependencies
npm install

# Run in development mode
npm run electron-dev

# Build for production
npm run electron-pack
```

## Configuration

### AI Providers

Study Buddy supports multiple AI providers. Configure in Settings or via environment variables:

#### Local (Recommended for Students)
```env
AI_PROVIDER=ollama
# No API key needed! Just install Ollama
```

#### OpenAI
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
```

#### Together AI
```env
AI_PROVIDER=together
TOGETHER_API_KEY=your_api_key_here
```

### Adding New Providers

1. Create a new provider in `utils/providers/`
2. Implement the `LLMProvider` interface
3. Add to the provider factory in `utils/provider-factory.ts`

## Usage

1. **Launch Study Buddy** from your Applications/Programs
2. **Enter a topic** you want to learn about
3. **Click "Generate"** to create your personalized tutorial
4. **Ask follow-up questions** in the chat interface
5. **Save or export** your sessions for later review

## For Educators

Study Buddy can be deployed institution-wide:

- **Self-hosted option**: Deploy the web version on your school's servers
- **Managed API keys**: Configure with your institution's API keys
- **Custom models**: Use your preferred AI models
- **Usage analytics**: Monitor usage with built-in observability

See our [Educator's Guide](docs/EDUCATORS.md) for deployment instructions.

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Desktop**: Electron
- **AI Integration**: Configurable providers (Ollama, OpenAI, Together AI)
- **Search**: Tavily API for enriched content
- **Analytics**: Helicone (optional)
- **Database**: Supabase (optional, for web deployment)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Fork the repo, then:
git clone https://github.com/michael-borck/study-buddy.git
cd study-buddy
npm install
npm run dev
```

## Roadmap

- [ ] Additional AI provider support (Anthropic, Cohere, local GGUF)
- [ ] Collaborative study sessions
- [ ] PDF/Document upload and analysis
- [ ] Study progress tracking
- [ ] Flashcard generation
- [ ] Mobile app (React Native)

## Credits

Study Buddy is based on [Llama Tutor](https://github.com/Nutlope/llamatutor) by Hassan El Mghari ([@nutlope](https://github.com/nutlope)). The original project showcased the power of AI in education, and we're building on that foundation to make it accessible to all students.

See our [ACKNOWLEDGMENTS.md](ACKNOWLEDGMENTS.md) for a comprehensive list of all the amazing open source projects that make Study Buddy possible.

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Note**: This is an independent fork and is not officially associated with the original Llama Tutor project.