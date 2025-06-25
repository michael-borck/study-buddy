"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import desktopImg from "../../public/desktop-screenshot.png";
import mobileImg from "../../public/screenshot-mobile.png";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Study Buddy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Study Buddy is an open-source AI personal tutor that runs locally on your computer, 
              providing personalized education without requiring internet access, accounts, or risking API abuse.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">📚</span>
                Generate comprehensive tutorials on any topic
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">🔍</span>
                Smart search integration for enriched content
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">💬</span>
                Interactive chat for follow-up questions
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">🎨</span>
                Clean, intuitive interface designed for learners
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">📱</span>
                Works offline after initial setup
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">⚡</span>
                Fast local inference with Ollama
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🔌 Provider-Agnostic</h3>
                <p className="text-blue-800">Use Ollama (local), OpenAI, Together AI, or other providers</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">🖥️ Desktop Application</h3>
                <p className="text-green-800">Runs securely on your computer via Electron</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🔒 Privacy-First</h3>
                <p className="text-purple-800">Default local mode means your data never leaves your device</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">💰 Free to Use</h3>
                <p className="text-yellow-800">No API costs with local Ollama mode</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technical Stack</h2>
            <ul className="space-y-1 mb-6">
              <li><strong>Frontend:</strong> Next.js 14, React, TypeScript, Tailwind CSS</li>
              <li><strong>Desktop:</strong> Electron</li>
              <li><strong>AI Integration:</strong> Configurable providers (Ollama, OpenAI, Together AI, and more)</li>
              <li><strong>Search:</strong> Multiple search engines including DuckDuckGo, Brave, and SearXNG</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Screenshots</h2>
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Desktop Interface</h3>
                <Image
                  src={desktopImg}
                  alt="Study Buddy Desktop Interface"
                  className="rounded-lg shadow-md border max-w-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Mobile Interface</h3>
                <Image
                  src={mobileImg}
                  alt="Study Buddy Mobile Interface"
                  className="rounded-lg shadow-md border max-w-sm mx-auto"
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Credits & Attribution</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Original Project</h3>
              <p className="text-gray-700 mb-2">
                Study Buddy is based on{" "}
                <a 
                  href="https://github.com/Nutlope/llamatutor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Llama Tutor
                </a>
                {" "}by Hassan El Mghari (
                <a 
                  href="https://github.com/nutlope" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  @nutlope
                </a>
                ).
              </p>
              <p className="text-gray-600 text-sm">
                The original project showcased the power of AI in education, and we're building on that 
                foundation to make it accessible to all students. The interface screenshots above are 
                from the original Llama Tutor project.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Open Source</h2>
            <p className="text-gray-700 mb-4">
              Study Buddy is fully open source and released under the MIT License. 
              We believe in making education accessible to everyone through open collaboration.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/michael-borck/study-buddy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                ⭐ Star on GitHub
              </a>
              <a
                href="/legal"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📜 View Legal & Licenses
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}