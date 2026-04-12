"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-soft border border-hairline p-8">
          <h1 className="text-3xl font-semibold text-ink mb-8">About Study Buddy</h1>

          <div className="max-w-none" style={{ lineHeight: 1.7 }}>

            {/* Why */}
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Why Study Buddy?</span>
            </div>
            <p className="text-ink-muted mb-4">
              Most AI tutoring tools require you to create an account, hand over your data, and pay a
              subscription. NotebookLM needs a Google account. ChatGPT needs OpenAI. DeepTutor needs
              uploads and cloud processing. They&apos;re powerful, but they&apos;re not private, and they&apos;re not yours.
            </p>
            <p className="text-ink-muted mb-4">
              <strong className="text-ink">You own the whole stack.</strong> The app runs on your laptop. The AI runs
              on your laptop (via Ollama). Your questions, your notes, your learning — none of it leaves
              your machine. There&apos;s no account to create, no data to leak, no subscription to cancel.
            </p>
            <p className="text-ink-muted mb-4">
              <strong className="text-ink">It does one thing well.</strong> Type a topic, get a grounded tutor.
              Study Buddy searches the web for sources, reads them, and uses that content to teach
              you — reducing hallucinations and keeping answers factual. It&apos;s a focused conversation,
              not a research platform. When the session ends, you take away what you learned. Like a real tutor.
            </p>
            <p className="text-ink-muted mb-4">
              <strong className="text-ink">It&apos;s designed for students, not power users.</strong> The interface uses
              plain language, generous whitespace, and a calm visual style built specifically for university
              students — including ESL learners who are already spending mental energy working in a second language.
            </p>
            <p className="text-ink-muted mb-8">
              <strong className="text-ink">Bring your own key, or don&apos;t.</strong> Works with Ollama locally
              (free, no key needed) or any cloud provider you prefer — OpenAI, Anthropic, Google, Groq, Together AI.
              You choose where your data goes.
            </p>

            {/* How it works */}
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">How it works</span>
            </div>
            <p className="text-ink-muted mb-4">
              Study Buddy is a simple grounded tutor — a lightweight RAG (retrieval-augmented generation)
              pipeline that runs fresh for each session:
            </p>
            <ol className="mb-8 list-decimal space-y-2 pl-6 text-ink-muted">
              <li><strong className="text-ink">You type a topic</strong> and choose an education level</li>
              <li><strong className="text-ink">Study Buddy searches the web</strong> for relevant sources (DuckDuckGo by default — free, no key needed)</li>
              <li><strong className="text-ink">It reads those pages</strong> and extracts the content</li>
              <li><strong className="text-ink">If the content is too large</strong> for your model&apos;s context window, it auto-summarises</li>
              <li><strong className="text-ink">The AI teaches you</strong> from that grounded material at your chosen level</li>
              <li><strong className="text-ink">You ask follow-up questions</strong> and the tutor responds in context</li>
            </ol>

            {/* Learning strategies */}
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Learning strategies</span>
            </div>
            <p className="text-ink-muted mb-4">
              A real tutor doesn&apos;t just explain — they quiz you, ask questions, challenge your
              thinking. Study Buddy offers five teaching strategies you can switch between at any time:
            </p>
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Explain</h3>
                <p className="text-sm text-ink-muted">Clear explanations with examples. The default.</p>
              </div>
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Quiz me</h3>
                <p className="text-sm text-ink-muted">Questions from the source material. Wrong answers get hints, not answers.</p>
              </div>
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Socratic</h3>
                <p className="text-sm text-ink-muted">Guided discovery through questions. The tutor never gives direct answers.</p>
              </div>
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Devil&apos;s advocate</h3>
                <p className="text-sm text-ink-muted">Challenges your position to sharpen your thinking.</p>
              </div>
              <div className="rounded-soft border border-hairline p-5 md:col-span-2">
                <h3 className="mb-1 font-semibold text-ink">Perspectives</h3>
                <p className="text-sm text-ink-muted">The topic through different lenses — marketer, engineer, legal, scientist.</p>
              </div>
            </div>

            {/* What it's not */}
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">What it&apos;s not</span>
            </div>
            <p className="text-ink-muted mb-8">
              Study Buddy is not trying to be NotebookLM, DeepTutor, or a general-purpose research
              assistant. It doesn&apos;t do multi-document analysis, audio generation, collaborative notebooks,
              or knowledge graphs. It&apos;s for a student who wants to open an app, type a topic, and have
              a private, grounded conversation about it. Then close the app and get back to studying.
            </p>

            {/* Technical stack */}
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Technical stack</span>
            </div>
            <ul className="mb-8 space-y-1 text-ink-muted">
              <li><strong className="text-ink">Frontend:</strong> Next.js 14, React, TypeScript, Tailwind CSS</li>
              <li><strong className="text-ink">Desktop:</strong> Electron</li>
              <li><strong className="text-ink">Design:</strong> Studio Calm (shared with Talk Buddy)</li>
              <li><strong className="text-ink">AI:</strong> Ollama, OpenAI, Anthropic, Google, Groq, Together AI</li>
              <li><strong className="text-ink">Search:</strong> DuckDuckGo (default), Brave, Bing, Serper, SearXNG</li>
            </ul>

            {/* The Buddy suite */}
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">The Buddy suite</span>
            </div>
            <p className="text-ink-muted mb-4">
              Study Buddy is part of a family of apps for university students. All three share the same
              design system — same font, same warm palette, same calm interface. The only difference is
              the accent colour.
            </p>
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Talk Buddy</h3>
                <p className="text-sm text-ink-muted">Speech practice for high-stakes scenarios</p>
              </div>
              <div className="rounded-soft border border-accent bg-accent-soft p-5">
                <h3 className="mb-1 font-semibold text-ink">Study Buddy</h3>
                <p className="text-sm text-ink-muted">AI personal tutor (you are here)</p>
              </div>
              <div className="rounded-soft border border-hairline p-5">
                <h3 className="mb-1 font-semibold text-ink">Career Compass</h3>
                <p className="text-sm text-ink-muted">Career guidance and interview prep (planned)</p>
              </div>
            </div>

            {/* Credits */}
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Credits</span>
            </div>
            <div className="mb-8 rounded-soft border border-hairline p-6">
              <p className="text-ink-muted mb-2">
                Study Buddy is based on{" "}
                <a
                  href="https://github.com/Nutlope/llamatutor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline transition-colors duration-normal hover:text-accent"
                >
                  Llama Tutor
                </a>{" "}
                by Hassan El Mghari. The original project demonstrated how simple and effective an AI
                tutor could be. Study Buddy builds on that foundation with local-first privacy, provider
                flexibility, and a design system built for the students who need it most.
              </p>
            </div>

            {/* Open source */}
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">Open source</span>
            </div>
            <p className="mb-4 text-ink-muted">
              Study Buddy is fully open source under the MIT Licence.
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
