import Image from "next/image";
import Link from "next/link";
import { FC, useState, useEffect, useRef, useCallback } from "react";
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
  const [ollamaDown, setOllamaDown] = useState(false);
  const [checking, setChecking] = useState(false);
  const [ollamaNoModels, setOllamaNoModels] = useState(false);
  const [recommendedModel, setRecommendedModel] = useState("llama3.1:8b");
  const [pullProgress, setPullProgress] = useState<{
    status: string;
    percent: number | null;
  } | null>(null);
  const [pullError, setPullError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("studybuddy-first-run-dismissed");
    if (dismissed !== "true") {
      setShowFirstRun(true);
    }
  }, []);

  // Check the AI provider is reachable before the user invests in a session.
  // For Ollama, an unreachable provider starts the guided setup journey
  // (install → check again → download a model) instead of a plain warning.
  const runProviderCheck = useCallback(async () => {
    setChecking(true);
    const settings = loadClientSettings();
    const isOllama = settings.llmProvider === "ollama";
    const label = PROVIDER_LABELS[settings.llmProvider] || settings.llmProvider;
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
      if (res.ok) {
        const data = await res.json().catch(() => ({ models: [] }));
        const models: string[] = data.models || [];
        setProviderWarning(null);
        setOllamaDown(false);
        // Ollama is up but has nothing to run — offer a download.
        setOllamaNoModels(isOllama && models.length === 0);
        setRecommendedModel(settings.llmModel || "llama3.1:8b");
      } else {
        throw new Error(`Provider check failed: ${res.status}`);
      }
    } catch {
      setOllamaNoModels(false);
      if (isOllama) {
        setOllamaDown(true);
        setProviderWarning(null);
      } else {
        setOllamaDown(false);
        setProviderWarning(
          `I can't reach ${label} right now. Check your secret key and connection in Settings.`,
        );
      }
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    runProviderCheck();
    window.addEventListener("settingsChanged", runProviderCheck);
    window.addEventListener("settingsLoaded", runProviderCheck);
    return () => {
      window.removeEventListener("settingsChanged", runProviderCheck);
      window.removeEventListener("settingsLoaded", runProviderCheck);
    };
  }, [runProviderCheck]);

  const dismissFirstRun = () => {
    setShowFirstRun(false);
    localStorage.setItem("studybuddy-first-run-dismissed", "true");
  };

  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  const startModelPull = async () => {
    const settings = loadClientSettings();
    const model = settings.llmModel || "llama3.1:8b";
    setPullError(null);
    setPullProgress({ status: "Starting download...", percent: null });
    try {
      const res = await fetch("/api/pullModel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          baseUrl: settings.llmBaseUrl || undefined,
        }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Download failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffered = "";
      let success = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffered += decoder.decode(value, { stream: true });
        const lines = buffered.split("\n");
        buffered = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          let evt: { error?: string; status?: string; total?: number; completed?: number };
          try {
            evt = JSON.parse(line);
          } catch {
            continue;
          }
          if (evt.error) throw new Error(evt.error);
          if (evt.status === "success") success = true;
          setPullProgress({
            status: evt.status || "Downloading...",
            percent:
              evt.total && evt.completed != null
                ? Math.round((evt.completed / evt.total) * 100)
                : null,
          });
        }
      }
      if (!success) {
        throw new Error("Download did not complete. Please try again.");
      }
      setPullProgress(null);
      // Re-probe so the banner clears only once the model is really there.
      await runProviderCheck();
    } catch (e) {
      setPullProgress(null);
      setPullError(
        e instanceof Error ? e.message : "Download failed. Please try again.",
      );
    }
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

        {/* First-run banner (suppressed while the guided Ollama setup is showing) */}
        {showFirstRun && !ollamaDown && !ollamaNoModels && (
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

        {/* Ollama isn't reachable — guided setup, no terminal needed */}
        {ollamaDown && (
          <div className="mb-4 w-full rounded-soft border border-hairline-strong bg-paper-warm px-4 py-4">
            <p className="text-sm text-ink-muted" style={{ lineHeight: 1.6 }}>
              <strong className="text-ink">Set up your AI tutor.</strong> Study
              Buddy works with Ollama — free, private AI that runs on your own
              computer. No account needed. Install it, then come back here.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href="https://ollama.com/download"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-soft bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors duration-normal hover:bg-accent"
              >
                Get Ollama (free)
              </a>
              <button
                type="button"
                onClick={runProviderCheck}
                disabled={checking}
                className="rounded-soft border border-hairline px-4 py-2 text-sm font-medium text-ink-muted transition-colors duration-normal hover:border-hairline-strong hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checking ? "Checking..." : "I've installed it — check again"}
              </button>
              <Link
                href="/settings"
                className="text-sm text-ink-muted underline transition-colors duration-normal hover:text-accent"
              >
                Use a cloud provider instead
              </Link>
            </div>
          </div>
        )}

        {/* Ollama is reachable but has no models — offer a one-click download */}
        {!providerWarning && ollamaNoModels && (
          <div className="mb-4 w-full rounded-soft border border-hairline-strong bg-paper-warm px-4 py-3">
            {pullProgress ? (
              <div>
                <p className="text-sm text-ink-muted" style={{ lineHeight: 1.6 }}>
                  Downloading <strong className="text-ink">{recommendedModel}</strong>
                  {pullProgress.percent != null ? ` — ${pullProgress.percent}%` : ""}{" "}
                  <span className="text-ink-quiet">({pullProgress.status})</span>
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-normal"
                    style={{ width: `${pullProgress.percent ?? 2}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-ink-quiet">
                  This is a one-time download. You can keep this page open.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-muted" style={{ lineHeight: 1.6 }}>
                  <strong className="text-ink">Almost there!</strong> Ollama is
                  running, but no AI model is installed yet.
                  {pullError && (
                    <span className="block text-error">{pullError}</span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={startModelPull}
                  className="shrink-0 rounded-soft bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors duration-normal hover:bg-accent"
                >
                  Download {recommendedModel} (a few GB)
                </button>
              </div>
            )}
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
