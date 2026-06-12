import Image from "next/image";
import Link from "next/link";
import { FC, useState, useEffect, useRef } from "react";
import InitialInputArea from "./InitialInputArea";
import { suggestions } from "@/utils/utils";
import { strategies } from "@/utils/strategies";
import { loadClientSettings } from "@/utils/settings";

const PROVIDER_LABELS: Record<string, string> = {
  ollama: "Ollama",
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  groq: "Groq",
  openrouter: "OpenRouter",
  together: "Together AI",
};

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleChat: (messages?: { role: string; content: string }[]) => void;
  ageGroup: string;
  setAgeGroup: React.Dispatch<React.SetStateAction<string>>;
  handleInitialChat: () => void;
  customText: string;
  setCustomText: React.Dispatch<React.SetStateAction<string>>;
  strategyId: string;
  setStrategyId: React.Dispatch<React.SetStateAction<string>>;
  nudgeEnabled: boolean;
  setNudgeEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  searchWeb: boolean;
  setSearchWeb: React.Dispatch<React.SetStateAction<boolean>>;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleChat,
  ageGroup,
  setAgeGroup,
  handleInitialChat,
  customText,
  setCustomText,
  strategyId,
  setStrategyId,
  nudgeEnabled,
  setNudgeEnabled,
  searchWeb,
  setSearchWeb,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showFirstRun, setShowFirstRun] = useState(false);
  const [providerWarning, setProviderWarning] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{
    type: "loading" | "error";
    message: string;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("studybuddy-first-run-dismissed");
    if (dismissed !== "true") {
      setShowFirstRun(true);
    }
  }, []);

  // Check the AI provider is reachable before the user invests in a session.
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const settings = loadClientSettings();
      const label = PROVIDER_LABELS[settings.llmProvider] || settings.llmProvider;
      const warning =
        settings.llmProvider === "ollama"
          ? "I can't reach Ollama right now. Make sure it's running on your computer, or pick another provider in Settings."
          : `I can't reach ${label} right now. Check your secret key and connection in Settings.`;
      try {
        const res = await fetch("/api/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: settings.llmProvider,
            baseUrl: settings.llmBaseUrl || undefined,
            apiKey: settings.llmApiKey || undefined,
          }),
        });
        if (!cancelled) setProviderWarning(res.ok ? null : warning);
      } catch {
        if (!cancelled) setProviderWarning(warning);
      }
    };

    check();
    window.addEventListener("settingsChanged", check);
    window.addEventListener("settingsLoaded", check);
    return () => {
      cancelled = true;
      window.removeEventListener("settingsChanged", check);
      window.removeEventListener("settingsLoaded", check);
    };
  }, []);

  const dismissFirstRun = () => {
    setShowFirstRun(false);
    localStorage.setItem("studybuddy-first-run-dismissed", "true");
  };

  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  const importFile = async (file: File) => {
    const ext = file.name.toLowerCase().split(".").pop();
    setImportStatus({ type: "loading", message: `Reading ${file.name}...` });
    try {
      let text = "";
      if (ext === "pdf") {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/parseDocument", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not read this file");
        text = data.text;
      } else if (ext === "txt" || ext === "md") {
        text = (await file.text()).trim();
      } else {
        throw new Error("Only PDF, TXT and MD files are supported");
      }
      if (!text) throw new Error("No readable text found in this file");
      setCustomText((prev) =>
        prev
          ? `${prev}\n\n--- From ${file.name} ---\n\n${text}`
          : `--- From ${file.name} ---\n\n${text}`,
      );
      setImportStatus(null);
    } catch (e) {
      setImportStatus({
        type: "error",
        message:
          e instanceof Error ? e.message : "Could not read this file",
      });
    }
  };

  const selectedStrategy = strategies.find((s) => s.id === strategyId) || strategies[0];

  return (
    <>
      <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center justify-center sm:mt-12">

        {/* First-run banner */}
        {showFirstRun && (
          <div className="mb-4 w-full rounded-soft border border-accent bg-accent-soft px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-ink-muted" style={{ lineHeight: 1.6 }}>
                <strong className="text-ink">First time?</strong> You&apos;ll need an AI model
                running.{" "}
                <a
                  href="https://ollama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink underline transition-colors duration-normal hover:text-accent"
                >
                  Set up Ollama (free)
                </a>{" "}
                or go to{" "}
                <Link
                  href="/settings"
                  className="font-medium text-ink underline transition-colors duration-normal hover:text-accent"
                >
                  Settings
                </Link>{" "}
                to add a cloud provider.
              </p>
              <button
                onClick={dismissFirstRun}
                className="shrink-0 text-ink-quiet transition-colors duration-normal hover:text-ink"
                title="Dismiss"
                aria-label="Dismiss"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Provider connectivity warning (hidden while the first-run banner covers setup) */}
        {!showFirstRun && providerWarning && (
          <div className="mb-4 w-full rounded-soft border border-hairline-strong bg-paper-warm px-4 py-3">
            <p className="text-sm text-ink-muted" style={{ lineHeight: 1.6 }}>
              {providerWarning}{" "}
              <Link
                href="/settings"
                className="font-medium text-ink underline transition-colors duration-normal hover:text-accent"
              >
                Open Settings
              </Link>
            </p>
          </div>
        )}

        <h2 className="mt-2 text-center text-4xl font-semibold tracking-tight text-ink sm:text-6xl" style={{ lineHeight: 1.1 }}>
          Your Personal{" "}
          <span className="text-accent">Tutor</span>
        </h2>
        <p className="mt-4 max-w-2xl text-balance text-center text-sm text-ink-muted sm:text-base" style={{ lineHeight: 1.7 }}>
          Type a topic, get a grounded tutor. Study Buddy searches the web for
          sources, reads them, and uses that content to teach you — reducing
          hallucinations and keeping answers factual. When the session ends, you
          take away what you learned. Like a real tutor.
        </p>

        {/* Input area */}
        <div className="mt-6 w-full pb-3">
          <InitialInputArea
            promptValue={promptValue}
            handleInitialChat={handleInitialChat}
            setPromptValue={setPromptValue}
            handleChat={handleChat}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
          />
        </div>

        {/* Topic suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-5 lg:flex-nowrap lg:justify-normal">
          {suggestions.map((item) => (
            <button
              type="button"
              className="flex h-[35px] cursor-pointer items-center justify-center gap-[5px] rounded-soft border border-hairline px-2.5 py-2 transition-colors duration-normal hover:border-hairline-strong"
              onClick={() => handleClickSuggestion(item?.name)}
              key={item.id}
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={18}
                height={16}
                className="w-[18px]"
              />
              <span className="text-sm text-ink-muted" style={{ fontWeight: 400 }}>
                {item.name}
              </span>
            </button>
          ))}
        </div>

        {/* Strategy selector */}
        <div className="mb-4 w-full">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-ink-quiet">
            How should I teach?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {strategies.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStrategyId(s.id)}
                aria-pressed={strategyId === s.id}
                className={`rounded-soft px-3 py-1.5 text-sm transition-colors duration-normal ${
                  strategyId === s.id
                    ? "bg-ink text-paper"
                    : "border border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-ink-quiet">
            {selectedStrategy.description}
          </p>
        </div>

        {/* Options row: nudge + search + notes */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={nudgeEnabled}
              onChange={(e) => setNudgeEnabled(e.target.checked)}
              className="h-3.5 w-3.5 cursor-pointer rounded-sm accent-accent"
            />
            Make me think
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={searchWeb}
              onChange={(e) => setSearchWeb(e.target.checked)}
              className="h-3.5 w-3.5 cursor-pointer rounded-sm accent-accent"
            />
            Search the web
          </label>

          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="text-sm text-ink-muted transition-colors duration-normal hover:text-accent"
            style={{ fontWeight: 500 }}
          >
            {showNotes ? "Hide notes" : "Paste your own material"}
          </button>
        </div>

        {/* Collapsible notes textarea */}
        {showNotes && (
          <div
            className="mb-4 w-full"
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) importFile(file);
            }}
          >
            <textarea
              placeholder="Paste lecture notes or textbook excerpts here — or drop a PDF, TXT or MD file..."
              className={`w-full resize-y rounded-soft border bg-paper p-4 text-sm text-ink placeholder:text-ink-quiet transition-colors duration-normal hover:border-hairline-strong focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent-soft ${
                dragActive ? "border-accent ring-[3px] ring-accent-soft" : "border-hairline"
              }`}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={4}
              style={{ lineHeight: 1.7 }}
            />
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) importFile(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={importStatus?.type === "loading"}
                className="text-xs text-ink-muted underline transition-colors duration-normal hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Attach a file (PDF, TXT, MD)
              </button>
              {importStatus && (
                <span
                  className={`text-xs ${
                    importStatus.type === "error" ? "text-error" : "text-ink-quiet"
                  }`}
                >
                  {importStatus.message}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-start gap-4">
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
                <input
                  type="radio"
                  name="noteMode"
                  checked={searchWeb}
                  onChange={() => setSearchWeb(true)}
                  className="h-3 w-3 cursor-pointer accent-accent"
                />
                Add to web search results
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
                <input
                  type="radio"
                  name="noteMode"
                  checked={!searchWeb}
                  onChange={() => setSearchWeb(false)}
                  className="h-3 w-3 cursor-pointer accent-accent"
                />
                Use only my notes
              </label>
            </div>
          </div>
        )}

        {/* Value prop + open source */}
        <div className="mt-2 max-w-xl space-y-3 text-center text-xs text-ink-quiet" style={{ lineHeight: 1.7 }}>
          <p>
            Most AI tutoring tools require accounts, hand over your data, and
            charge a subscription. Study Buddy runs on your computer. Your
            questions never leave your machine.
          </p>
          <p>
            Fully open source.{" "}
            <a
              href="https://github.com/michael-borck/study-buddy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-muted underline transition-colors duration-normal hover:text-accent"
            >
              Star it on GitHub.
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Hero;
