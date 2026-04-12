"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-soft border border-hairline p-8">
          <h1 className="text-3xl font-semibold text-ink mb-8">Legal and Open Source Acknowledgments</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-ink-muted mb-8" style={{ lineHeight: 1.7 }}>
              Study Buddy is built upon the incredible work of many open source projects and contributors.
              We are deeply grateful to all the developers, maintainers, and communities who have made this project possible.
            </p>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Original project</span>
            </div>
            <div className="mb-8 rounded-soft border border-accent bg-accent-soft p-6">
              <h3 className="mb-2 text-xl font-semibold text-ink">
                <a
                  href="https://github.com/Nutlope/llamatutor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors duration-normal hover:text-accent"
                >
                  Llama Tutor
                </a>
              </h3>
              <p className="mb-2 text-ink-muted">
                by <a
                  href="https://github.com/nutlope"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline transition-colors duration-normal hover:text-accent"
                >
                  Hassan El Mghari (@nutlope)
                </a>
              </p>
              <p className="mb-2 text-sm text-ink-muted"><strong className="text-ink">Licence:</strong> MIT</p>
              <p className="mb-2 text-sm text-ink-muted">
                <strong className="text-ink">Description:</strong> The original AI-powered personalised tutor that inspired Study Buddy
              </p>
              <p className="text-sm text-ink-muted">
                <strong className="text-ink">Our contribution:</strong> Fork with provider abstraction, Electron desktop app, and student-focused enhancements
              </p>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Core framework and build tools</span>
            </div>
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    Next.js
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Vercel Inc. &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">The React framework for production (v14.2.3)</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    React
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Meta (Facebook) &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">JavaScript library for building user interfaces</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://www.electronjs.org/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    Electron
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">OpenJS Foundation &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Cross-platform desktop apps (v36.5.0)</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    TypeScript
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Microsoft &middot; Apache-2.0 Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Strongly typed programming language</p>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">UI and styling</span>
            </div>
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    Tailwind CSS
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Tailwind Labs Inc. &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Utility-first CSS framework (v3.4.1)</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://headlessui.com/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    Headless UI
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Tailwind Labs Inc. &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Unstyled, accessible UI components</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://react-hot-toast.com/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    React Hot Toast
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Tim Neutkens &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">React notifications library</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://github.com/remarkjs/react-markdown" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    React Markdown
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Titus Wormer &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Markdown component for React</p>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">AI and LLM integration</span>
            </div>
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://github.com/openai/openai-node" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    OpenAI Node.js Library
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">OpenAI &middot; Apache-2.0 Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Official Node.js library for OpenAI API</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://github.com/togethercomputer/together-typescript" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    Together AI SDK
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Together Computer &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">TypeScript SDK for Together AI&apos;s API</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://github.com/rexxars/eventsource-parser" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    eventsource-parser
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Espen Hovlandsdal &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Streaming parser for server-sent events</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://github.com/belladoreai/llama3-tokenizer-js" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    llama3-tokenizer-js
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Belladore AI &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">JavaScript tokeniser for Llama 3 models</p>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Data validation and content processing</span>
            </div>
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://zod.dev/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    Zod
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Colin McDonnell &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">TypeScript-first schema validation</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://github.com/mozilla/readability" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    @mozilla/readability
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Mozilla &middot; Apache-2.0 Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Readability library from Firefox Reader Mode</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://github.com/jsdom/jsdom" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    jsdom
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">jsdom Contributors &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">JavaScript implementation of DOM and HTML standards</p>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Development tools</span>
            </div>
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://www.electron.build/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    Electron Builder
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Stefan Judis &amp; Contributors &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Package and build Electron apps</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://eslint.org/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    ESLint
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">ESLint Team &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Find and fix JavaScript code problems</p>
              </div>

              <div className="rounded-soft border border-hairline p-4">
                <h3 className="font-semibold text-ink">
                  <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">
                    Prettier
                  </a>
                </h3>
                <p className="text-sm text-ink-quiet">Prettier Team &middot; MIT Licence</p>
                <p className="mt-1 text-sm text-ink-muted">Opinionated code formatter</p>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">AI providers and services</span>
            </div>
            <div className="mb-8 rounded-soft border border-hairline p-6">
              <h3 className="mb-3 font-semibold text-ink">Special thanks to AI providers</h3>
              <ul className="space-y-2 text-ink-muted">
                <li>
                  <a href="https://ollama.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline transition-colors duration-normal hover:text-accent">
                    Ollama
                  </a> &mdash; For making local AI accessible to everyone
                </li>
                <li>
                  <a href="https://github.com/searxng/searxng" target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline transition-colors duration-normal hover:text-accent">
                    SearXNG
                  </a> &mdash; Open source metasearch engine for privacy-focused search
                </li>
                <li><strong className="text-ink">OpenAI, Anthropic, Google, Groq, Together AI</strong> &mdash; For their AI APIs that power cloud-based tutoring</li>
              </ul>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Licence information</span>
            </div>
            <div className="mb-8 rounded-soft border border-hairline p-6">
              <h3 className="mb-3 font-semibold text-ink">Study Buddy Licence</h3>
              <p className="mb-4 text-ink-muted">
                Study Buddy is released under the <strong className="text-ink">MIT Licence</strong>, which is compatible with all the
                dependencies listed above. We ensure full compliance with all upstream licences.
              </p>

              <h3 className="mb-3 font-semibold text-ink">Type definitions</h3>
              <p className="text-ink-muted">
                We also rely on numerous @types/* packages maintained by the{" "}
                <a
                  href="https://github.com/DefinitelyTyped/DefinitelyTyped"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline transition-colors duration-normal hover:text-accent"
                >
                  DefinitelyTyped
                </a>{" "}
                community, including @types/node, @types/react, @types/react-dom, and @types/jsdom.
              </p>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Contributing back</span>
            </div>
            <p className="mb-6 text-ink-muted">
              We believe in giving back to the open source community. Study Buddy contributes by demonstrating
              practical AI application patterns, showing how to build privacy-first educational tools, providing
              examples of Electron + Next.js integration, and creating student-accessible AI tutoring solutions.
            </p>

            <div className="rounded-soft border border-accent bg-accent-soft p-6">
              <h3 className="mb-3 font-semibold text-ink">Thank you</h3>
              <p className="text-sm text-ink-muted">
                Thank you to every developer, maintainer, and contributor who has made Study Buddy possible.
                Open source is the foundation of innovation, and we&apos;re proud to be part of this incredible ecosystem.
              </p>
              <p className="mt-3 text-xs text-ink-quiet">
                If we&apos;ve missed any attribution or you&apos;d like to update information about your project,
                please open an issue or pull request on our GitHub repository.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
