import Image from "next/image";
import { FC, useState, useEffect } from "react";
import InitialInputArea from "./InitialInputArea";
import { suggestions } from "@/utils/utils";
import { strategies } from "@/utils/strategies";

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

  useEffect(() => {
    const dismissed = localStorage.getItem("studybuddy-first-run-dismissed");
    if (dismissed !== "true") {
      setShowFirstRun(true);
    }
  }, []);

  const dismissFirstRun = () => {
    setShowFirstRun(false);
    localStorage.setItem("studybuddy-first-run-dismissed", "true");
  };

  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
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
                <a
                  href="/settings"
                  className="font-medium text-ink underline transition-colors duration-normal hover:text-accent"
                >
                  Settings
                </a>{" "}
                to add a cloud provider.
              </p>
              <button
                onClick={dismissFirstRun}
                className="shrink-0 text-ink-quiet transition-colors duration-normal hover:text-ink"
                title="Dismiss"
              >
                &times;
              </button>
            </div>
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
            <div
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
            </div>
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
          <div className="mb-4 w-full">
            <textarea
              placeholder="Paste lecture notes, textbook excerpts, or any extra material here..."
              className="w-full resize-y rounded-soft border border-hairline bg-paper p-4 text-sm text-ink placeholder:text-ink-quiet transition-colors duration-normal hover:border-hairline-strong focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent-soft"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={4}
              style={{ lineHeight: 1.7 }}
            />
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
