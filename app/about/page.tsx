"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import desktopImg from "../../public/desktop-screenshot.png";
import mobileImg from "../../public/screenshot-mobile.png";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-soft border border-hairline p-8">
          <h1 className="text-3xl font-semibold text-ink mb-8">About Study Buddy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-ink-muted mb-6" style={{ lineHeight: 1.7 }}>
              Study Buddy is an open-source AI personal tutor that runs locally on your computer,
              providing personalised education without requiring internet access, accounts, or risking API abuse.
            </p>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Features</span>
            </div>
            <ul className="mb-8 space-y-2">
              <li className="flex items-center text-ink-muted">
                <span className="mr-3 text-accent">&#9679;</span>
                Generate comprehensive tutorials on any topic
              </li>
              <li className="flex items-center text-ink-muted">
                <span className="mr-3 text-accent">&#9679;</span>
                Smart search integration for enriched content
              </li>
              <li className="flex items-center text-ink-muted">
                <span className="mr-3 text-accent">&#9679;</span>
                Interactive chat for follow-up questions
              </li>
              <li className="flex items-center text-ink-muted">
                <span className="mr-3 text-accent">&#9679;</span>
                Clean, intuitive interface designed for learners
              </li>
              <li className="flex items-center text-ink-muted">
                <span className="mr-3 text-accent">&#9679;</span>
                Works offline after initial setup
              </li>
              <li className="flex items-center text-ink-muted">
                <span className="mr-3 text-accent">&#9679;</span>
                Fast local inference with Ollama
              </li>
            </ul>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Key benefits</span>
            </div>
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Provider-agnostic</h3>
                <p className="text-sm text-ink-muted">Use Ollama (local), OpenAI, Together AI, or other providers</p>
              </div>
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Desktop application</h3>
                <p className="text-sm text-ink-muted">Runs securely on your computer via Electron</p>
              </div>
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Privacy-first</h3>
                <p className="text-sm text-ink-muted">Default local mode means your data never leaves your device</p>
              </div>
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Free to use</h3>
                <p className="text-sm text-ink-muted">No costs with local Ollama mode</p>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Technical stack</span>
            </div>
            <ul className="mb-8 space-y-1 text-ink-muted">
              <li><strong className="text-ink">Frontend:</strong> Next.js 14, React, TypeScript, Tailwind CSS</li>
              <li><strong className="text-ink">Desktop:</strong> Electron</li>
              <li><strong className="text-ink">AI Integration:</strong> Configurable providers (Ollama, OpenAI, Together AI, and more)</li>
              <li><strong className="text-ink">Search:</strong> Multiple search engines including DuckDuckGo, Brave, and SearXNG</li>
            </ul>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Screenshots</span>
            </div>
            <div className="mb-8 space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-medium text-ink">Desktop interface</h3>
                <Image
                  src={desktopImg}
                  alt="Study Buddy Desktop Interface"
                  className="rounded-soft border border-hairline max-w-full"
                />
              </div>
              <div>
                <h3 className="mb-3 text-lg font-medium text-ink">Mobile interface</h3>
                <Image
                  src={mobileImg}
                  alt="Study Buddy Mobile Interface"
                  className="mx-auto max-w-sm rounded-soft border border-hairline"
                />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Credits</span>
            </div>
            <div className="mb-8 rounded-soft border border-hairline p-6">
              <h3 className="mb-2 font-semibold text-ink">Original project</h3>
              <p className="mb-2 text-ink-muted">
                Study Buddy is based on{" "}
                <a
                  href="https://github.com/Nutlope/llamatutor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline transition-colors duration-normal hover:text-accent"
                >
                  Llama Tutor
                </a>
                {" "}by Hassan El Mghari (
                <a
                  href="https://github.com/nutlope"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline transition-colors duration-normal hover:text-accent"
                >
                  @nutlope
                </a>
                ).
              </p>
              <p className="text-sm text-ink-quiet">
                The original project showcased the power of AI in education, and we&apos;re building on that
                foundation to make it accessible to all students.
              </p>
            </div>

            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Open source</span>
            </div>
            <p className="mb-4 text-ink-muted">
              Study Buddy is fully open source and released under the MIT License.
              We believe in making education accessible to everyone through open collaboration.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/michael-borck/study-buddy"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-soft bg-ink px-6 py-3 font-medium text-paper transition-colors duration-normal hover:bg-accent"
              >
                Star on GitHub
              </a>
              <a
                href="/legal"
                className="rounded-soft border border-hairline px-6 py-3 text-ink transition-colors duration-normal hover:border-hairline-strong hover:text-accent"
              >
                View legal and licences
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
