"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Legal & Open Source Acknowledgments</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Study Buddy is built upon the incredible work of many open source projects and contributors. 
              We are deeply grateful to all the developers, maintainers, and communities who have made this project possible.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Original Project</h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                <a 
                  href="https://github.com/Nutlope/llamatutor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Llama Tutor
                </a>
              </h3>
              <p className="text-blue-800 mb-2">
                by <a 
                  href="https://github.com/nutlope" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  Hassan El Mghari (@nutlope)
                </a>
              </p>
              <p className="text-blue-700 text-sm mb-2"><strong>License:</strong> MIT</p>
              <p className="text-blue-700 text-sm mb-2">
                <strong>Description:</strong> The original AI-powered personalized tutor that inspired Study Buddy
              </p>
              <p className="text-blue-700 text-sm">
                <strong>Our Contribution:</strong> Fork with provider abstraction, Electron desktop app, and student-focused enhancements
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Core Framework & Build Tools</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Next.js
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Vercel Inc. • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">The React framework for production (v14.2.3)</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    React
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Meta (Facebook) • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">JavaScript library for building user interfaces</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://www.electronjs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Electron
                  </a>
                </h3>
                <p className="text-sm text-gray-600">OpenJS Foundation • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">Cross-platform desktop apps (v36.5.0)</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    TypeScript
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Microsoft • Apache-2.0 License</p>
                <p className="text-sm text-gray-700 mt-1">Strongly typed programming language</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">UI & Styling</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Tailwind CSS
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Tailwind Labs Inc. • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">Utility-first CSS framework (v3.4.1)</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://headlessui.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Headless UI
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Tailwind Labs Inc. • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">Unstyled, accessible UI components</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://react-hot-toast.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    React Hot Toast
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Tim Neutkens • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">React notifications library</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://github.com/remarkjs/react-markdown" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    React Markdown
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Titus Wormer • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">Markdown component for React</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">AI & LLM Integration</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://github.com/openai/openai-node" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    OpenAI Node.js Library
                  </a>
                </h3>
                <p className="text-sm text-gray-600">OpenAI • Apache-2.0 License</p>
                <p className="text-sm text-gray-700 mt-1">Official Node.js library for OpenAI API</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://github.com/togethercomputer/together-typescript" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Together AI SDK
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Together Computer • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">TypeScript SDK for Together AI's API</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://github.com/rexxars/eventsource-parser" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    eventsource-parser
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Espen Hovlandsdal • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">Streaming parser for server-sent events</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://github.com/belladoreai/llama3-tokenizer-js" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    llama3-tokenizer-js
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Belladore AI • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">JavaScript tokenizer for Llama 3 models</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Data Validation & Content Processing</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://zod.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Zod
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Colin McDonnell • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">TypeScript-first schema validation</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://github.com/mozilla/readability" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    @mozilla/readability
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Mozilla • Apache-2.0 License</p>
                <p className="text-sm text-gray-700 mt-1">Readability library from Firefox Reader Mode</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://github.com/jsdom/jsdom" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    jsdom
                  </a>
                </h3>
                <p className="text-sm text-gray-600">jsdom Contributors • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">JavaScript implementation of DOM and HTML standards</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Development Tools</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://www.electron.build/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Electron Builder
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Stefan Judis & Contributors • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">Package and build Electron apps</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://eslint.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    ESLint
                  </a>
                </h3>
                <p className="text-sm text-gray-600">ESLint Team • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">Find and fix JavaScript code problems</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Prettier
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Prettier Team • MIT License</p>
                <p className="text-sm text-gray-700 mt-1">Opinionated code formatter</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">AI Providers & Services</h2>
            <div className="bg-green-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-green-900 mb-3">Special Thanks to AI Providers</h3>
              <ul className="space-y-2 text-green-800">
                <li>
                  <a href="https://ollama.com/" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                    Ollama
                  </a> - For making local AI accessible to everyone
                </li>
                <li>
                  <a href="https://github.com/searxng/searxng" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                    SearXNG
                  </a> - Open source metasearch engine for privacy-focused search
                </li>
                <li><strong>OpenAI, Anthropic, Google, Groq, Together AI</strong> - For their AI APIs that power cloud-based tutoring</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">License Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">Study Buddy License</h3>
              <p className="text-gray-700 mb-4">
                Study Buddy is released under the <strong>MIT License</strong>, which is compatible with all the 
                dependencies listed above. We ensure full compliance with all upstream licenses.
              </p>
              
              <h3 className="font-semibold text-gray-800 mb-3">Type Definitions</h3>
              <p className="text-gray-700 mb-4">
                We also rely on numerous @types/* packages maintained by the{" "}
                <a 
                  href="https://github.com/DefinitelyTyped/DefinitelyTyped" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  DefinitelyTyped
                </a>{" "}
                community, including @types/node, @types/react, @types/react-dom, and @types/jsdom.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Contributing Back</h2>
            <p className="text-gray-700 mb-6">
              We believe in giving back to the open source community. Study Buddy contributes by demonstrating 
              practical AI application patterns, showing how to build privacy-first educational tools, providing 
              examples of Electron + Next.js integration, and creating student-accessible AI tutoring solutions.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Thank You</h3>
              <p className="text-blue-800 text-sm">
                Thank you to every developer, maintainer, and contributor who has made Study Buddy possible. 
                Open source is the foundation of innovation, and we're proud to be part of this incredible ecosystem.
              </p>
              <p className="text-blue-700 text-xs mt-3">
                If we've missed any attribution or you'd like to update information about your project, 
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