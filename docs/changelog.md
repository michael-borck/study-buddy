# Changelog

All notable changes to Study Buddy will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive in-app documentation system with navigation
- Complete GitHub Pages documentation structure
- Technical architecture and API documentation
- User experience and design system guides
- Troubleshooting and development setup guides

### Changed
- Updated homepage branding from "Powered by Llama 3.1 and Together AI" to "Powered by your imagination and AI" ✨
- Removed "U.S History" suggestion button for cleaner interface

## [0.2.0] - 2024-06-25

### Added
- Complete Study Buddy rebranding from LlamaTutor
- Comprehensive About and Legal pages with proper attribution
- DuckDuckGo and Brave search engine integration
- Graduation cap emoji 🎓 logo throughout application
- Complete Electron icon set with ImageMagick-generated designs
- Cross-platform icon configuration (macOS ICNS, Windows ICO, Linux PNG)
- Settings persistence with file storage for Electron
- Initialize settings component for app startup

### Changed
- Updated all branding references from "LlamaTutor" to "Study Buddy"
- Updated GitHub repository links to michael-borck/study-buddy
- Updated social media links to @Michael_Borck accounts
- Added LinkedIn and personal website links to footer
- Replaced SVG logo with graduation cap emoji in Header, Footer, and Chat components

### Removed
- All analytics tracking (Plausible and Helicone) for privacy-first approach
- Helicone-related variables and references throughout codebase
- Together AI logo and external link from homepage banner

### Fixed
- Education level loading and persistence on application startup
- DuckDuckGo search implementation with proper URL parsing
- Settings state management with proper event handling

## [0.1.0] - 2024-06-24

### Added
- Initial Study Buddy release with AI tutoring capabilities
- Multi-provider AI support (OpenAI, Together AI, Custom endpoints)
- Multiple search engine integration (Bing, Serper, SearXNG)
- Adaptive learning levels (Elementary through Graduate)
- Privacy-first architecture with local data storage
- Cross-platform Electron desktop application
- Real-time streaming AI responses
- Source-cited information retrieval
- Flexible configuration system
- Modern responsive web interface

### Features
- **AI Tutoring**: Personalized conversations adapted to education level
- **Research Integration**: Web search with content parsing and citation
- **Privacy Protection**: No external tracking, local data storage
- **Multi-Platform**: Windows, macOS, and Linux support
- **Extensible**: Plugin-friendly architecture for future enhancements

---

## Release Notes

### Version 0.2.0 Highlights

This release focuses on rebranding, user experience improvements, and privacy enhancements:

**🎓 Complete Rebranding**
- Transitioned from LlamaTutor to Study Buddy with new visual identity
- Custom graduation cap icons for all platforms
- Updated all user-facing text and branding elements

**🛡️ Privacy-First Approach**
- Removed all analytics and tracking systems
- Implemented transparent, privacy-focused architecture
- Added clear attribution and open source acknowledgments

**🔍 Enhanced Search Capabilities**
- Added DuckDuckGo integration (no API key required)
- Added Brave Search support for ad-free results
- Improved search result parsing and error handling

**⚙️ Better Configuration Management**
- Persistent settings across app restarts
- Improved education level handling
- Enhanced error reporting and troubleshooting

### Version 0.1.0 Highlights

The initial release established Study Buddy as a comprehensive AI tutoring platform:

**🤖 AI-Powered Learning**
- Support for multiple AI providers with streaming responses
- Adaptive content based on education level selection
- Interactive conversation flow with follow-up questions

**🔬 Research Integration**
- Multi-engine search capabilities
- Automatic content extraction and processing
- Source verification and citation

**🖥️ Desktop Application**
- Native Electron app for Windows, macOS, and Linux
- Web version for universal access
- Responsive design for all screen sizes

**🔧 Developer Experience**
- Open source codebase with MIT license
- Comprehensive API documentation
- Extensible architecture for community contributions

---

## Upgrade Instructions

### From 0.1.0 to 0.2.0

1. **Download New Version**: Get the latest release from GitHub
2. **Backup Settings**: Your settings will be preserved, but backup recommended
3. **Install**: Follow standard installation process for your platform
4. **Verify Configuration**: Check Settings page for any required updates
5. **Enjoy New Features**: Explore the About and Legal pages for new information

### Fresh Installation

1. **Download**: Get the latest version from [GitHub Releases](https://github.com/michael-borck/study-buddy/releases)
2. **Install**: Run the installer for your platform
3. **Configure**: Set up AI provider and search engine in Settings
4. **Learn**: Visit the About page to understand all available features

---

## Roadmap

### Upcoming Features (v0.3.0)
- Enhanced learning analytics (privacy-preserving)
- Export capabilities for conversations and notes
- Improved keyboard shortcuts and accessibility
- Additional AI provider integrations
- Custom prompt templates

### Future Enhancements
- Multi-modal input support (images, documents)
- Collaborative learning features
- Offline mode capabilities
- Plugin system for community extensions
- Mobile app development

---

*For detailed technical changes, see the [commit history](https://github.com/michael-borck/study-buddy/commits/main) on GitHub.*